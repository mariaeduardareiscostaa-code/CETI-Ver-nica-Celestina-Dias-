import {
  NoticeItem,
  NoticeMutationPayload,
  PendingAttachmentUpload,
  NOTICE_LIMITS,
} from '../types/notices';

const ADMIN_TOKEN_STORAGE_KEY = 'vcd_admin_token';

export function getStoredAdminToken(): string | null {
  try {
    return localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function storeAdminToken(token: string): void {
  try {
    localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
    localStorage.setItem('vcd_admin_logged_in', 'true');
  } catch {
    // ignore storage quota errors
  }
}

export function clearAdminToken(): void {
  try {
    localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    localStorage.removeItem('vcd_admin_logged_in');
  } catch {
    // ignore
  }
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error('Resposta inválida do servidor.');
  }

  if (!response.ok) {
    const err = new Error(data?.error || 'Erro ao processar solicitação no servidor.') as Error & {
      status?: number;
    };
    err.status = response.status;
    throw err;
  }

  return data as T;
}

export async function loginAdminServer(accessKey: string): Promise<{ token: string; expiresAt: string }> {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessKey }),
  });

  const data = await parseJsonResponse<{ token: string; expiresAt: string }>(response);
  storeAdminToken(data.token);
  return data;
}

export async function verifyAdminSession(token: string): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/session', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return Boolean(data?.authenticated);
  } catch {
    return false;
  }
}

export async function fetchNotices(): Promise<NoticeItem[]> {
  const response = await fetch('/api/notices');
  const data = await parseJsonResponse<{ notices: NoticeItem[] }>(response);
  return data.notices;
}

export async function createNotice(
  token: string,
  payload: NoticeMutationPayload
): Promise<NoticeItem> {
  const response = await fetch('/api/notices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await parseJsonResponse<{ notice: NoticeItem }>(response);
  return data.notice;
}

export async function updateNotice(
  token: string,
  id: string,
  payload: NoticeMutationPayload
): Promise<NoticeItem> {
  const response = await fetch(`/api/notices/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await parseJsonResponse<{ notice: NoticeItem }>(response);
  return data.notice;
}

export async function toggleNoticeHighlight(
  token: string,
  id: string,
  isHighlighted: boolean
): Promise<NoticeItem> {
  const response = await fetch(`/api/notices/${encodeURIComponent(id)}/highlight`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isHighlighted }),
  });
  const data = await parseJsonResponse<{ notice: NoticeItem }>(response);
  return data.notice;
}

export async function deleteNotice(token: string, id: string): Promise<void> {
  const response = await fetch(`/api/notices/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  await parseJsonResponse<{ success: boolean }>(response);
}

const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]);

export function inferMimeTypeFromFile(file: File): string {
  if (file.type && ALLOWED_MIME_TYPES.has(file.type)) {
    return file.type;
  }
  const ext = file.name.split('.').pop()?.toLowerCase();
  const extMap: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
    pdf: 'application/pdf',
    txt: 'text/plain',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  };
  return (ext && extMap[ext]) || file.type || '';
}

export function fileToPendingAttachment(file: File): Promise<PendingAttachmentUpload> {
  return new Promise((resolve, reject) => {
    const mimeType = inferMimeTypeFromFile(file);
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      reject(
        new Error(
          `Formato não suportado para "${file.name}". Envie imagens (PNG, JPG, WEBP, GIF) ou documentos (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT).`
        )
      );
      return;
    }

    if (file.size > NOTICE_LIMITS.MAX_FILE_SIZE_BYTES) {
      reject(new Error(`O arquivo "${file.name}" excede o limite de 8 MB.`));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const base64Data = result.includes(',') ? result.split(',')[1] : result;
      if (!base64Data) {
        reject(new Error(`Não foi possível ler o arquivo "${file.name}".`));
        return;
      }
      resolve({
        fileName: file.name,
        mimeType,
        fileSize: file.size,
        base64Data,
      });
    };
    reader.onerror = () => reject(new Error(`Erro ao ler o arquivo "${file.name}".`));
    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
