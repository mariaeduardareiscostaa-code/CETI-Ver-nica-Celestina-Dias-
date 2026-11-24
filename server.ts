/// <reference types="node" />

import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { type Request, type Response, type NextFunction } from 'express';
import { put as putVercelBlob } from '@vercel/blob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_VERCEL = Boolean(process.env.VERCEL);

// Persistent storage directories (writable local ./data on Node/VPS/AI Studio, /tmp on Vercel serverless)
const DATA_DIR = IS_VERCEL ? path.join(os.tmpdir(), 'ceti_vcd_data') : path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const BOOK_COVERS_DIR = path.join(UPLOADS_DIR, 'books');
const DB_PATH = path.join(DATA_DIR, 'mural_avisos.db');
const SECRET_PATH = path.join(DATA_DIR, '.session_secret');

for (const dir of [DATA_DIR, UPLOADS_DIR, BOOK_COVERS_DIR]) {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch {
    // ignore mkdir failures on constrained environments
  }
}

// Optional Cloud Persistence (Vercel Blob + Vercel KV / Upstash Redis)
const BLOB_TOKEN = (process.env.BLOB_READ_WRITE_TOKEN || '').trim();
const REDIS_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '').trim().replace(/\/+$/, '');
const REDIS_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '').trim();
const HAS_BLOB = Boolean(BLOB_TOKEN);
const HAS_REDIS = Boolean(REDIS_URL && REDIS_TOKEN);

const REDIS_BOOKS_KEY = 'vcd:library:books:v1';
const REDIS_RESERVATIONS_KEY = 'vcd:library:reservations:v1';
const REDIS_NOTICES_KEY = 'vcd:mural:notices:v1';
const REDIS_COVER_PREFIX = 'vcd:library:cover:';
const REDIS_NOTICE_ATT_PREFIX = 'vcd:mural:att:';

