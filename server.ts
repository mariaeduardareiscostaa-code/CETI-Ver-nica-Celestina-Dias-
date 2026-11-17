/// <reference types="node" />

import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import express, { type Request, type Response, type NextFunction } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Persistent storage directories
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const DB_PATH = path.join(DATA_DIR, 'mural_avisos.db');
const SECRET_PATH = path.join(DATA_DIR, '.session_secret');

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Load or generate stable server-side HMAC session secret
function getSessionSecret(): string {
  if (process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET !== 'MY_ADMIN_SESSION_SECRET') {
    return process.env.ADMIN_SESSION_SECRET;
  }
  if (fs.existsSync(SECRET_PATH)) {
    const existing = fs.readFileSync(SECRET_PATH, 'utf8').trim();
    if (existing.length >= 32) return existing;
  }
  const generated = crypto.randomBytes(48).toString('hex');
  fs.writeFileSync(SECRET_PATH, generated, { mode: 0o600 });
  return generated;
}

const SESSION_SECRET = getSessionSecret();
const ADMIN_ACCESS_KEY = (process.env.ADMIN_ACCESS_KEY || '12345').trim();
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

// Initialize SQLite Database (built-in node:sqlite)
const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
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
`);

// Seed initial notices once if database is empty
const countRow = db.prepare('SELECT COUNT(*) AS total FROM notices').get() as { total: number };
if (countRow && countRow.total === 0) {
  const now = new Date().toISOString();
  const insertSeed = db.prepare(`
    INSERT INTO notices (
      id, title, description, category, published_date, is_highlighted, author_name, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const seedNotices = [
    {
      id: 'notice-seed-01',
      title: 'Calendário Oficial das Avaliações Bimestrais (4º Bimestre)',
      description:
        'A Coordenação Pedagógica informa aos estudantes e responsáveis da 1ª, 2ª e 3ª séries do Ensino Médio Integral que as avaliações bimestrais ocorrerão entre os dias 24 e 28 de novembro, no turno da manhã. É indispensável comparecer com fardamento completo e material escolar próprio. Confira os conteúdos revisados pelos professores em sala e na Biblioteca Digital.',
      category: 'Avaliações',
      published_date: '2026-11-17',
      is_highlighted: 1,
      author_name: 'Coordenação Pedagógica',
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      updated_at: now,
    },
    {
      id: 'notice-seed-02',
      title: 'Plantão Pedagógico e Reunião com Pais e Responsáveis',
      description:
        'Convidamos todos os pais e responsáveis para a reunião geral de acompanhamento pedagógico do 4º bimestre, que será realizada no Pátio Coberto do CETI Verônica Celestina Dias às 08h30. Na ocasião serão entregues os boletins parciais e alinhadas as metas de frequência e aprovação para o encerramento do ano letivo.',
      category: 'Reuniões',
      published_date: '2026-11-15',
      is_highlighted: 1,
      author_name: 'Direção Escolar',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      updated_at: now,
    },
    {
      id: 'notice-seed-03',
      title: 'Feira Tecnológica e Mostra de Projetos dos Cursos Técnicos 2026',
      description:
        'As turmas dos cursos Técnicos em Administração, Desenvolvimento de Sistemas e Controle Ambiental apresentarão seus projetos integradores abertos à comunidade escolar de Campo Alegre do Fidalgo. Haverá exposição de protótipos, planos de negócios e ações de educação ambiental no pátio e laboratórios.',
      category: 'Eventos',
      published_date: '2026-11-12',
      is_highlighted: 0,
      author_name: 'Coordenação dos Cursos Técnicos',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      updated_at: now,
    },
    {
      id: 'notice-seed-04',
      title: 'Horário de Funcionamento da Biblioteca Escolar para Estudos e Reservas',
      description:
        'Lembramos aos alunos que a biblioteca física funciona durante todos os intervalos (09h30, 11h50 e 14h50) para retirada de exemplares reservados pelo portal digital e estudo orientado. O prazo padrão de empréstimo é de 14 dias corridos.',
      category: 'Comunicados',
      published_date: '2026-11-10',
      is_highlighted: 0,
      author_name: 'Equipe da Biblioteca',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
      updated_at: now,
    },
    {
      id: 'notice-seed-05',
      title: 'Normas sobre Uso de Fardamento Completo e Pontualidade na Entrada',
      description:
        'Reforçamos junto às famílias que o portão principal é aberto às 07h15 e o início da 1ª aula ocorre pontualmente às 07h30. O uso do fardamento padrão da rede estadual SEDUC-PI e do crachá ou identificação escolar é obrigatório para acesso e permanência no tempo integral.',
      category: 'Geral',
      published_date: '2026-11-08',
      is_highlighted: 0,
      author_name: 'Direção Escolar',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
      updated_at: now,
    },
  ];

  for (const item of seedNotices) {
    insertSeed.run(
      item.id,
      item.title,
      item.description,
      item.category,
      item.published_date,
      item.is_highlighted,
      item.author_name,
      item.created_at,
      item.updated_at
    );
  }
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

async function startServer() {
  const app = express();

  app.use('/api', express.json({ limit: '45mb' }));

  // Public Health Check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', database: 'sqlite' });
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

  // Public GET notices (visitors can view without login)
  app.get('/api/notices', (_req: Request, res: Response) => {
    const rows = db
      .prepare(
        `SELECT * FROM notices
         ORDER BY is_highlighted DESC, published_date DESC, created_at DESC`
      )
      .all() as unknown as NoticeRow[];

    res.json({ notices: rows.map(serializeNotice) });
  });

  // Public GET attachment file
  app.get('/api/notices/attachments/:id', (req: Request, res: Response) => {
    const attId = String(req.params.id || '');
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
  app.post('/api/notices', requireAdmin, (req: Request, res: Response) => {
    const parsed = validateAndParseNoticePayload(req.body);
    if ('error' in parsed) {
      res.status(400).json({ error: parsed.error });
      return;
    }

    const { title, description, category, publishedDate, isHighlighted, authorName, parsedAttachments } =
      parsed.data;
    const noticeId = `notice-${crypto.randomUUID()}`;
    const now = new Date().toISOString();

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
  app.put('/api/notices/:id', requireAdmin, (req: Request, res: Response) => {
    const noticeId = String(req.params.id || '');
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

    // Remove attachments that were unchecked/deleted during edit
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
  app.patch('/api/notices/:id/highlight', requireAdmin, (req: Request, res: Response) => {
    const noticeId = String(req.params.id || '');
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
  app.delete('/api/notices/:id', requireAdmin, (req: Request, res: Response) => {
    const noticeId = String(req.params.id || '');
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

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
