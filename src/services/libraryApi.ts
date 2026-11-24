import {
  Book,
  BookReservation,
  INITIAL_BOOKS,
  normalizeBook,
  serializeBookCoverForStorage,
} from '../data/libraryBooks';

const BOOKS_CACHE_KEY = 'vcd_library_books';
const RESERVATIONS_CACHE_KEY = 'vcd_library_reservations';
export const LIBRARY_UPDATED_EVENT = 'vcd-library-updated';

export interface PreparedCoverUpload {
  fileName: string;
  mimeType: string;
  base64Data: string;
  previewDataUrl: string;
}

export function dispatchLibraryUpdated(): void {
  try {
    window.dispatchEvent(new CustomEvent(LIBRARY_UPDATED_EVENT));
  } catch {
    // ignore in non-browser contexts
  }
}

export function getCachedLibraryBooks(): Book[] {
  try {
    const stored = localStorage.getItem(BOOKS_CACHE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((b: Book) => normalizeBook(b));
      }
    }
  } catch {
    // ignore parse error
  }
  return INITIAL_BOOKS.map(normalizeBook);
}

export function saveCachedLibraryBooks(books: Book[]): void {
  const portable = books.map((b) => ({
    ...b,
    coverImage: serializeBookCoverForStorage(b.coverImage),
  }));
  try {
    localStorage.setItem(BOOKS_CACHE_KEY, JSON.stringify(portable));
  } catch {
    // If localStorage quota is full (e.g. from legacy base64 entries), drop inline data URLs from cache
    try {
      const compact = portable.map((b) => ({
        ...b,
        coverImage:
          typeof b.coverImage === 'string' && b.coverImage.startsWith('data:')
            ? undefined
            : b.coverImage,
      }));
      localStorage.setItem(BOOKS_CACHE_KEY, JSON.stringify(compact));
    } catch {
      // ignore storage quota errors
    }
  }
}

export function getCachedReservations(): BookReservation[] {
  try {
    const stored = localStorage.getItem(RESERVATIONS_CACHE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

export function saveCachedReservations(reservations: BookReservation[]): void {
  try {
    localStorage.setItem(RESERVATIONS_CACHE_KEY, JSON.stringify(reservations));
  } catch {
    // ignore
  }
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error('Resposta inválida do servidor.');
  }

  if (!response.ok) {
    const err = new Error(data?.error || 'Erro ao comunicar com o servidor da biblioteca.') as Error & {
      status?: number;
    };
    err.status = response.status;
    throw err;
  }
  return data as T;
}

function inferImageMime(file: File): string {
  const raw = (file.type || '').toLowerCase();
  if (raw === 'image/jfif' || raw === 'image/pjpeg') return 'image/jpeg';
  if (raw.startsWith('image/')) return raw;
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'jpg' || ext === 'jpeg' || ext === 'jfif') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'gif') return 'image/gif';
  return '';
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string' && reader.result) {
        resolve(reader.result);
      } else {
        reject(new Error('Não foi possível ler o arquivo de imagem.'));
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler a imagem selecionada.'));
    reader.readAsDataURL(file);
  });
}

export async function prepareCoverImageFile(file: File): Promise<PreparedCoverUpload> {
  const mimeType = inferImageMime(file);
  if (!mimeType || !['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'].includes(mimeType)) {
    throw new Error('Por favor selecione uma imagem válida (JPG, PNG, WebP ou GIF).');
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('A imagem é muito grande. Escolha uma imagem de até 10 MB.');
  }

  const originalDataUrl = await readFileAsDataUrl(file);

  // Preserve animated GIFs directly
  if (mimeType === 'image/gif') {
    return {
      fileName: file.name,
      mimeType,
      base64Data: originalDataUrl.split(',')[1] || '',
      previewDataUrl: originalDataUrl,
    };
  }

  // Resize and optimize large phone/desktop photos on canvas so uploads are fast and reliable
  try {
    const optimized = await new Promise<PreparedCoverUpload>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 900;
        const maxHeight = 1350;
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        const targetMime = mimeType === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl =
          targetMime === 'image/png'
            ? canvas.toDataURL('image/png')
            : canvas.toDataURL('image/jpeg', 0.86);

        const base64Data = dataUrl.split(',')[1] || '';
        if (!base64Data) {
          reject(new Error('Empty canvas output'));
          return;
        }
        resolve({
          fileName: file.name,
          mimeType: targetMime,
          base64Data,
          previewDataUrl: dataUrl,
        });
      };
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.src = originalDataUrl;
    });

    return optimized;
  } catch {
    return {
      fileName: file.name,
      mimeType: mimeType === 'image/jpg' ? 'image/jpeg' : mimeType,
      base64Data: originalDataUrl.split(',')[1] || '',
      previewDataUrl: originalDataUrl,
    };
  }
}

export async function uploadBookCoverApi(
  token: string,
  upload: PreparedCoverUpload
): Promise<{ id: string; url: string }> {
  const response = await fetch('/api/books/covers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      fileName: upload.fileName,
      mimeType: upload.mimeType,
      base64Data: upload.base64Data,
    }),
  });
  return parseApiResponse<{ id: string; url: string }>(response);
}

export async function fetchLibraryBooks(): Promise<Book[]> {
  try {
    const response = await fetch('/api/books', { cache: 'no-store' });
    const data = await parseApiResponse<{ books: Book[] }>(response);
    if (Array.isArray(data.books)) {
      const normalized = data.books.map(normalizeBook);
      saveCachedLibraryBooks(normalized);
      return normalized;
    }
  } catch {
    // Fallback to cached books if API is unreachable
  }
  return getCachedLibraryBooks();
}