async function redisCommand<T = unknown>(args: unknown[]): Promise<T | null> {
  if (!HAS_REDIS) return null;
  const response = await fetch(REDIS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  if (!response.ok) {
    throw new Error(`Redis REST error (${response.status})`);
  }
  const data = (await response.json()) as { result?: T; error?: string };
  if (data?.error) {
    throw new Error(data.error);
  }
  return (data?.result ?? null) as T | null;
}

async function redisGetJson<T>(key: string): Promise<T | null> {
  const raw = await redisCommand<string | null>(['GET', key]);
  if (!raw || typeof raw !== 'string') return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function redisSetJson(key: string, value: unknown): Promise<void> {
  await redisCommand(['SET', key, JSON.stringify(value)]);
}

// Load or generate stable server-side HMAC session secret
function getSessionSecret(): string {
  if (process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET !== 'MY_ADMIN_SESSION_SECRET') {
    return process.env.ADMIN_SESSION_SECRET;
  }
  try {
    if (fs.existsSync(SECRET_PATH)) {
      const existing = fs.readFileSync(SECRET_PATH, 'utf8').trim();
      if (existing.length >= 32) return existing;
    }
    const generated = crypto.randomBytes(48).toString('hex');
    fs.writeFileSync(SECRET_PATH, generated, { mode: 0o600 });
    return generated;
  } catch {
    // Deterministic fallback derived from ADMIN_ACCESS_KEY on stateless/read-only serverless hosts
    return crypto
      .createHash('sha256')
      .update(`ceti-vcd-session:${process.env.ADMIN_ACCESS_KEY || '12345'}`)
      .digest('hex');
  }
}

const SESSION_SECRET = getSessionSecret();
const ADMIN_ACCESS_KEY = (process.env.ADMIN_ACCESS_KEY || '12345').trim();
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

// Seed Data
const SEED_NOTICES = [
  {
    id: 'notice-seed-01',
    title: 'Calendário Oficial das Avaliações Bimestrais (4º Bimestre)',
    description:
      'A Coordenação Pedagógica informa aos estudantes e responsáveis da 1ª, 2ª e 3ª séries do Ensino Médio Integral que as avaliações bimestrais ocorrerão entre os dias 24 e 28 de novembro, no turno da manhã. É indispensável comparecer com fardamento completo e material escolar próprio. Confira os conteúdos revisados pelos professores em sala e na Biblioteca Digital.',
    category: 'Avaliações',
    publishedDate: '2026-11-17',
    isHighlighted: true,
    authorName: 'Coordenação Pedagógica',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'notice-seed-02',
    title: 'Plantão Pedagógico e Reunião com Pais e Responsáveis',
    description:
      'Convidamos todos os pais e responsáveis para a reunião geral de acompanhamento pedagógico do 4º bimestre, que será realizada no Pátio Coberto do CETI Verônica Celestina Dias às 08h30. Na ocasião serão entregues os boletins parciais e alinhadas as metas de frequência e aprovação para o encerramento do ano letivo.',
    category: 'Reuniões',
    publishedDate: '2026-11-15',
    isHighlighted: true,
    authorName: 'Direção Escolar',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'notice-seed-03',
    title: 'Feira Tecnológica e Mostra de Projetos dos Cursos Técnicos 2026',
    description:
      'As turmas dos cursos Técnicos em Administração, Desenvolvimento de Sistemas e Controle Ambiental apresentarão seus projetos integradores abertos à comunidade escolar de Campo Alegre do Fidalgo. Haverá exposição de protótipos, planos de negócios e ações de educação ambiental no pátio e laboratórios.',
    category: 'Eventos',
    publishedDate: '2026-11-12',
    isHighlighted: false,
    authorName: 'Coordenação dos Cursos Técnicos',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: 'notice-seed-04',
    title: 'Horário de Funcionamento da Biblioteca Escolar para Estudos e Reservas',
    description:
      'Lembramos aos alunos que a biblioteca física funciona durante todos os intervalos (09h30, 11h50 e 14h50) para retirada de exemplares reservados pelo portal digital e estudo orientado. O prazo padrão de empréstimo é de 14 dias corridos.',
    category: 'Comunicados',
    publishedDate: '2026-11-10',
    isHighlighted: false,
    authorName: 'Equipe da Biblioteca',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
  },
  {
    id: 'notice-seed-05',
    title: 'Normas sobre Uso de Fardamento Completo e Pontualidade na Entrada',
    description:
      'Reforçamos junto às famílias que o portão principal é aberto às 07h15 e o início da 1ª aula ocorre pontualmente às 07h30. O uso do fardamento padrão da rede estadual SEDUC-PI e do crachá ou identificação escolar é obrigatório para acesso e permanência no tempo integral.',
    category: 'Geral',
    publishedDate: '2026-11-08',
    isHighlighted: false,
    authorName: 'Direção Escolar',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
  },
];

export interface ServerBook {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  year: number;
  pages: number;
  publisher: string;
  synopsis: string;
  shelfLocation: string;
  totalCopies: number;
  availableCopies: number;
  coverGradient: string;
  coverImage?: string;
  badge?: string;
  recommendedGrade: string;
  rating: number;
  tags: string[];
}

export interface ServerBookReservation {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCategory: string;
  shelfLocation: string;
  studentName: string;
  studentMatricula: string;
  studentGrade: string;
  studentContact: string;
  reservationDate: string;
  pickupDeadline: string;
  returnDeadline: string;
  status: 'Pendente para Retirada' | 'Aprovado para Retirada' | 'Retirado / Emprestado' | 'Devolvido' | 'Cancelado';
  notes: string;
}

const ASSET_ESTRELA_TOKEN = '__ASSET_ESTRELA__';

const SEED_BOOKS: ServerBook[] = [
  {
    id: 'book-01',
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    category: 'Literatura Brasileira',
    isbn: '978-85-359-1484-9',
    year: 1899,
    pages: 256,
    publisher: 'Companhia das Letras / Acervo PNLD',
    synopsis:
      'Clássico absoluto da literatura brasileira em que Bentinho narra suas memórias, a juventude ao lado de Capitu e as dúvidas que marcaram sua vida. Leitura essencial para vestibulares e o ENEM.',
    shelfLocation: 'Estante 01 · Prateleira A (Literatura Clássica)',
    totalCopies: 8,
    availableCopies: 6,
    coverGradient: 'from-emerald-800 to-emerald-950',
    badge: 'Clássico ENEM',
    recommendedGrade: '1º ao 3º Ano do Ensino Médio',
    rating: 4.9,
    tags: ['Realismo', 'ENEM', 'Machado de Assis', 'Literatura Brasileira'],
  },
  {
    id: 'book-02',
    title: 'Vidas Secas',
    author: 'Graciliano Ramos',
    category: 'Autores do Piauí e Nordeste',
    isbn: '978-85-01-09012-4',
    year: 1938,
    pages: 176,
    publisher: 'Editora Record / SEDUC-PI',
    synopsis:
      'Retrato comovente da resistência de Fabiano, Sinhá Vitória, seus filhos e a cachorra Baleia enfrentando a seca no sertão nordestino. Obra-prima do Modernismo de 30.',
    shelfLocation: 'Estante 02 · Prateleira B (Nordeste & Sertão)',
    totalCopies: 7,
    availableCopies: 5,
    coverGradient: 'from-amber-800 to-stone-900',
    badge: 'Destaque Nordeste',
    recommendedGrade: '2º e 3º Ano do Ensino Médio',
    rating: 4.9,
    tags: ['Regionalismo', 'Nordeste', 'ENEM', 'Modernismo'],
  },
  {
    id: 'book-03',
    title: 'Capitães da Areia',
    author: 'Jorge Amado',
    category: 'Literatura Brasileira',
    isbn: '978-85-359-1169-5',
    year: 1937,
    pages: 280,
    publisher: 'Companhia das Letras',
    synopsis:
      'Acompanhe Pedro Bala e os jovens que vivem nas ruas de Salvador em uma história marcante sobre amizade, desigualdade social, solidariedade e busca por liberdade.',
    shelfLocation: 'Estante 01 · Prateleira C (Romances Sociais)',
    totalCopies: 6,
    availableCopies: 4,
    coverGradient: 'from-teal-800 to-emerald-950',
    badge: 'Mais Reservado',
    recommendedGrade: '1º ao 3º Ano do Ensino Médio',
    rating: 4.8,
    tags: ['Jorge Amado', 'Romance Social', 'Juventude', 'Literatura'],
  },
  {
    id: 'book-04',
    title: 'A Hora da Estrela',
    author: 'Clarice Lispector',
    category: 'Literatura Brasileira',
    isbn: '978-85-325-0812-6',
    year: 1977,
    pages: 88,
    publisher: 'Editora Rocco',
    synopsis:
      'A trajetória sensível e poética de Macabéa, jovem alagoana que tenta construir uma vida no Rio de Janeiro, narrada pelo escritor Rodrigo S. M. em uma das maiores obras de Clarice Lispector.',
    shelfLocation: 'Estante 01 · Prateleira B (Prosa Poética)',
    totalCopies: 6,
    availableCopies: 5,
    coverGradient: 'from-emerald-700 to-slate-900',
    coverImage: ASSET_ESTRELA_TOKEN,
    badge: 'Leitura Obrigatória',
    recommendedGrade: '2º e 3º Ano do Ensino Médio',
    rating: 4.9,
    tags: ['Clarice Lispector', 'Macabéa', 'ENEM', 'Literatura Brasileira'],
  },
  {
    id: 'book-05',
    title: 'Redação Nota 1000: Técnicas e Repertórios para o ENEM',
    author: 'Profª. Clarice Mendonça & Equipe Pedagógica',
    category: 'ENEM & Vestibulares',
    isbn: '978-85-9021-410-2',
    year: 2025,
    pages: 224,
    publisher: 'Cadernos Pedagógicos SEDUC-PI',
    synopsis:
      'Guia prático com análise das 5 competências da redação do ENEM, modelos comentados, repertórios socioculturais atualizados e propostas de intervenção estruturadas.',
    shelfLocation: 'Estante 03 · Prateleira A (Bancada Preparatória ENEM)',
    totalCopies: 10,
    availableCopies: 8,
    coverGradient: 'from-blue-800 to-slate-950',
    badge: 'Foco ENEM',
    recommendedGrade: '1º ao 3º Ano (Pré-ENEM)',
    rating: 5.0,
    tags: ['Redação', 'ENEM', 'Competências', 'Vestibular'],
  },
  {
    id: 'book-06',
    title: 'Poesia Completa & Crônicas do Piauí',
    author: 'Da Costa e Silva & Torquato Neto',
    category: 'Autores do Piauí e Nordeste',
    isbn: '978-85-7463-218-9',
    year: 2022,
    pages: 196,
    publisher: 'Academia Piauiense de Letras / Ed. Nova Aliança',
    synopsis:
      'Coletânea especial reunindo os maiores nomes da literatura piauiense, incluindo o clássico "Saudade" de Da Costa e Silva e a vanguarda poética de Torquato Neto.',
    shelfLocation: 'Estante 02 · Prateleira A (Autores Piauienses)',
    totalCopies: 5,
    availableCopies: 5,
    coverGradient: 'from-emerald-800 to-teal-950',
    badge: 'Cultura Piauiense',
    recommendedGrade: '1º ao 3º Ano do Ensino Médio',
    rating: 4.8,
    tags: ['Piauí', 'Poesia', 'Torquato Neto', 'Cultura Regional'],
  },
  {
    id: 'book-07',
    title: 'Biologia, Ecologia e Meio Ambiente no Semiárido',
    author: 'Prof. Dhones Almeida & Instituto Ambiental',
    category: 'Ciências da Natureza',
    isbn: '978-85-412-0932-1',
    year: 2024,
    pages: 240,
    publisher: 'Acervo Técnico SEDUC-PI',
    synopsis:
      'Material didático voltado à compreensão dos biomas brasileiros, com ênfase na Caatinga piauiense, gestão sustentável da água, biodiversidade e questões ambientais cobradas no ENEM.',
    shelfLocation: 'Estante 04 · Prateleira A (Ciências & Meio Ambiente)',
    totalCopies: 6,
    availableCopies: 4,
    coverGradient: 'from-green-800 to-emerald-950',
    badge: 'Controle Ambiental',
    recommendedGrade: '1º ao 3º Ano · Téc. Controle Ambiental',
    rating: 4.7,
    tags: ['Biologia', 'Caatinga', 'Controle Ambiental', 'ENEM'],
  },
  {
    id: 'book-08',
    title: 'Lógica de Programação e Desenvolvimento Web Moderno',
    author: 'Equipe Técnica CETI · Desenvolvimento de Sistemas',
    category: 'Matemática & Tecnologia',
    isbn: '978-85-7522-890-4',
    year: 2025,
    pages: 312,
    publisher: 'Coleção Ensino Técnico Integrado',
    synopsis:
      'Introdução estruturada a algoritmos, estruturas de dados, HTML, CSS, TypeScript e boas práticas de engenharia de software para estudantes do curso Técnico em Desenvolvimento de Sistemas.',
    shelfLocation: 'Estante 05 · Prateleira A (Tecnologia & Informática)',
    totalCopies: 8,
    availableCopies: 7,
    coverGradient: 'from-indigo-800 to-slate-950',
    badge: 'Curso Técnico',
    recommendedGrade: '1º ao 3º Ano · Desenv. de Sistemas',
    rating: 4.9,
    tags: ['Programação', 'Algoritmos', 'Desenvolvimento de Sistemas', 'TI'],
  },
  {
    id: 'book-09',
    title: 'O Mundo de Sofia — Romance da História da Filosofia',
    author: 'Jostein Gaarder',
    category: 'Filosofia & Sociologia',
    isbn: '978-85-359-0234-1',
    year: 1995,
    pages: 568,
    publisher: 'Companhia das Letras',
    synopsis:
      'Por meio de cartas misteriosas recebidas pela jovem Sofia, o leitor percorre os principais pensadores da humanidade, dos pré-socráticos à filosofia contemporânea.',
    shelfLocation: 'Estante 03 · Prateleira C (Ciências Humanas)',
    totalCopies: 4,
    availableCopies: 3,
    coverGradient: 'from-purple-900 to-slate-950',
    badge: 'Humanas',
    recommendedGrade: '1º ao 3º Ano do Ensino Médio',
    rating: 4.8,
    tags: ['Filosofia', 'Sociologia', 'Pensamento Crítico', 'ENEM'],
  },
];

function createInitialReservations(): ServerBookReservation[] {
  return [
    {
      id: 'CETI-LIB-2026-4821',
      bookId: 'book-05',
      bookTitle: 'Redação Nota 1000: Técnicas e Repertórios para o ENEM',
      bookAuthor: 'Profª. Clarice Mendonça & Equipe Pedagógica',
      bookCategory: 'ENEM & Vestibulares',
      shelfLocation: 'Estante 03 · Prateleira A (Bancada Preparatória ENEM)',
      studentName: 'Ana Clara Fernandes',
      studentMatricula: '2024-VCD-1089',
      studentGrade: '3º Ano A - Ensino Médio Integral',
      studentContact: '(89) 99422-1100',
      reservationDate: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      pickupDeadline: new Date(Date.now() + 1000 * 60 * 60 * 30).toISOString(),
      returnDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
      status: 'Pendente para Retirada',
      notes: 'Preparação para o simulado do ENEM deste mês.',
    },
  ];
}

// Runtime SQLite database (initialized dynamically so Vercel Node runtimes never crash if node:sqlite is absent)
let db: any = null;
let storageInitialized = false;

// Ephemeral fallback store only used when both Redis and SQLite are unavailable
const memoryNotices: any[] = [];
const memoryNoticeAttachments = new Map<string, { mimeType: string; fileName: string; buffer: Buffer }>();
const memoryBooks: ServerBook[] = [...SEED_BOOKS];
const memoryReservations: ServerBookReservation[] = createInitialReservations();
const memoryBookCovers = new Map<string, { mimeType: string; fileName: string; buffer: Buffer }>();

async function ensureStorageInitialized(): Promise<void> {
  if (storageInitialized) return;

  try {
    const sqliteMod = await import('node:sqlite');
    const DatabaseSync = sqliteMod.DatabaseSync;
    const instance = new DatabaseSync(DB_PATH);
    instance.exec('PRAGMA journal_mode = WAL;');
    instance.exec('PRAGMA foreign_keys = ON;');

    instance.exec(`
      CREATE TABLE IF NOT EXISTS notices (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL CHECK(category IN ('Geral', 'Eventos', 'Reuniões', 'Avaliações', 'Comunicados')),
        published_date TEXT NOT NULL,
        is_highlighted INTEGER NOT NULL DEFAULT 0,
        author_name TEXT NOT NULL DEFAULT 'Direção & Coordenação Pedagógica',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS notice_attachments (
        id TEXT PRIMARY KEY,
        notice_id TEXT NOT NULL,
        file_name TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        attachment_type TEXT NOT NULL CHECK(attachment_type IN ('image', 'document')),
        storage_path TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (notice_id) REFERENCES notices(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_notices_order
        ON notices (is_highlighted DESC, published_date DESC, created_at DESC);

      CREATE INDEX IF NOT EXISTS idx_attachments_notice
        ON notice_attachments (notice_id);

      CREATE TABLE IF NOT EXISTS books (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        category TEXT NOT NULL,
        isbn TEXT NOT NULL,
        year INTEGER NOT NULL,
        pages INTEGER NOT NULL,
        publisher TEXT NOT NULL,
        synopsis TEXT NOT NULL,
        shelf_location TEXT NOT NULL,
        total_copies INTEGER NOT NULL DEFAULT 1,
        available_copies INTEGER NOT NULL DEFAULT 1,
        cover_gradient TEXT NOT NULL DEFAULT 'from-emerald-700 to-emerald-950',
        cover_image TEXT,
        badge TEXT,
        recommended_grade TEXT NOT NULL,
        rating REAL NOT NULL DEFAULT 5.0,
        tags TEXT NOT NULL DEFAULT '[]',
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_books_order
        ON books (sort_order ASC, created_at DESC);

      CREATE TABLE IF NOT EXISTS book_covers (
        id TEXT PRIMARY KEY,
        file_name TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        storage_path TEXT NOT NULL,
        image_data BLOB,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS book_reservations (
        id TEXT PRIMARY KEY,
        book_id TEXT NOT NULL,
        book_title TEXT NOT NULL,
        book_author TEXT NOT NULL,
        book_category TEXT NOT NULL,
        shelf_location TEXT NOT NULL,
        student_name TEXT NOT NULL,
        student_matricula TEXT NOT NULL,
        student_grade TEXT NOT NULL,
        student_contact TEXT NOT NULL,
        reservation_date TEXT NOT NULL,
        pickup_deadline TEXT NOT NULL,
        return_deadline TEXT NOT NULL,
        status TEXT NOT NULL,
        notes TEXT NOT NULL DEFAULT ''
      );

      CREATE INDEX IF NOT EXISTS idx_reservations_date
        ON book_reservations (reservation_date DESC);
    `);

    // Seed notices once if empty
    const noticeCountRow = instance.prepare('SELECT COUNT(*) AS total FROM notices').get() as { total: number };
    if (noticeCountRow && noticeCountRow.total === 0) {
      const now = new Date().toISOString();
      const insertSeed = instance.prepare(`
        INSERT INTO notices (
          id, title, description, category, published_date, is_highlighted, author_name, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const item of SEED_NOTICES) {
        insertSeed.run(
          item.id,
          item.title,
          item.description,
          item.category,
          item.publishedDate,
          item.isHighlighted ? 1 : 0,
          item.authorName,
          item.createdAt,
          now
        );
      }
    }

    // Seed initial books once if empty
    const bookCountRow = instance.prepare('SELECT COUNT(*) AS total FROM books').get() as { total: number };
    if (bookCountRow && bookCountRow.total === 0) {
      const now = new Date().toISOString();
      const insertBook = instance.prepare(`
        INSERT INTO books (
          id, title, author, category, isbn, year, pages, publisher, synopsis,
          shelf_location, total_copies, available_copies, cover_gradient, cover_image,
          badge, recommended_grade, rating, tags, sort_order, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      SEED_BOOKS.forEach((book, idx) => {
        insertBook.run(
          book.id,
          book.title,
          book.author,
          book.category,
          book.isbn,
          book.year,
          book.pages,
          book.publisher,
          book.synopsis,
          book.shelfLocation,
          book.totalCopies,
          book.availableCopies,
          book.coverGradient,
          book.coverImage || null,
          book.badge || null,
          book.recommendedGrade,
          book.rating,
          JSON.stringify(book.tags),
          (idx + 1) * 10,
          now,
          now
        );
      });
    }

    // Seed initial book reservation once if empty
    const resCountRow = instance.prepare('SELECT COUNT(*) AS total FROM book_reservations').get() as { total: number };
    if (resCountRow && resCountRow.total === 0) {
      const insertRes = instance.prepare(`
        INSERT INTO book_reservations (
          id, book_id, book_title, book_author, book_category, shelf_location,
          student_name, student_matricula, student_grade, student_contact,
          reservation_date, pickup_deadline, return_deadline, status, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const r of createInitialReservations()) {
        insertRes.run(
          r.id,
          r.bookId,
          r.bookTitle,
          r.bookAuthor,
          r.bookCategory,
          r.shelfLocation,
          r.studentName,
          r.studentMatricula,
          r.studentGrade,
          r.studentContact,
          r.reservationDate,
          r.pickupDeadline,
          r.returnDeadline,
          r.status,
          r.notes
        );
      }
    }

    db = instance;
  } catch (err) {
    console.warn('SQLite unavailable, using fallback storage:', err instanceof Error ? err.message : err);
    db = null;
  }

  // Seed Redis keys once if configured
  if (HAS_REDIS) {
    try {
      const existingBooks = await redisGetJson<ServerBook[]>(REDIS_BOOKS_KEY);
      if (!existingBooks || !Array.isArray(existingBooks) || existingBooks.length === 0) {
        await redisSetJson(REDIS_BOOKS_KEY, SEED_BOOKS);
      }
      const existingRes = await redisGetJson<ServerBookReservation[]>(REDIS_RESERVATIONS_KEY);
      if (!existingRes || !Array.isArray(existingRes)) {
        await redisSetJson(REDIS_RESERVATIONS_KEY, createInitialReservations());
      }
      const existingNotices = await redisGetJson<any[]>(REDIS_NOTICES_KEY);
      if (!existingNotices || !Array.isArray(existingNotices) || existingNotices.length === 0) {
        await redisSetJson(
          REDIS_NOTICES_KEY,
          SEED_NOTICES.map((n) => ({ ...n, updatedAt: new Date().toISOString(), attachments: [] }))
        );
      }
    } catch (err) {
      console.error('Failed to seed Redis storage:', err);
    }
  } else if (!db && memoryNotices.length === 0) {
    const now = new Date().toISOString();
    for (const n of SEED_NOTICES) {
      memoryNotices.push({ ...n, updatedAt: now, attachments: [] });
    }
  }

  storageInitialized = true;
}

const VALID_CATEGORIES = new Set(['Geral', 'Eventos', 'Reuniões', 'Avaliações', 'Comunicados']);

const ALLOWED_IMAGE_MIMES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
]);

const ALLOWED_DOCUMENT_MIMES = new Set([
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]);

const MAX_ATTACHMENTS = 5;
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
const MAX_COVER_SIZE_BYTES = 6 * 1024 * 1024;

interface NoticeRow {
  id: string;
  title: string;
  description: string;
  category: string;
  published_date: string;
  is_highlighted: number;
  author_name: string;
  created_at: string;
  updated_at: string;
}

interface AttachmentRow {
  id: string;
  notice_id: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  attachment_type: string;
  storage_path: string;
  created_at: string;
}

interface BookRow {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  year: number;
  pages: number;
  publisher: string;
  synopsis: string;
  shelf_location: string;
  total_copies: number;
  available_copies: number;
  cover_gradient: string;
  cover_image: string | null;
  badge: string | null;
  recommended_grade: string;
  rating: number;
  tags: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface BookCoverRow {
  id: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  image_data: Uint8Array | null;
  created_at: string;
}

interface BookReservationRow {
  id: string;
  book_id: string;
  book_title: string;
  book_author: string;
  book_category: string;
  shelf_location: string;
  student_name: string;
  student_matricula: string;
  student_grade: string;
  student_contact: string;
  reservation_date: string;
  pickup_deadline: string;
  return_deadline: string;
  status: string;
  notes: string;
}

function serializeNotice(row: NoticeRow) {
  const attRows = db
    .prepare('SELECT * FROM notice_attachments WHERE notice_id = ? ORDER BY created_at ASC')
    .all(row.id) as unknown as AttachmentRow[];

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    publishedDate: row.published_date,
    isHighlighted: row.is_highlighted === 1,
    authorName: row.author_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    attachments: attRows.map((att) => ({
      id: att.id,
      noticeId: att.notice_id,
      fileName: att.file_name,
      mimeType: att.mime_type,
      fileSize: att.file_size,
      attachmentType: att.attachment_type,
      url: `/api/notices/attachments/${encodeURIComponent(att.id)}`,
      downloadUrl: `/api/notices/attachments/${encodeURIComponent(att.id)}?download=1`,
      createdAt: att.created_at,
    })),
  };
}

function serializeBookRow(row: BookRow): ServerBook {
  let parsedTags: string[] = [];
  try {
    const raw = JSON.parse(row.tags || '[]');
    if (Array.isArray(raw)) {
      parsedTags = raw.filter((t): t is string => typeof t === 'string');
    }
  } catch {
    parsedTags = [];
  }

  return {
    id: row.id,
    title: row.title,
    author: row.author,
    category: row.category,
    isbn: row.isbn,
    year: Number(row.year) || new Date().getFullYear(),
    pages: Number(row.pages) || 150,
    publisher: row.publisher,
    synopsis: row.synopsis,
    shelfLocation: row.shelf_location,
    totalCopies: Number(row.total_copies) || 1,
    availableCopies: Number(row.available_copies) || 0,
    coverGradient: row.cover_gradient || 'from-emerald-700 to-emerald-950',
    coverImage: row.cover_image || undefined,
    badge: row.badge || undefined,
    recommendedGrade: row.recommended_grade,
    rating: Number(row.rating) || 5.0,
    tags: parsedTags,
  };
}

function serializeReservationRow(row: BookReservationRow): ServerBookReservation {
  return {
    id: row.id,
    bookId: row.book_id,
    bookTitle: row.book_title,
    bookAuthor: row.book_author,
    bookCategory: row.book_category,
    shelfLocation: row.shelf_location,
    studentName: row.student_name,
    studentMatricula: row.student_matricula,
    studentGrade: row.student_grade,
    studentContact: row.student_contact,
    reservationDate: row.reservation_date,
    pickupDeadline: row.pickup_deadline,
    returnDeadline: row.return_deadline,
    status: row.status as ServerBookReservation['status'],
    notes: row.notes || '',
  };
}

// Admin Token Helpers (HMAC-SHA256)
function createAdminToken(): { token: string; expiresAt: string } {
  const expiresAtMs = Date.now() + TOKEN_TTL_MS;
  const payload = Buffer.from(
    JSON.stringify({ role: 'admin', exp: expiresAtMs, nonce: crypto.randomBytes(8).toString('hex') })
  ).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  return {
    token: `${payload}.${signature}`,
    expiresAt: new Date(expiresAtMs).toISOString(),
  };
}

function verifyAdminToken(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;
  if (!payload || !signature) return false;

  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');

  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expectedBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false;

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (parsed?.role !== 'admin') return false;
    if (typeof parsed?.exp !== 'number' || Date.now() > parsed.exp) return false;
    return true;
  } catch {
    return false;
  }
}

function timingSafeCompareKey(provided: string, expected: string): boolean {
  const providedHash = crypto.createHash('sha256').update(provided).digest();
  const expectedHash = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(providedHash, expectedHash);
}

// Simple brute-force protection for admin login
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    return true;
  }
  return entry.count < 15;
}

function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 5 * 60 * 1000 });
  } else {
    entry.count += 1;
  }
}

function clearFailedLogin(ip: string): void {
  loginAttempts.delete(ip);
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Acesso não autorizado. Faça login no painel administrativo.' });
    return;
  }
  const token = authHeader.slice(7).trim();
  if (!token || !verifyAdminToken(token)) {
    res.status(403).json({ error: 'Sessão administrativa inválida ou expirada. Entre novamente.' });
    return;
  }
  next();
}

function sanitizeFileName(rawName: string): string {
  const base = path.basename(rawName || 'anexo');
  const cleaned = base.replace(/[^a-zA-Z0-9._\-\sáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]/g, '_').trim();
  return cleaned.slice(0, 120) || 'anexo';
}

function getExtensionFromMime(mimeType: string, fallbackName?: string): string {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
  };
  if (map[mimeType]) return map[mimeType];
  const ext = fallbackName ? path.extname(fallbackName).replace(/[^a-zA-Z0-9.]/g, '') : '';
  return ext || '.jpg';
}

function normalizeCoverMime(mimeType: string, fileName?: string): string {
  const lower = (mimeType || '').toLowerCase().split(';')[0].trim();
  if (lower === 'image/jfif' || lower === 'image/pjpeg') return 'image/jpeg';
  if (ALLOWED_IMAGE_MIMES.has(lower)) return lower;
  const ext = (fileName || '').split('.').pop()?.toLowerCase();
  if (ext === 'jpg' || ext === 'jpeg' || ext === 'jfif') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'gif') return 'image/gif';
  return lower;
}

function parseDataUrlImage(dataUrl: string): { mimeType: string; base64Data: string; fileName: string } | null {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;
  const mimeType = normalizeCoverMime(match[1]);
  if (!ALLOWED_IMAGE_MIMES.has(mimeType)) return null;
  const ext = getExtensionFromMime(mimeType);
  return {
    mimeType,
    base64Data: match[2],
    fileName: `capa${ext}`,
  };
}

async function storeBookCoverAsset(input: {
  fileName?: string;
  mimeType: string;
  base64Data: string;
}): Promise<{ id: string; url: string }> {
  const mimeType = normalizeCoverMime(input.mimeType, input.fileName);
  if (!ALLOWED_IMAGE_MIMES.has(mimeType)) {
    throw new Error('Formato de imagem inválido. Utilize JPG, PNG, WebP ou GIF.');
  }
  const cleanBase64 = input.base64Data.includes(',') ? input.base64Data.split(',')[1] : input.base64Data;
  const buffer = Buffer.from(cleanBase64, 'base64');
  if (buffer.length === 0 || buffer.length > MAX_COVER_SIZE_BYTES) {
    throw new Error('A imagem da capa deve ter entre 1 byte e 6 MB.');
  }

  const coverId = `cover-${crypto.randomUUID()}`;
  const ext = getExtensionFromMime(mimeType, input.fileName);
  const diskName = `${coverId}${ext}`;
  const safeName = sanitizeFileName(input.fileName || diskName);

  // 1. Prefer Vercel Blob when configured (permanent CDN URL across deploys)
  if (HAS_BLOB) {
    const blob = await putVercelBlob(`library-covers/${diskName}`, buffer, {
      access: 'public',
      contentType: mimeType,
      token: BLOB_TOKEN,
      addRandomSuffix: false,
    });
    return { id: coverId, url: blob.url };
  }

  // 2. If Redis/KV is configured (Vercel KV / Upstash), store cover bytes persistently in Redis
  if (HAS_REDIS) {
    await redisSetJson(`${REDIS_COVER_PREFIX}${coverId}`, {
      id: coverId,
      fileName: safeName,
      mimeType,
      fileSize: buffer.length,
      base64Data: buffer.toString('base64'),
      createdAt: new Date().toISOString(),
    });
    return { id: coverId, url: `/api/books/covers/${encodeURIComponent(coverId)}` };
  }

  // 3. Local Node / SQLite storage: save both to disk and SQLite BLOB backup
  if (db) {
    try {
      fs.mkdirSync(BOOK_COVERS_DIR, { recursive: true });
      fs.writeFileSync(path.join(BOOK_COVERS_DIR, diskName), buffer);
    } catch {
      // disk write failure falls back to SQLite BLOB column below
    }

    db.prepare(
      `INSERT INTO book_covers (id, file_name, mime_type, file_size, storage_path, image_data, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(coverId, safeName, mimeType, buffer.length, diskName, buffer, new Date().toISOString());

    return { id: coverId, url: `/api/books/covers/${encodeURIComponent(coverId)}` };
  }

  // 4. Last-resort memory storage
  memoryBookCovers.set(coverId, { mimeType, fileName: safeName, buffer });
  return { id: coverId, url: `/api/books/covers/${encodeURIComponent(coverId)}` };
}

async function resolveIncomingCoverImage(body: any): Promise<string | undefined> {
  if (body?.coverUpload && typeof body.coverUpload?.base64Data === 'string') {
    const stored = await storeBookCoverAsset({
      fileName: body.coverUpload.fileName,
      mimeType: body.coverUpload.mimeType || 'image/jpeg',
      base64Data: body.coverUpload.base64Data,
    });
    return stored.url;
  }

  const rawCover = typeof body?.coverImage === 'string' ? body.coverImage.trim() : '';
  if (!rawCover || rawCover.startsWith('data:image/svg+xml')) {
    return undefined;
  }

  if (rawCover.startsWith('data:image/')) {
    const parsed = parseDataUrlImage(rawCover);
    if (!parsed) {
      throw new Error('Imagem em base64 inválida ou em formato não suportado.');
    }
    const stored = await storeBookCoverAsset(parsed);
    return stored.url;
  }

  if (rawCover === ASSET_ESTRELA_TOKEN || rawCover.endsWith('/src/assets/images/estrela.jfif') || /\/assets\/estrela-[a-zA-Z0-9_-]+\.jfif$/i.test(rawCover)) {
    return ASSET_ESTRELA_TOKEN;
  }

  return rawCover;
}

async function getAllBooksFromStore(): Promise<ServerBook[]> {
  if (HAS_REDIS) {
    const list = await redisGetJson<ServerBook[]>(REDIS_BOOKS_KEY);
    return Array.isArray(list) ? list : [];
  }
  if (db) {
    const rows = db
      .prepare('SELECT * FROM books ORDER BY sort_order ASC, created_at DESC')
      .all() as unknown as BookRow[];
    return rows.map(serializeBookRow);
  }
  return [...memoryBooks];
}

async function saveAllBooksToRedis(books: ServerBook[]): Promise<void> {
  await redisSetJson(REDIS_BOOKS_KEY, books);
}

async function getAllReservationsFromStore(): Promise<ServerBookReservation[]> {
  if (HAS_REDIS) {
    const list = await redisGetJson<ServerBookReservation[]>(REDIS_RESERVATIONS_KEY);
    return Array.isArray(list) ? list : [];
  }
  if (db) {
    const rows = db
      .prepare('SELECT * FROM book_reservations ORDER BY reservation_date DESC')
      .all() as unknown as BookReservationRow[];
    return rows.map(serializeReservationRow);
  }
  return [...memoryReservations];
}

interface IncomingAttachment {
  fileName: string;
  mimeType: string;
  fileSize: number;
  base64Data: string;
}

function validateAndParseNoticePayload(body: any) {
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  const description = typeof body?.description === 'string' ? body.description.trim() : '';
  const category = typeof body?.category === 'string' ? body.category.trim() : '';
  const publishedDate = typeof body?.publishedDate === 'string' ? body.publishedDate.trim() : '';
  const isHighlighted = Boolean(body?.isHighlighted);
  const authorName =
    typeof body?.authorName === 'string' && body.authorName.trim()
      ? body.authorName.trim().slice(0, 80)
      : 'Direção & Coordenação Pedagógica';

  if (title.length < 3 || title.length > 150) {
    return { error: 'O título deve ter entre 3 e 150 caracteres.' };
  }
  if (description.length < 10 || description.length > 5000) {
    return { error: 'A descrição deve ter entre 10 e 5000 caracteres.' };
  }
  if (!VALID_CATEGORIES.has(category)) {
    return { error: 'Selecione uma categoria válida: Geral, Eventos, Reuniões, Avaliações ou Comunicados.' };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedDate)) {
    return { error: 'Informe uma data de publicação válida (AAAA-MM-DD).' };
  }

  const keepAttachmentIds: string[] = Array.isArray(body?.keepAttachmentIds)
    ? body.keepAttachmentIds.filter((id: unknown): id is string => typeof id === 'string')
    : [];

  const newAttachmentsRaw: IncomingAttachment[] = Array.isArray(body?.newAttachments)
    ? body.newAttachments
    : [];

  if (keepAttachmentIds.length + newAttachmentsRaw.length > MAX_ATTACHMENTS) {
    return { error: `Máximo de ${MAX_ATTACHMENTS} anexos permitidos por comunicado.` };
  }

  const parsedAttachments: {
    fileName: string;
    mimeType: string;
    attachmentType: 'image' | 'document';
    buffer: Buffer;
  }[] = [];

  for (const att of newAttachmentsRaw) {
    if (!att || typeof att.base64Data !== 'string' || typeof att.mimeType !== 'string') {
      return { error: 'Um dos anexos enviados está em formato inválido.' };
    }
    const isImage = ALLOWED_IMAGE_MIMES.has(att.mimeType);
    const isDoc = ALLOWED_DOCUMENT_MIMES.has(att.mimeType);
    if (!isImage && !isDoc) {
      return { error: `Tipo de arquivo não permitido: ${att.mimeType}` };
    }
    const buffer = Buffer.from(att.base64Data, 'base64');
    if (buffer.length === 0 || buffer.length > MAX_FILE_SIZE_BYTES) {
      return { error: `O anexo "${att.fileName || 'arquivo'}" deve ter entre 1 byte e 8 MB.` };
    }
    parsedAttachments.push({
      fileName: sanitizeFileName(att.fileName),
      mimeType: att.mimeType,
      attachmentType: isImage ? 'image' : 'document',
      buffer,
    });
  }

  return {
    data: {
      title,
      description,
      category,
      publishedDate,
      isHighlighted,
      authorName,
      keepAttachmentIds,
      parsedAttachments,
    },
  };
}

function saveAttachmentFiles(
  noticeId: string,
  attachments: {
    fileName: string;
    mimeType: string;
    attachmentType: 'image' | 'document';
    buffer: Buffer;
  }[]
) {
  if (!db) return;
  const insertAtt = db.prepare(`
    INSERT INTO notice_attachments (
      id, notice_id, file_name, mime_type, file_size, attachment_type, storage_path, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const att of attachments) {
    const attId = `att-${crypto.randomUUID()}`;
    const ext = path.extname(att.fileName) || '';
    const diskName = `${attId}${ext.replace(/[^a-zA-Z0-9.]/g, '')}`;
    const diskPath = path.join(UPLOADS_DIR, diskName);

    fs.writeFileSync(diskPath, att.buffer);
    insertAtt.run(
      attId,
      noticeId,
      att.fileName,
      att.mimeType,
      att.buffer.length,
      att.attachmentType,
      diskName,
      new Date().toISOString()
    );
  }
}

function deleteDiskFile(storagePath: string): void {
  const fullPath = path.join(UPLOADS_DIR, path.basename(storagePath));
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
    } catch {
      // ignore cleanup error
    }
  }
}

export async function createApiApp() {
  await ensureStorageInitialized();

  const app = express();
  app.use('/api', express.json({ limit: '45mb' }));

  // Public Health Check
  app.get('/api/health', (_req: Request, res: Response) => {
    const storageMode = HAS_REDIS && HAS_BLOB
      ? 'cloud-redis-blob'
      : HAS_REDIS
      ? 'cloud-redis'
      : db && !IS_VERCEL
      ? 'sqlite'
      : 'ephemeral';
    res.json({ status: 'ok', database: storageMode, hasBlob: HAS_BLOB, hasRedis: HAS_REDIS });
  });

  // Admin Authentication
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const clientIp = req.ip || 'unknown';
    if (!checkLoginRateLimit(clientIp)) {
      res.status(429).json({
        error: 'Muitas tentativas incorretas. Aguarde alguns minutos antes de tentar novamente.',
      });
      return;
    }

    const accessKey = typeof req.body?.accessKey === 'string' ? req.body.accessKey.trim() : '';
    if (!accessKey || !timingSafeCompareKey(accessKey, ADMIN_ACCESS_KEY)) {
      recordFailedLogin(clientIp);
      res.status(401).json({
        error: 'Chave de acesso incorreta. Verifique a credencial da gestão escolar.',
      });
      return;
    }

    clearFailedLogin(clientIp);
    const session = createAdminToken();
    res.json(session);
  });

  app.get('/api/admin/session', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      res.json({ authenticated: false });
      return;
    }
    const token = authHeader.slice(7).trim();
    res.json({ authenticated: Boolean(token && verifyAdminToken(token)) });
  });

  // =========================================================================
  // DIGITAL LIBRARY API (Books, Covers & Reservations)
  // =========================================================================

  // Public GET all books
  app.get('/api/books', async (_req: Request, res: Response) => {
    try {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      const books = await getAllBooksFromStore();
      res.json({ books });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Erro ao carregar acervo de livros.' });
    }
  });

  // Public GET uploaded book cover image
  app.get('/api/books/covers/:id', async (req: Request, res: Response) => {
    try {
      const coverId = String(req.params.id || '');
      if (!coverId || coverId.includes('..') || coverId.includes('/')) {
        res.status(400).json({ error: 'Identificador de capa inválido.' });
        return;
      }

      if (HAS_REDIS) {
        const stored = await redisGetJson<{ mimeType: string; fileName: string; base64Data: string }>(
          `${REDIS_COVER_PREFIX}${coverId}`
        );
        if (!stored || !stored.base64Data) {
          res.status(404).json({ error: 'Capa não encontrada.' });
          return;
        }
        const buffer = Buffer.from(stored.base64Data, 'base64');
        res.setHeader('Content-Type', stored.mimeType || 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.send(buffer);
        return;
      }

      if (db) {
        const row = db
          .prepare('SELECT * FROM book_covers WHERE id = ?')
          .get(coverId) as unknown as BookCoverRow | undefined;

        if (!row) {
          res.status(404).json({ error: 'Capa não encontrada.' });
          return;
        }

        res.setHeader('Content-Type', row.mime_type || 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.setHeader('X-Content-Type-Options', 'nosniff');

        const diskPath = path.join(BOOK_COVERS_DIR, path.basename(row.storage_path));
        if (fs.existsSync(diskPath)) {
          res.sendFile(diskPath);
          return;
        }
        if (row.image_data) {
          res.send(Buffer.from(row.image_data));
          return;
        }
        res.status(404).json({ error: 'Arquivo da capa indisponível.' });
        return;
      }

      const mem = memoryBookCovers.get(coverId);
      if (!mem) {
        res.status(404).json({ error: 'Capa não encontrada.' });
        return;
      }
      res.setHeader('Content-Type', mem.mimeType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.send(mem.buffer);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Erro ao carregar imagem da capa.' });
    }
  });

  // Admin POST upload book cover file -> returns persistent URL
  app.post('/api/books/covers', requireAdmin, async (req: Request, res: Response) => {
    try {
      const fileName = typeof req.body?.fileName === 'string' ? req.body.fileName : 'capa.jpg';
      const mimeType = typeof req.body?.mimeType === 'string' ? req.body.mimeType : '';
      const base64Data = typeof req.body?.base64Data === 'string' ? req.body.base64Data : '';

      if (!base64Data) {
        res.status(400).json({ error: 'Nenhuma imagem enviada.' });
        return;
      }

      const stored = await storeBookCoverAsset({ fileName, mimeType, base64Data });
      res.status(201).json(stored);
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : 'Erro ao salvar imagem da capa.' });
    }
  });

  // Admin POST create book
  app.post('/api/books', requireAdmin, async (req: Request, res: Response) => {
    try {
      const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
      const author = typeof req.body?.author === 'string' ? req.body.author.trim() : '';
      const totalCopies = Math.max(1, Number(req.body?.totalCopies) || 1);

      if (!title || title.length < 2) {
        res.status(400).json({ error: 'Por favor informe o título da obra.' });
        return;
      }
      if (!author || author.length < 2) {
        res.status(400).json({ error: 'Por favor informe o autor da obra.' });
        return;
      }

      const coverImage = await resolveIncomingCoverImage(req.body);
      const tags: string[] = Array.isArray(req.body?.tags)
        ? req.body.tags.filter((t: unknown): t is string => typeof t === 'string' && t.trim().length > 0)
        : ['Acervo Escolar', 'Leitura'];

      const newBook: ServerBook = {
        id:
          typeof req.body?.id === 'string' && req.body.id.trim()
            ? req.body.id.trim()
            : `book-${crypto.randomUUID().slice(0, 8)}`,
        title,
        author,
        category: typeof req.body?.category === 'string' && req.body.category.trim() ? req.body.category.trim() : 'Literatura Brasileira',
        isbn:
          typeof req.body?.isbn === 'string' && req.body.isbn.trim()
            ? req.body.isbn.trim()
            : `978-85-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}-0`,
        year: Number(req.body?.year) || new Date().getFullYear(),
        pages: Number(req.body?.pages) || 180,
        publisher:
          typeof req.body?.publisher === 'string' && req.body.publisher.trim()
            ? req.body.publisher.trim()
            : 'Acervo Escolar CETI VCD / SEDUC-PI',
        synopsis:
          typeof req.body?.synopsis === 'string' && req.body.synopsis.trim()
            ? req.body.synopsis.trim()
            : 'Obra cadastrada pela equipe pedagógica para leitura e consulta dos alunos do CETI Verônica Celestina Dias.',
        shelfLocation:
          typeof req.body?.shelfLocation === 'string' && req.body.shelfLocation.trim()
            ? req.body.shelfLocation.trim()
            : 'Estante 01 · Prateleira A (Geral)',
        totalCopies,
        availableCopies:
          typeof req.body?.availableCopies === 'number'
            ? Math.min(totalCopies, Math.max(0, req.body.availableCopies))
            : totalCopies,
        coverGradient:
          typeof req.body?.coverGradient === 'string' && req.body.coverGradient.trim()
            ? req.body.coverGradient.trim()
            : 'from-emerald-700 to-emerald-950',
        coverImage,
        badge: typeof req.body?.badge === 'string' && req.body.badge.trim() ? req.body.badge.trim() : 'Novo no Acervo',
        recommendedGrade:
          typeof req.body?.recommendedGrade === 'string' && req.body.recommendedGrade.trim()
            ? req.body.recommendedGrade.trim()
            : 'Ensino Médio Integral',
        rating: Number(req.body?.rating) || 5.0,
        tags,
      };

      if (HAS_REDIS) {
        const books = await getAllBooksFromStore();
        const updated = [newBook, ...books.filter((b) => b.id !== newBook.id)];
        await saveAllBooksToRedis(updated);
      } else if (db) {
        const minRow = db.prepare('SELECT MIN(sort_order) AS min_order FROM books').get() as { min_order: number | null };
        const nextOrder = typeof minRow?.min_order === 'number' ? minRow.min_order - 10 : -10;
        const now = new Date().toISOString();
        db.prepare(
          `INSERT INTO books (
            id, title, author, category, isbn, year, pages, publisher, synopsis,
            shelf_location, total_copies, available_copies, cover_gradient, cover_image,
            badge, recommended_grade, rating, tags, sort_order, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(
          newBook.id,
          newBook.title,
          newBook.author,
          newBook.category,
          newBook.isbn,
          newBook.year,
          newBook.pages,
          newBook.publisher,
          newBook.synopsis,
          newBook.shelfLocation,
          newBook.totalCopies,
          newBook.availableCopies,
          newBook.coverGradient,
          newBook.coverImage || null,
          newBook.badge || null,
          newBook.recommendedGrade,
          newBook.rating,
          JSON.stringify(newBook.tags),
          nextOrder,
          now,
          now
        );
      } else {
        memoryBooks.unshift(newBook);
      }

      res.status(201).json({ book: newBook });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : 'Erro ao cadastrar livro.' });
    }
  });

  // Admin PUT update book
  app.put('/api/books/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const bookId = String(req.params.id || '');
      const books = await getAllBooksFromStore();
      const existing = books.find((b) => b.id === bookId);
      if (!existing) {
        res.status(404).json({ error: 'Livro não encontrado.' });
        return;
      }

      const title = typeof req.body?.title === 'string' ? req.body.title.trim() : existing.title;
      const author = typeof req.body?.author === 'string' ? req.body.author.trim() : existing.author;
      if (!title || !author) {
        res.status(400).json({ error: 'Título e autor são obrigatórios.' });
        return;
      }

      const totalCopies = Math.max(1, Number(req.body?.totalCopies) || existing.totalCopies);
      const diff = totalCopies - existing.totalCopies;
      const availableCopies =
        typeof req.body?.availableCopies === 'number'
          ? Math.min(totalCopies, Math.max(0, req.body.availableCopies))
          : Math.min(totalCopies, Math.max(0, existing.availableCopies + diff));

      const coverImage = await resolveIncomingCoverImage(req.body);
      const tags: string[] = Array.isArray(req.body?.tags)
        ? req.body.tags.filter((t: unknown): t is string => typeof t === 'string' && t.trim().length > 0)
        : existing.tags;

      const updatedBook: ServerBook = {
        ...existing,
        title,
        author,
        category: typeof req.body?.category === 'string' && req.body.category.trim() ? req.body.category.trim() : existing.category,
        isbn: typeof req.body?.isbn === 'string' && req.body.isbn.trim() ? req.body.isbn.trim() : existing.isbn,
        year: Number(req.body?.year) || existing.year,
        pages: Number(req.body?.pages) || existing.pages,
        publisher: typeof req.body?.publisher === 'string' && req.body.publisher.trim() ? req.body.publisher.trim() : existing.publisher,
        synopsis: typeof req.body?.synopsis === 'string' && req.body.synopsis.trim() ? req.body.synopsis.trim() : existing.synopsis,
        shelfLocation:
          typeof req.body?.shelfLocation === 'string' && req.body.shelfLocation.trim()
            ? req.body.shelfLocation.trim()
            : existing.shelfLocation,
        totalCopies,
        availableCopies,
        coverGradient:
          typeof req.body?.coverGradient === 'string' && req.body.coverGradient.trim()
            ? req.body.coverGradient.trim()
            : existing.coverGradient,
        coverImage,
        badge: typeof req.body?.badge === 'string' ? req.body.badge.trim() || undefined : existing.badge,
        recommendedGrade:
          typeof req.body?.recommendedGrade === 'string' && req.body.recommendedGrade.trim()
            ? req.body.recommendedGrade.trim()
            : existing.recommendedGrade,
        tags: tags.length > 0 ? tags : existing.tags,
      };

      if (HAS_REDIS) {
        const nextList = books.map((b) => (b.id === bookId ? updatedBook : b));
        await saveAllBooksToRedis(nextList);
      } else if (db) {
        db.prepare(
          `UPDATE books SET
            title = ?, author = ?, category = ?, isbn = ?, year = ?, pages = ?,
            publisher = ?, synopsis = ?, shelf_location = ?, total_copies = ?, available_copies = ?,
            cover_gradient = ?, cover_image = ?, badge = ?, recommended_grade = ?, tags = ?, updated_at = ?
           WHERE id = ?`
        ).run(
          updatedBook.title,
          updatedBook.author,
          updatedBook.category,
          updatedBook.isbn,
          updatedBook.year,
          updatedBook.pages,
          updatedBook.publisher,
          updatedBook.synopsis,
          updatedBook.shelfLocation,
          updatedBook.totalCopies,
          updatedBook.availableCopies,
          updatedBook.coverGradient,
          updatedBook.coverImage || null,
          updatedBook.badge || null,
          updatedBook.recommendedGrade,
          JSON.stringify(updatedBook.tags),
          new Date().toISOString(),
          bookId
        );
      } else {
        const idx = memoryBooks.findIndex((b) => b.id === bookId);
        if (idx >= 0) memoryBooks[idx] = updatedBook;
      }

      res.json({ book: updatedBook });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : 'Erro ao atualizar livro.' });
    }
  });

  // Admin PATCH update book cover
  app.patch('/api/books/:id/cover', requireAdmin, async (req: Request, res: Response) => {
    try {
      const bookId = String(req.params.id || '');
      const books = await getAllBooksFromStore();
      const existing = books.find((b) => b.id === bookId);
      if (!existing) {
        res.status(404).json({ error: 'Livro não encontrado.' });
        return;
      }

      const coverImage = await resolveIncomingCoverImage(req.body);
      const updatedBook: ServerBook = { ...existing, coverImage };

      if (HAS_REDIS) {
        const nextList = books.map((b) => (b.id === bookId ? updatedBook : b));
        await saveAllBooksToRedis(nextList);
      } else if (db) {
        db.prepare('UPDATE books SET cover_image = ?, updated_at = ? WHERE id = ?').run(
          coverImage || null,
          new Date().toISOString(),
          bookId
        );
      } else {
        const idx = memoryBooks.findIndex((b) => b.id === bookId);
        if (idx >= 0) memoryBooks[idx] = updatedBook;
      }

      res.json({ book: updatedBook });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : 'Erro ao atualizar capa do livro.' });
    }
  });

  // Admin DELETE book
  app.delete('/api/books/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const bookId = String(req.params.id || '');
      if (HAS_REDIS) {
        const books = await getAllBooksFromStore();
        const exists = books.some((b) => b.id === bookId);
        if (!exists) {
          res.status(404).json({ error: 'Livro não encontrado.' });
          return;
        }
        await saveAllBooksToRedis(books.filter((b) => b.id !== bookId));
      } else if (db) {
        const result = db.prepare('DELETE FROM books WHERE id = ?').run(bookId);
        if (!result.changes) {
          res.status(404).json({ error: 'Livro não encontrado.' });
          return;
        }
      } else {
        const idx = memoryBooks.findIndex((b) => b.id === bookId);
        if (idx < 0) {
          res.status(404).json({ error: 'Livro não encontrado.' });
          return;
        }
        memoryBooks.splice(idx, 1);
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Erro ao remover livro.' });
    }
  });

  // Admin POST restore missing default books without overwriting existing catalog
  app.post('/api/books/restore-defaults', requireAdmin, async (_req: Request, res: Response) => {
    try {
      const current = await getAllBooksFromStore();
      const existingTitles = new Set(current.map((b) => b.title.toLowerCase().trim()));
      const existingIds = new Set(current.map((b) => b.id));
      const toAdd = SEED_BOOKS.filter(
        (b) => !existingIds.has(b.id) && !existingTitles.has(b.title.toLowerCase().trim())
      );

      if (toAdd.length > 0) {
        if (HAS_REDIS) {
          await saveAllBooksToRedis([...current, ...toAdd]);
        } else if (db) {
          const now = new Date().toISOString();
          const maxRow = db.prepare('SELECT MAX(sort_order) AS max_order FROM books').get() as { max_order: number | null };
          let order = typeof maxRow?.max_order === 'number' ? maxRow.max_order + 10 : 100;
          const insertBook = db.prepare(`
            INSERT INTO books (
              id, title, author, category, isbn, year, pages, publisher, synopsis,
              shelf_location, total_copies, available_copies, cover_gradient, cover_image,
              badge, recommended_grade, rating, tags, sort_order, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          for (const book of toAdd) {
            insertBook.run(
              book.id,
              book.title,
              book.author,
              book.category,
              book.isbn,
              book.year,
              book.pages,
              book.publisher,
              book.synopsis,
              book.shelfLocation,
              book.totalCopies,
              book.availableCopies,
              book.coverGradient,
              book.coverImage || null,
              book.badge || null,
              book.recommendedGrade,
              book.rating,
              JSON.stringify(book.tags),
              order,
              now,
              now
            );
            order += 10;
          }
        } else {
          memoryBooks.push(...toAdd);
        }
      }

      const books = await getAllBooksFromStore();
      res.json({ books, addedCount: toAdd.length });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Erro ao restaurar acervo padrão.' });
    }
  });

  // Admin POST sync legacy browser-local books/covers into persistent server storage
  app.post('/api/books/sync-local', requireAdmin, async (req: Request, res: Response) => {
    try {
      const incoming: any[] = Array.isArray(req.body?.books) ? req.body.books : [];
      if (incoming.length === 0) {
        const books = await getAllBooksFromStore();
        res.json({ books, migratedCount: 0 });
        return;
      }

      const current = await getAllBooksFromStore();
      const byId = new Map(current.map((b) => [b.id, b]));
      const titles = new Set(current.map((b) => b.title.toLowerCase().trim()));
      let migratedCount = 0;
      const updatedBooks = [...current];

      for (const raw of incoming) {
        if (!raw || typeof raw.id !== 'string' || typeof raw.title !== 'string' || typeof raw.author !== 'string') {
          continue;
        }

        const existing = byId.get(raw.id);
        const hasCustomLocalCover =
          typeof raw.coverImage === 'string' &&
          raw.coverImage.trim().length > 0 &&
          !raw.coverImage.startsWith('data:image/svg+xml') &&
          !raw.coverImage.endsWith('/src/assets/images/estrela.jfif');

        if (!existing && !titles.has(raw.title.toLowerCase().trim())) {
          // Legacy new book created only in localStorage before backend integration
          const resolvedCover = hasCustomLocalCover ? await resolveIncomingCoverImage({ coverImage: raw.coverImage }) : undefined;
          const migratedBook: ServerBook = {
            id: raw.id,
            title: raw.title.trim(),
            author: raw.author.trim(),
            category: typeof raw.category === 'string' ? raw.category : 'Literatura Brasileira',
            isbn: typeof raw.isbn === 'string' ? raw.isbn : '978-85-0000-000-0',
            year: Number(raw.year) || new Date().getFullYear(),
            pages: Number(raw.pages) || 180,
            publisher: typeof raw.publisher === 'string' ? raw.publisher : 'Acervo Escolar CETI',
            synopsis: typeof raw.synopsis === 'string' ? raw.synopsis : 'Obra cadastrada no acervo escolar.',
            shelfLocation: typeof raw.shelfLocation === 'string' ? raw.shelfLocation : 'Estante 01 · Prateleira A',
            totalCopies: Math.max(1, Number(raw.totalCopies) || 1),
            availableCopies: Math.max(0, Number(raw.availableCopies) || 1),
            coverGradient: typeof raw.coverGradient === 'string' ? raw.coverGradient : 'from-emerald-700 to-emerald-950',
            coverImage: resolvedCover,
            badge: typeof raw.badge === 'string' ? raw.badge : undefined,
            recommendedGrade: typeof raw.recommendedGrade === 'string' ? raw.recommendedGrade : 'Ensino Médio Integral',
            rating: Number(raw.rating) || 5.0,
            tags: Array.isArray(raw.tags) ? raw.tags : ['Acervo Escolar'],
          };
          updatedBooks.unshift(migratedBook);
          byId.set(migratedBook.id, migratedBook);
          titles.add(migratedBook.title.toLowerCase().trim());

          if (db && !HAS_REDIS) {
            const now = new Date().toISOString();
            const minRow = db.prepare('SELECT MIN(sort_order) AS min_order FROM books').get() as { min_order: number | null };
            const nextOrder = typeof minRow?.min_order === 'number' ? minRow.min_order - 10 : -10;
            db.prepare(
              `INSERT INTO books (
                id, title, author, category, isbn, year, pages, publisher, synopsis,
                shelf_location, total_copies, available_copies, cover_gradient, cover_image,
                badge, recommended_grade, rating, tags, sort_order, created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            ).run(
              migratedBook.id,
              migratedBook.title,
              migratedBook.author,
              migratedBook.category,
              migratedBook.isbn,
              migratedBook.year,
              migratedBook.pages,
              migratedBook.publisher,
              migratedBook.synopsis,
              migratedBook.shelfLocation,
              migratedBook.totalCopies,
              migratedBook.availableCopies,
              migratedBook.coverGradient,
              migratedBook.coverImage || null,
              migratedBook.badge || null,
              migratedBook.recommendedGrade,
              migratedBook.rating,
              JSON.stringify(migratedBook.tags),
              nextOrder,
              now,
              now
            );
          }
          migratedCount += 1;
        } else if (existing && !existing.coverImage && hasCustomLocalCover && raw.coverImage.startsWith('data:image/')) {
          // Existing book had a base64 cover added only in localStorage
          const resolvedCover = await resolveIncomingCoverImage({ coverImage: raw.coverImage });
          if (resolvedCover) {
            existing.coverImage = resolvedCover;
            if (db && !HAS_REDIS) {
              db.prepare('UPDATE books SET cover_image = ?, updated_at = ? WHERE id = ?').run(
                resolvedCover,
                new Date().toISOString(),
                existing.id
              );
            }
            migratedCount += 1;
          }
        }
      }

      if (HAS_REDIS && migratedCount > 0) {
        await saveAllBooksToRedis(updatedBooks);
      }

      const finalBooks = await getAllBooksFromStore();
      res.json({ books: finalBooks, migratedCount });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Erro ao sincronizar livros locais.' });
    }
  });

  // Public GET book reservations
  app.get('/api/books/reservations', async (_req: Request, res: Response) => {
    try {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      const reservations = await getAllReservationsFromStore();
      res.json({ reservations });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Erro ao carregar reservas.' });
    }
  });

  // Public POST create book reservation (student)
  app.post('/api/books/reservations', async (req: Request, res: Response) => {
    try {
      const bookId = typeof req.body?.bookId === 'string' ? req.body.bookId.trim() : '';
      const studentName = typeof req.body?.studentName === 'string' ? req.body.studentName.trim() : '';
      const studentMatricula = typeof req.body?.studentMatricula === 'string' ? req.body.studentMatricula.trim() : '';
      const studentGrade = typeof req.body?.studentGrade === 'string' ? req.body.studentGrade.trim() : '1º Ano A - Médio Integral';
      const studentContact = typeof req.body?.studentContact === 'string' && req.body.studentContact.trim() ? req.body.studentContact.trim() : 'Não informado';
      const notes = typeof req.body?.notes === 'string' ? req.body.notes.trim() : '';

      if (!studentName || studentName.length < 3) {
        res.status(400).json({ error: 'Por favor, informe o nome completo do aluno.' });
        return;
      }
      if (!studentMatricula) {
        res.status(400).json({ error: 'Informe a matrícula ou número de chamada escolar.' });
        return;
      }

      const books = await getAllBooksFromStore();
      const targetBook = books.find((b) => b.id === bookId);
      if (!targetBook) {
        res.status(404).json({ error: 'Livro não encontrado no acervo.' });
        return;
      }
      if (targetBook.availableCopies <= 0) {
        res.status(400).json({ error: 'Desculpe, todos os exemplares deste livro já estão emprestados no momento.' });
        return;
      }

      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const newReservation: ServerBookReservation = {
        id: `CETI-LIB-${new Date().getFullYear()}-${randomCode}`,
        bookId: targetBook.id,
        bookTitle: targetBook.title,
        bookAuthor: targetBook.author,
        bookCategory: targetBook.category,
        shelfLocation: targetBook.shelfLocation,
        studentName,
        studentMatricula,
        studentGrade,
        studentContact,
        reservationDate: new Date().toISOString(),
        pickupDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        returnDeadline: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pendente para Retirada',
        notes,
      };

      const nextAvailable = Math.max(0, targetBook.availableCopies - 1);

      if (HAS_REDIS) {
        const nextBooks = books.map((b) =>
          b.id === targetBook.id ? { ...b, availableCopies: nextAvailable } : b
        );
        const reservations = await getAllReservationsFromStore();
        await saveAllBooksToRedis(nextBooks);
        await redisSetJson(REDIS_RESERVATIONS_KEY, [newReservation, ...reservations]);
      } else if (db) {
        db.prepare('UPDATE books SET available_copies = ?, updated_at = ? WHERE id = ?').run(
          nextAvailable,
          new Date().toISOString(),
          targetBook.id
        );
        db.prepare(
          `INSERT INTO book_reservations (
            id, book_id, book_title, book_author, book_category, shelf_location,
            student_name, student_matricula, student_grade, student_contact,
            reservation_date, pickup_deadline, return_deadline, status, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(
          newReservation.id,
          newReservation.bookId,
          newReservation.bookTitle,
          newReservation.bookAuthor,
          newReservation.bookCategory,
          newReservation.shelfLocation,
          newReservation.studentName,
          newReservation.studentMatricula,
          newReservation.studentGrade,
          newReservation.studentContact,
          newReservation.reservationDate,
          newReservation.pickupDeadline,
          newReservation.returnDeadline,
          newReservation.status,
          newReservation.notes
        );
      } else {
        targetBook.availableCopies = nextAvailable;
        memoryReservations.unshift(newReservation);
      }

      res.status(201).json({
        reservation: newReservation,
        book: { ...targetBook, availableCopies: nextAvailable },
      });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Erro ao registrar reserva.' });
    }
  });

  // Public PATCH student cancel own pending reservation
  app.patch('/api/books/reservations/:id/cancel', async (req: Request, res: Response) => {
    try {
      const resId = String(req.params.id || '');
      const reservations = await getAllReservationsFromStore();
      const target = reservations.find((r) => r.id === resId);
      if (!target) {
        res.status(404).json({ error: 'Reserva não encontrada.' });
        return;
      }
      if (target.status !== 'Pendente para Retirada' && target.status !== 'Aprovado para Retirada') {
        res.status(400).json({ error: 'Somente reservas pendentes ou aprovadas podem ser canceladas.' });
        return;
      }

      const books = await getAllBooksFromStore();
      const targetBook = books.find((b) => b.id === target.bookId);

      if (HAS_REDIS) {
        const nextReservations = reservations.map((r) =>
          r.id === resId ? { ...r, status: 'Cancelado' as const } : r
        );
        await redisSetJson(REDIS_RESERVATIONS_KEY, nextReservations);
        if (targetBook) {
          const nextBooks = books.map((b) =>
            b.id === targetBook.id
              ? { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) }
              : b
          );
          await saveAllBooksToRedis(nextBooks);
        }
      } else if (db) {
        db.prepare('UPDATE book_reservations SET status = ? WHERE id = ?').run('Cancelado', resId);
        if (targetBook) {
          db.prepare('UPDATE books SET available_copies = ?, updated_at = ? WHERE id = ?').run(
            Math.min(targetBook.totalCopies, targetBook.availableCopies + 1),
            new Date().toISOString(),
            targetBook.id
          );
        }
      } else {
        target.status = 'Cancelado';
        if (targetBook) {
          targetBook.availableCopies = Math.min(targetBook.totalCopies, targetBook.availableCopies + 1);
        }
      }

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Erro ao cancelar reserva.' });
    }
  });

  // Admin PATCH update reservation status
  app.patch('/api/books/reservations/:id/status', requireAdmin, async (req: Request, res: Response) => {
    try {
      const resId = String(req.params.id || '');
      const newStatus = req.body?.status as ServerBookReservation['status'];
      const validStatuses = new Set([
        'Pendente para Retirada',
        'Aprovado para Retirada',
        'Retirado / Emprestado',
        'Devolvido',
        'Cancelado',
      ]);
      if (!validStatuses.has(newStatus)) {
        res.status(400).json({ error: 'Status de reserva inválido.' });
        return;
      }

      const reservations = await getAllReservationsFromStore();
      const target = reservations.find((r) => r.id === resId);
      if (!target) {
        res.status(404).json({ error: 'Reserva não encontrada.' });
        return;
      }

      const oldStatus = target.status;
      const isOldInactive = oldStatus === 'Devolvido' || oldStatus === 'Cancelado';
      const isNewInactive = newStatus === 'Devolvido' || newStatus === 'Cancelado';
      const shouldReturnCopy = isNewInactive && !isOldInactive;
      const shouldConsumeCopy = !isNewInactive && isOldInactive;

      const books = await getAllBooksFromStore();
      const targetBook = books.find((b) => b.id === target.bookId);

      if (shouldConsumeCopy && targetBook && targetBook.availableCopies <= 0) {
        res.status(400).json({ error: 'Não há exemplares disponíveis deste livro no momento.' });
        return;
      }

      const nextAvailableCopies = targetBook
        ? shouldReturnCopy
          ? Math.min(targetBook.totalCopies, targetBook.availableCopies + 1)
          : shouldConsumeCopy
            ? Math.max(0, targetBook.availableCopies - 1)
            : targetBook.availableCopies
        : undefined;

      if (HAS_REDIS) {
        const nextReservations = reservations.map((r) =>
          r.id === resId ? { ...r, status: newStatus } : r
        );
        await redisSetJson(REDIS_RESERVATIONS_KEY, nextReservations);
        if ((shouldReturnCopy || shouldConsumeCopy) && targetBook && nextAvailableCopies !== undefined) {
          const nextBooks = books.map((b) =>
            b.id === targetBook.id
              ? { ...b, availableCopies: nextAvailableCopies }
              : b
          );
          await saveAllBooksToRedis(nextBooks);
        }
      } else if (db) {
        db.prepare('UPDATE book_reservations SET status = ? WHERE id = ?').run(newStatus, resId);
        if ((shouldReturnCopy || shouldConsumeCopy) && targetBook && nextAvailableCopies !== undefined) {
          db.prepare('UPDATE books SET available_copies = ?, updated_at = ? WHERE id = ?').run(
            nextAvailableCopies,
            new Date().toISOString(),
            targetBook.id
          );
        }
      } else {
        target.status = newStatus;
        if ((shouldReturnCopy || shouldConsumeCopy) && targetBook && nextAvailableCopies !== undefined) {
          targetBook.availableCopies = nextAvailableCopies;
        }
      }

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Erro ao atualizar status da reserva.' });
    }
  });

  // =========================================================================
  // MURAL DE AVISOS API (Notices & Attachments)
  // =========================================================================

  // Public GET notices (visitors can view without login)
  app.get('/api/notices', async (_req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    if (HAS_REDIS && !db) {
      const list = (await redisGetJson<any[]>(REDIS_NOTICES_KEY)) || [];
      res.json({ notices: list });
      return;
    }
    if (!db) {
      res.json({ notices: memoryNotices });
      return;
    }
    const rows = db
      .prepare(
        `SELECT * FROM notices
         ORDER BY is_highlighted DESC, published_date DESC, created_at DESC`
      )
      .all() as unknown as NoticeRow[];

    res.json({ notices: rows.map(serializeNotice) });
  });

  // Public GET attachment file
  app.get('/api/notices/attachments/:id', async (req: Request, res: Response) => {
    const attId = String(req.params.id || '');
    if (!db) {
      const stored = HAS_REDIS
        ? await redisGetJson<{ fileName: string; mimeType: string; base64Data: string }>(
            `${REDIS_NOTICE_ATT_PREFIX}${attId}`
          )
        : null;
      const mem = memoryNoticeAttachments.get(attId);
      const item = stored
        ? { fileName: stored.fileName, mimeType: stored.mimeType, buffer: Buffer.from(stored.base64Data, 'base64') }
        : mem;
      if (!item) {
        res.status(404).json({ error: 'Anexo não encontrado.' });
        return;
      }
      const forceDownload = req.query.download === '1';
      res.setHeader('Content-Type', item.mimeType);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader(
        'Content-Disposition',
        `${forceDownload ? 'attachment' : 'inline'}; filename*=UTF-8''${encodeURIComponent(item.fileName)}`
      );
      res.send(item.buffer);
      return;
    }

    const row = db
      .prepare('SELECT * FROM notice_attachments WHERE id = ?')
      .get(attId) as unknown as AttachmentRow | undefined;

    if (!row) {
      res.status(404).json({ error: 'Anexo não encontrado.' });
      return;
    }

    const fullPath = path.join(UPLOADS_DIR, path.basename(row.storage_path));
    if (!fs.existsSync(fullPath)) {
      res.status(404).json({ error: 'Arquivo do anexo indisponível no servidor.' });
      return;
    }

    const forceDownload = req.query.download === '1';
    const disposition = forceDownload ? 'attachment' : 'inline';
    res.setHeader('Content-Type', row.mime_type);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader(
      'Content-Disposition',
      `${disposition}; filename*=UTF-8''${encodeURIComponent(row.file_name)}`
    );
    res.sendFile(fullPath);
  });

  // Admin POST create notice
  app.post('/api/notices', requireAdmin, async (req: Request, res: Response) => {
    const parsed = validateAndParseNoticePayload(req.body);
    if ('error' in parsed) {
      res.status(400).json({ error: parsed.error });
      return;
    }

    const { title, description, category, publishedDate, isHighlighted, authorName, parsedAttachments } =
      parsed.data;
    const noticeId = `notice-${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    if (!db) {
      const attachments: any[] = [];
      for (const att of parsedAttachments) {
        const attId = `att-${crypto.randomUUID()}`;
        const url = HAS_BLOB
          ? (
              await putVercelBlob(`notices/${attId}-${att.fileName}`, att.buffer, {
                access: 'public',
                contentType: att.mimeType,
                token: BLOB_TOKEN,
              })
            ).url
          : `/api/notices/attachments/${encodeURIComponent(attId)}`;
        if (HAS_REDIS && !HAS_BLOB) {
          await redisSetJson(`${REDIS_NOTICE_ATT_PREFIX}${attId}`, {
            fileName: att.fileName,
            mimeType: att.mimeType,
            base64Data: att.buffer.toString('base64'),
          });
        } else if (!HAS_BLOB) {
          memoryNoticeAttachments.set(attId, { fileName: att.fileName, mimeType: att.mimeType, buffer: att.buffer });
        }
        attachments.push({
          id: attId,
          noticeId,
          fileName: att.fileName,
          mimeType: att.mimeType,
          fileSize: att.buffer.length,
          attachmentType: att.attachmentType,
          url,
          downloadUrl: `${url}${url.includes('?') ? '&' : '?'}download=1`,
          createdAt: now,
        });
      }
      const created = {
        id: noticeId,
        title,
        description,
        category,
        publishedDate,
        isHighlighted,
        authorName,
        createdAt: now,
        updatedAt: now,
        attachments,
      };
      if (HAS_REDIS) {
        const list = (await redisGetJson<any[]>(REDIS_NOTICES_KEY)) || [];
        const next = [created, ...list].sort(
          (a, b) => Number(b.isHighlighted) - Number(a.isHighlighted) || b.publishedDate.localeCompare(a.publishedDate)
        );
        await redisSetJson(REDIS_NOTICES_KEY, next);
      } else {
        memoryNotices.unshift(created);
      }
      res.status(201).json({ notice: created });
      return;
    }

    db.prepare(
      `INSERT INTO notices (
        id, title, description, category, published_date, is_highlighted, author_name, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      noticeId,
      title,
      description,
      category,
      publishedDate,
      isHighlighted ? 1 : 0,
      authorName,
      now,
      now
    );

    if (parsedAttachments.length > 0) {
      saveAttachmentFiles(noticeId, parsedAttachments);
    }

    const created = db
      .prepare('SELECT * FROM notices WHERE id = ?')
      .get(noticeId) as unknown as NoticeRow;

    res.status(201).json({ notice: serializeNotice(created) });
  });

  // Admin PUT update notice
  app.put('/api/notices/:id', requireAdmin, async (req: Request, res: Response) => {
    const noticeId = String(req.params.id || '');
    if (!db) {
      const parsed = validateAndParseNoticePayload(req.body);
      if ('error' in parsed) {
        res.status(400).json({ error: parsed.error });
        return;
      }
      const list = HAS_REDIS ? ((await redisGetJson<any[]>(REDIS_NOTICES_KEY)) || []) : memoryNotices;
      const existing = list.find((n) => n.id === noticeId);
      if (!existing) {
        res.status(404).json({ error: 'Comunicado não encontrado.' });
        return;
      }
      const { title, description, category, publishedDate, isHighlighted, authorName, keepAttachmentIds, parsedAttachments } = parsed.data;
      const keepSet = new Set(keepAttachmentIds);
      const kept = (existing.attachments || []).filter((a: any) => keepSet.has(a.id));
      const added: any[] = [];
      for (const att of parsedAttachments) {
        const attId = `att-${crypto.randomUUID()}`;
        const url = HAS_BLOB
          ? (
              await putVercelBlob(`notices/${attId}-${att.fileName}`, att.buffer, {
                access: 'public',
                contentType: att.mimeType,
                token: BLOB_TOKEN,
              })
            ).url
          : `/api/notices/attachments/${encodeURIComponent(attId)}`;
        if (HAS_REDIS && !HAS_BLOB) {
          await redisSetJson(`${REDIS_NOTICE_ATT_PREFIX}${attId}`, {
            fileName: att.fileName,
            mimeType: att.mimeType,
            base64Data: att.buffer.toString('base64'),
          });
        } else if (!HAS_BLOB) {
          memoryNoticeAttachments.set(attId, { fileName: att.fileName, mimeType: att.mimeType, buffer: att.buffer });
        }
        added.push({
          id: attId,
          noticeId,
          fileName: att.fileName,
          mimeType: att.mimeType,
          fileSize: att.buffer.length,
          attachmentType: att.attachmentType,
          url,
          downloadUrl: `${url}${url.includes('?') ? '&' : '?'}download=1`,
          createdAt: new Date().toISOString(),
        });
      }
      const updated = {
        ...existing,
        title,
        description,
        category,
        publishedDate,
        isHighlighted,
        authorName,
        updatedAt: new Date().toISOString(),
        attachments: [...kept, ...added],
      };
      const next = list.map((n) => (n.id === noticeId ? updated : n));
      if (HAS_REDIS) await redisSetJson(REDIS_NOTICES_KEY, next);
      else {
        const idx = memoryNotices.findIndex((n) => n.id === noticeId);
        if (idx >= 0) memoryNotices[idx] = updated;
      }
      res.json({ notice: updated });
      return;
    }

    const existing = db
      .prepare('SELECT * FROM notices WHERE id = ?')
      .get(noticeId) as unknown as NoticeRow | undefined;

    if (!existing) {
      res.status(404).json({ error: 'Comunicado não encontrado.' });
      return;
    }

    const parsed = validateAndParseNoticePayload(req.body);
    if ('error' in parsed) {
      res.status(400).json({ error: parsed.error });
      return;
    }

    const {
      title,
      description,
      category,
      publishedDate,
      isHighlighted,
      authorName,
      keepAttachmentIds,
      parsedAttachments,
    } = parsed.data;

    const currentAttachments = db
      .prepare('SELECT * FROM notice_attachments WHERE notice_id = ?')
      .all(noticeId) as unknown as AttachmentRow[];

    const keepSet = new Set(keepAttachmentIds);
    for (const att of currentAttachments) {
      if (!keepSet.has(att.id)) {
        db.prepare('DELETE FROM notice_attachments WHERE id = ?').run(att.id);
        deleteDiskFile(att.storage_path);
      }
    }

    const now = new Date().toISOString();
    db.prepare(
      `UPDATE notices
       SET title = ?, description = ?, category = ?, published_date = ?, is_highlighted = ?, author_name = ?, updated_at = ?
       WHERE id = ?`
    ).run(
      title,
      description,
      category,
      publishedDate,
      isHighlighted ? 1 : 0,
      authorName,
      now,
      noticeId
    );

    if (parsedAttachments.length > 0) {
      saveAttachmentFiles(noticeId, parsedAttachments);
    }

    const updated = db
      .prepare('SELECT * FROM notices WHERE id = ?')
      .get(noticeId) as unknown as NoticeRow;

    res.json({ notice: serializeNotice(updated) });
  });

  // Admin PATCH toggle highlight
  app.patch('/api/notices/:id/highlight', requireAdmin, async (req: Request, res: Response) => {
    const noticeId = String(req.params.id || '');
    if (!db) {
      const list = HAS_REDIS ? ((await redisGetJson<any[]>(REDIS_NOTICES_KEY)) || []) : memoryNotices;
      const target = list.find((n) => n.id === noticeId);
      if (!target) {
        res.status(404).json({ error: 'Comunicado não encontrado.' });
        return;
      }
      target.isHighlighted = Boolean(req.body?.isHighlighted);
      target.updatedAt = new Date().toISOString();
      if (HAS_REDIS) await redisSetJson(REDIS_NOTICES_KEY, list);
      res.json({ notice: target });
      return;
    }

    const existing = db
      .prepare('SELECT * FROM notices WHERE id = ?')
      .get(noticeId) as unknown as NoticeRow | undefined;

    if (!existing) {
      res.status(404).json({ error: 'Comunicado não encontrado.' });
      return;
    }

    const nextHighlight = req.body?.isHighlighted ? 1 : 0;
    const now = new Date().toISOString();

    db.prepare('UPDATE notices SET is_highlighted = ?, updated_at = ? WHERE id = ?').run(
      nextHighlight,
      now,
      noticeId
    );

    const updated = db
      .prepare('SELECT * FROM notices WHERE id = ?')
      .get(noticeId) as unknown as NoticeRow;

    res.json({ notice: serializeNotice(updated) });
  });

  // Admin DELETE notice
  app.delete('/api/notices/:id', requireAdmin, async (req: Request, res: Response) => {
    const noticeId = String(req.params.id || '');
    if (!db) {
      if (HAS_REDIS) {
        const list = (await redisGetJson<any[]>(REDIS_NOTICES_KEY)) || [];
        await redisSetJson(REDIS_NOTICES_KEY, list.filter((n) => n.id !== noticeId));
      } else {
        const idx = memoryNotices.findIndex((n) => n.id === noticeId);
        if (idx >= 0) memoryNotices.splice(idx, 1);
      }
      res.json({ success: true });
      return;
    }

    const existing = db
      .prepare('SELECT * FROM notices WHERE id = ?')
      .get(noticeId) as unknown as NoticeRow | undefined;

    if (!existing) {
      res.status(404).json({ error: 'Comunicado não encontrado.' });
      return;
    }

    const attRows = db
      .prepare('SELECT * FROM notice_attachments WHERE notice_id = ?')
      .all(noticeId) as unknown as AttachmentRow[];

    db.prepare('DELETE FROM notices WHERE id = ?').run(noticeId);

    for (const att of attRows) {
      deleteDiskFile(att.storage_path);
    }

    res.json({ success: true });
  });

  // Catch-all for unknown /api routes
  app.all('/api/*', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'Rota da API não encontrada.' });
  });

  return app;
}

async function startServer() {
  const app = await createApiApp();

  if (IS_PRODUCTION) {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const vite = await import('vite');
    const viteServer = await vite.createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(viteServer.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CETI Verônica Celestina Dias server running on http://0.0.0.0:${PORT}`);
  });
}

const isDirectExecution =
  !IS_VERCEL && (process.argv[1] ? path.resolve(process.argv[1]) === __filename : true);

if (isDirectExecution) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}
