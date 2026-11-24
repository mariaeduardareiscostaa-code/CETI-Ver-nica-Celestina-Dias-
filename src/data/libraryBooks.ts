import estrelaImg from '../assets/images/estrela.jfif';

export interface Book {
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

export interface BookReservation {
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

export interface PresetCover {
  id: string;
  label: string;
  url: string;
}

export const ASSET_ESTRELA_TOKEN = '__ASSET_ESTRELA__';

export function resolveBookCoverUrl(coverImage?: string | null, bookId?: string): string | undefined {
  if (!coverImage || typeof coverImage !== 'string') {
    return undefined;
  }
  const trimmed = coverImage.trim();
  if (!trimmed || trimmed.startsWith('data:image/svg+xml')) {
    return undefined;
  }
  if (
    trimmed === ASSET_ESTRELA_TOKEN ||
    (bookId === 'book-04' && (trimmed.includes('estrela.jfif') || trimmed.includes('/assets/estrela-'))) ||
    trimmed.endsWith('/src/assets/images/estrela.jfif')
  ) {
    return estrelaImg;
  }
  return trimmed;
}

export function serializeBookCoverForStorage(coverImage?: string | null): string | undefined {
  if (!coverImage || typeof coverImage !== 'string') {
    return undefined;
  }
  const trimmed = coverImage.trim();
  if (!trimmed || trimmed.startsWith('data:image/svg+xml')) {
    return undefined;
  }
  if (
    trimmed === estrelaImg ||
    trimmed === ASSET_ESTRELA_TOKEN ||
    trimmed.endsWith('/src/assets/images/estrela.jfif') ||
    /\/assets\/estrela-[a-zA-Z0-9_-]+\.jfif$/i.test(trimmed)
  ) {
    return ASSET_ESTRELA_TOKEN;
  }
  return trimmed;
}

export function normalizeBook(book: Book): Book {
  return {
    ...book,
    coverImage: resolveBookCoverUrl(book.coverImage, book.id),
    tags: Array.isArray(book.tags) ? book.tags : [],
  };
}

export const PRESET_BOOK_COVERS: PresetCover[] = [
  {
    id: 'preset-estrela',
    label: 'A Hora da Estrela',
    url: estrelaImg,
  },
];

export const INITIAL_BOOKS: Book[] = [
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
    coverImage: estrelaImg,
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