export async function createBookApi(
  token: string,
  bookPayload: Partial<Book> & { title: string; author: string; coverUpload?: PreparedCoverUpload | null }
): Promise<Book> {
  const body: any = {
    ...bookPayload,
    coverImage: serializeBookCoverForStorage(bookPayload.coverImage),
  };
  if (bookPayload.coverUpload) {
    body.coverUpload = {
      fileName: bookPayload.coverUpload.fileName,
      mimeType: bookPayload.coverUpload.mimeType,
      base64Data: bookPayload.coverUpload.base64Data,
    };
  }

  const response = await fetch('/api/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await parseApiResponse<{ book: Book }>(response);
  return normalizeBook(data.book);
}

export async function updateBookApi(
  token: string,
  bookId: string,
  bookPayload: Partial<Book> & { coverUpload?: PreparedCoverUpload | null }
): Promise<Book> {
  const body: any = {
    ...bookPayload,
    coverImage: serializeBookCoverForStorage(bookPayload.coverImage),
  };
  if (bookPayload.coverUpload) {
    body.coverUpload = {
      fileName: bookPayload.coverUpload.fileName,
      mimeType: bookPayload.coverUpload.mimeType,
      base64Data: bookPayload.coverUpload.base64Data,
    };
  }

  const response = await fetch(`/api/books/${encodeURIComponent(bookId)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await parseApiResponse<{ book: Book }>(response);
  return normalizeBook(data.book);
}

export async function updateBookCoverApi(
  token: string,
  bookId: string,
  payload: { coverImage?: string; coverUpload?: PreparedCoverUpload | null }
): Promise<Book> {
  const body: any = {
    coverImage: serializeBookCoverForStorage(payload.coverImage),
  };
  if (payload.coverUpload) {
    body.coverUpload = {
      fileName: payload.coverUpload.fileName,
      mimeType: payload.coverUpload.mimeType,
      base64Data: payload.coverUpload.base64Data,
    };
  }

  const response = await fetch(`/api/books/${encodeURIComponent(bookId)}/cover`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await parseApiResponse<{ book: Book }>(response);
  return normalizeBook(data.book);
}

export async function deleteBookApi(token: string, bookId: string): Promise<void> {
  const response = await fetch(`/api/books/${encodeURIComponent(bookId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  await parseApiResponse<{ success: boolean }>(response);
}

export async function restoreDefaultBooksApi(token: string): Promise<Book[]> {
  const response = await fetch('/api/books/restore-defaults', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await parseApiResponse<{ books: Book[] }>(response);
  const normalized = data.books.map(normalizeBook);
  saveCachedLibraryBooks(normalized);
  return normalized;
}

export async function syncLocalBooksToServer(token: string): Promise<Book[] | null> {
  try {
    if (sessionStorage.getItem('vcd_local_books_synced') === '1') {
      return null;
    }
    const stored = localStorage.getItem(BOOKS_CACHE_KEY);
    if (!stored) {
      sessionStorage.setItem('vcd_local_books_synced', '1');
      return null;
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      sessionStorage.setItem('vcd_local_books_synced', '1');
      return null;
    }

    const seedIds = new Set(INITIAL_BOOKS.map((b) => b.id));
    const hasUnsyncedCustomData = parsed.some(
      (b: any) =>
        b &&
        typeof b.id === 'string' &&
        (!seedIds.has(b.id) || (typeof b.coverImage === 'string' && b.coverImage.startsWith('data:image/')))
    );

    if (!hasUnsyncedCustomData) {
      sessionStorage.setItem('vcd_local_books_synced', '1');
      return null;
    }

    const response = await fetch('/api/books/sync-local', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ books: parsed }),
    });
    const data = await parseApiResponse<{ books: Book[] }>(response);
    const normalized = data.books.map(normalizeBook);
    saveCachedLibraryBooks(normalized);
    sessionStorage.setItem('vcd_local_books_synced', '1');
    return normalized;
  } catch {
    return null;
  }
}

export async function fetchBookReservations(): Promise<BookReservation[]> {
  try {
    const response = await fetch('/api/books/reservations', { cache: 'no-store' });
    const data = await parseApiResponse<{ reservations: BookReservation[] }>(response);
    if (Array.isArray(data.reservations)) {
      saveCachedReservations(data.reservations);
      return data.reservations;
    }
  } catch {
    // fallback
  }
  return getCachedReservations();
}

export async function createBookReservationApi(payload: {
  bookId: string;
  studentName: string;
  studentMatricula: string;
  studentGrade: string;
  studentContact: string;
  notes: string;
}): Promise<{ reservation: BookReservation; book: Book }> {
  const response = await fetch('/api/books/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await parseApiResponse<{ reservation: BookReservation; book: Book }>(response);
  return {
    reservation: data.reservation,
    book: normalizeBook(data.book),
  };
}

export async function cancelBookReservationApi(reservationId: string): Promise<void> {
  const response = await fetch(`/api/books/reservations/${encodeURIComponent(reservationId)}/cancel`, {
    method: 'PATCH',
  });
  await parseApiResponse<{ success: boolean }>(response);
}

export async function updateBookReservationStatusApi(
  token: string,
  reservationId: string,
  status: BookReservation['status']
): Promise<void> {
  const response = await fetch(`/api/books/reservations/${encodeURIComponent(reservationId)}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  await parseApiResponse<{ success: boolean }>(response);
}
