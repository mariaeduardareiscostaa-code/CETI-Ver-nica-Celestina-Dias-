export type NoticeCategory =
  | 'Geral'
  | 'Eventos'
  | 'Reuniões'
  | 'Avaliações'
  | 'Comunicados';

export const NOTICE_CATEGORIES: NoticeCategory[] = [
  'Geral',
  'Eventos',
  'Reuniões',
  'Avaliações',
  'Comunicados',
];

export const NOTICE_LIMITS = {
  TITLE_MIN: 3,
  TITLE_MAX: 150,
  DESCRIPTION_MIN: 10,
  DESCRIPTION_MAX: 5000,
  MAX_ATTACHMENTS: 5,
  MAX_FILE_SIZE_BYTES: 8 * 1024 * 1024, // 8 MB
};

export interface NoticeAttachment {
  id: string;
  noticeId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  attachmentType: 'image' | 'document';
  url: string;
  downloadUrl: string;
  createdAt: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  description: string;
  category: NoticeCategory;
  publishedDate: string; // YYYY-MM-DD
  isHighlighted: boolean;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  attachments: NoticeAttachment[];
}

export interface PendingAttachmentUpload {
  fileName: string;
  mimeType: string;
  fileSize: number;
  base64Data: string;
}

export interface NoticeMutationPayload {
  title: string;
  description: string;
  category: NoticeCategory;
  publishedDate: string;
  isHighlighted: boolean;
  authorName?: string;
  keepAttachmentIds?: string[];
  newAttachments?: PendingAttachmentUpload[];
}
