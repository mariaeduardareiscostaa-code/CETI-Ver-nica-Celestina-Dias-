import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Megaphone,
  Plus,
  Search,
  Pin,
  PinOff,
  Pencil,
  Trash2,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  RefreshCw,
  Save,
  Star
} from 'lucide-react';
import {
  NoticeCategory,
  NoticeItem,
  NoticeAttachment,
  PendingAttachmentUpload,
  NOTICE_CATEGORIES,
  NOTICE_LIMITS,
} from '../types/notices';
import {
  fetchNotices,
  createNotice,
  updateNotice,
  toggleNoticeHighlight,
  deleteNotice,
  fileToPendingAttachment,
  formatFileSize,
} from '../services/noticesApi';

interface AdminMuralTabProps {
  adminToken: string | null;
  onSessionExpired: () => void;
  onNoticesCountChange?: (count: number) => void;
}

const CATEGORY_BADGES: Record<NoticeCategory, string> = {
  Geral: 'bg-stone-100 text-stone-800 border-stone-200',
  Eventos: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  Reuniões: 'bg-amber-100 text-amber-900 border-amber-200',
  Avaliações: 'bg-rose-100 text-rose-900 border-rose-200',
  Comunicados: 'bg-sky-100 text-sky-900 border-sky-200',
};

function getTodayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDatePtBr(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export default function AdminMuralTab({
  adminToken,
  onSessionExpired,
  onNoticesCountChange,
}: AdminMuralTabProps) {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'Todos' | NoticeCategory>('Todos');

  // Create/Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('Comunicados');
  const [publishedDate, setPublishedDate] = useState(getTodayIsoDate());
  const [authorName, setAuthorName] = useState('Direção Escolar');
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [keptAttachments, setKeptAttachments] = useState<NoticeAttachment[]>([]);
  const [newAttachments, setNewAttachments] = useState<PendingAttachmentUpload[]>([]);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation modal
  const [noticeToDelete, setNoticeToDelete] = useState<NoticeItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Busy IDs for quick toggle
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  const loadNotices = async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const data = await fetchNotices();
      setNotices(data);
      onNoticesCountChange?.(data.length);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Erro ao carregar avisos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleAuthError = (err: unknown): boolean => {
    const status = (err as { status?: number })?.status;
    if (status === 401 || status === 403) {
      onSessionExpired();
      return true;
    }
    return false;
  };

  const openCreateModal = () => {
    setEditingNotice(null);
    setTitle('');
    setDescription('');
    setCategory('Comunicados');
    setPublishedDate(getTodayIsoDate());
    setAuthorName('Direção Escolar');
    setIsHighlighted(false);
    setKeptAttachments([]);
    setNewAttachments([]);
    setFormErrors([]);
    setIsModalOpen(true);
  };

  const openEditModal = (notice: NoticeItem) => {
    setEditingNotice(notice);
    setTitle(notice.title);
    setDescription(notice.description);
    setCategory(notice.category);
    setPublishedDate(notice.publishedDate || getTodayIsoDate());
    setAuthorName(notice.authorName || 'Direção Escolar');
    setIsHighlighted(notice.isHighlighted);
    setKeptAttachments(notice.attachments || []);
    setNewAttachments([]);
    setFormErrors([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setEditingNotice(null);
    setFormErrors([]);
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (files.length === 0) return;

    const currentTotal = keptAttachments.length + newAttachments.length;
    if (currentTotal + files.length > NOTICE_LIMITS.MAX_ATTACHMENTS) {
      setFormErrors([
        `Máximo de ${NOTICE_LIMITS.MAX_ATTACHMENTS} anexos por comunicado (você já selecionou ${currentTotal}).`,
      ]);
      return;
    }

    const errors: string[] = [];
    const converted: PendingAttachmentUpload[] = [];

    for (const file of files) {
      try {
        const pending = await fileToPendingAttachment(file);
        converted.push(pending);
      } catch (err) {
        errors.push(err instanceof Error ? err.message : `Falha ao anexar "${file.name}".`);
      }
    }

    if (converted.length > 0) {
      setNewAttachments((prev) => [...prev, ...converted]);
    }
    setFormErrors(errors);
  };

  const removeKeptAttachment = (id: string) => {
    setKeptAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const removeNewAttachment = (index: number) => {
    setNewAttachments((prev) => prev.filter((_, idx) => idx !== index));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    const cleanTitle = title.trim();
    const cleanDesc = description.trim();

    if (cleanTitle.length < NOTICE_LIMITS.TITLE_MIN) {
      errors.push(`O título deve ter pelo menos ${NOTICE_LIMITS.TITLE_MIN} caracteres.`);
    } else if (cleanTitle.length > NOTICE_LIMITS.TITLE_MAX) {
      errors.push(`O título deve ter no máximo ${NOTICE_LIMITS.TITLE_MAX} caracteres.`);
    }

    if (cleanDesc.length < NOTICE_LIMITS.DESCRIPTION_MIN) {
      errors.push(`A descrição deve ter pelo menos ${NOTICE_LIMITS.DESCRIPTION_MIN} caracteres.`);
    } else if (cleanDesc.length > NOTICE_LIMITS.DESCRIPTION_MAX) {
      errors.push(`A descrição deve ter no máximo ${NOTICE_LIMITS.DESCRIPTION_MAX} caracteres.`);
    }

    if (!NOTICE_CATEGORIES.includes(category)) {
      errors.push('Selecione uma categoria válida.');
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedDate)) {
      errors.push('Informe uma data de publicação válida.');
    }

    if (keptAttachments.length + newAttachments.length > NOTICE_LIMITS.MAX_ATTACHMENTS) {
      errors.push(`O comunicado pode ter no máximo ${NOTICE_LIMITS.MAX_ATTACHMENTS} anexos.`);
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    if (!adminToken) {
      onSessionExpired();
      return;
    }

    setIsSubmitting(true);
    setFormErrors([]);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        publishedDate,
        isHighlighted,
        authorName: authorName.trim() || 'Direção Escolar',
        keepAttachmentIds: keptAttachments.map((a) => a.id),
        newAttachments,
      };

      if (editingNotice) {
        const updated = await updateNotice(adminToken, editingNotice.id, payload);
        setNotices((prev) => {
          const next = prev.map((item) => (item.id === updated.id ? updated : item));
          return sortNoticesClient(next);
        });
        showFeedback('success', `Comunicado "${updated.title}" atualizado com sucesso!`);
      } else {
        const created = await createNotice(adminToken, payload);
        setNotices((prev) => {
          const next = [created, ...prev];
          onNoticesCountChange?.(next.length);
          return sortNoticesClient(next);
        });
        showFeedback('success', `Aviso "${created.title}" publicado no Mural de Avisos!`);
      }

      setIsModalOpen(false);
      setEditingNotice(null);
    } catch (err) {
      if (handleAuthError(err)) return;
      setFormErrors([err instanceof Error ? err.message : 'Erro ao salvar comunicado.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickHighlightToggle = async (notice: NoticeItem) => {
    if (!adminToken) {
      onSessionExpired();
      return;
    }

    setTogglingId(notice.id);
    try {
      const updated = await toggleNoticeHighlight(adminToken, notice.id, !notice.isHighlighted);
      setNotices((prev) => sortNoticesClient(prev.map((n) => (n.id === updated.id ? updated : n))));
      showFeedback(
        'success',
        updated.isHighlighted
          ? `"${updated.title}" destacado no início do mural.`
          : `Destaque removido de "${updated.title}".`
      );
    } catch (err) {
      if (handleAuthError(err)) return;
      showFeedback('error', err instanceof Error ? err.message : 'Erro ao alterar destaque.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!noticeToDelete) return;
    if (!adminToken) {
      onSessionExpired();
      return;
    }

    setIsDeleting(true);
    try {
      await deleteNotice(adminToken, noticeToDelete.id);
      setNotices((prev) => {
        const next = prev.filter((n) => n.id !== noticeToDelete.id);
        onNoticesCountChange?.(next.length);
        return next;
      });
      showFeedback('success', `Aviso "${noticeToDelete.title}" excluído permanentemente.`);
      setNoticeToDelete(null);
    } catch (err) {
      if (handleAuthError(err)) return;
      showFeedback('error', err instanceof Error ? err.message : 'Erro ao excluir comunicado.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredNotices = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return notices.filter((n) => {
      const matchesCat = categoryFilter === 'Todos' || n.category === categoryFilter;
      const matchesSearch =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) ||
        n.authorName.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [notices, searchTerm, categoryFilter]);

  const highlightedCount = notices.filter((n) => n.isHighlighted).length;

  return (
    <div className="bg-white rounded-b-2xl p-6 border border-stone-200 border-t-0 space-y-6">
      {/* Header & Main CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-1.5">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Comunicação Oficial · Banco Persistente</span>
          </div>
          <h3 className="text-xl font-bold text-emerald-950">Gerenciar Mural de Avisos</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Publique comunicados, anexe imagens ou documentos e fixe avisos importantes no início do mural.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={loadNotices}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
            title="Atualizar lista"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Novo Aviso</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-3 border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 rounded hover:bg-black/5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Quick Stats + Filters */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 font-semibold">
            Total: <strong className="text-emerald-950">{notices.length}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold inline-flex items-center gap-1.5">
            <Pin className="w-3.5 h-3.5 text-amber-700" />
            <span>Destaques: <strong>{highlightedCount}</strong></span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título, conteúdo ou autor..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-stone-50/50"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as 'Todos' | NoticeCategory)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-stone-300 bg-white text-stone-800 focus:ring-2 focus:ring-emerald-600 cursor-pointer"
          >
            <option value="Todos">Todas as Categorias</option>
            {NOTICE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notices List */}
      {isLoading ? (
        <div className="py-12 text-center text-stone-500 text-sm">
          Carregando avisos do servidor...
        </div>
      ) : loadError ? (
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
          <p className="text-sm font-semibold text-red-900">{loadError}</p>
          <button
            type="button"
            onClick={loadNotices}
            className="px-4 py-2 text-xs font-bold bg-red-700 hover:bg-red-800 text-white rounded-xl cursor-pointer"
          >
            Tentar Novamente
          </button>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="py-12 text-center bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
          <Megaphone className="w-10 h-10 text-stone-300 mx-auto" />
          <p className="text-sm font-bold text-stone-700">Nenhum comunicado encontrado</p>
          <p className="text-xs text-stone-500">
            Ajuste os filtros ou clique em "Publicar Novo Aviso" para criar um comunicado.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                notice.isHighlighted
                  ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                  : 'bg-white border-stone-200 hover:border-emerald-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-grow min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {notice.isHighlighted && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-950 font-bold border border-amber-300">
                        <Pin className="w-3 h-3" />
                        <span>Destacado no Início</span>
                      </span>
                    )}
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-semibold border ${CATEGORY_BADGES[notice.category]}`}
                    >
                      {notice.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-stone-500 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDatePtBr(notice.publishedDate)}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-stone-500">
                      <User className="w-3.5 h-3.5" />
                      <span>{notice.authorName}</span>
                    </span>
                    {notice.attachments.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                        <Paperclip className="w-3 h-3" />
                        <span>
                          {notice.attachments.length}{' '}
                          {notice.attachments.length === 1 ? 'anexo' : 'anexos'}
                        </span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-emerald-950 leading-snug">
                    {notice.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                    {notice.description}
                  </p>

                  {notice.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {notice.attachments.map((att) => (
                        <a
                          key={att.id}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium transition-colors"
                        >
                          {att.attachmentType === 'image' ? (
                            <ImageIcon className="w-3 h-3 text-emerald-700 shrink-0" />
                          ) : (
                            <FileText className="w-3 h-3 text-sky-700 shrink-0" />
                          )}
                          <span className="truncate max-w-[180px]">{att.fileName}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={togglingId === notice.id}
                    onClick={() => handleQuickHighlightToggle(notice)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer disabled:opacity-50 ${
                      notice.isHighlighted
                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
                        : 'bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-900 border-stone-200'
                    }`}
                    title={notice.isHighlighted ? 'Remover destaque' : 'Destacar no início do mural'}
                  >
                    {notice.isHighlighted ? (
                      <>
                        <PinOff className="w-3.5 h-3.5" />
                        <span>Desafixar</span>
                      </>
                    ) : (
                      <>
                        <Pin className="w-3.5 h-3.5" />
                        <span>Destacar</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditModal(notice)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNoticeToDelete(notice)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create / Edit Notice */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[92vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  Mural de Avisos Oficial
                </span>
                <h3 className="text-xl font-bold text-emerald-950 mt-0.5">
                  {editingNotice ? 'Editar Comunicado' : 'Publicar Novo Comunicado'}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formErrors.length > 0 && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs space-y-1">
                {formErrors.map((err, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-stone-700 uppercase tracking-wider">
                    Título do Comunicado *
                  </label>
                  <span className="text-[11px] text-stone-400">
                    {title.length}/{NOTICE_LIMITS.TITLE_MAX}
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={NOTICE_LIMITS.TITLE_MAX}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Reunião de Pais e Mestres — 2º Bimestre"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-semibold text-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Categoria *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 font-semibold bg-white cursor-pointer"
                  >
                    {NOTICE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Data de Publicação *
                  </label>
                  <input
                    type="date"
                    required
                    value={publishedDate}
                    onChange={(e) => setPublishedDate(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Responsável / Setor
                  </label>
                  <input
                    type="text"
                    maxLength={80}
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Direção Escolar"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-stone-700 uppercase tracking-wider">
                    Descrição Completa *
                  </label>
                  <span className="text-[11px] text-stone-400">
                    {description.length}/{NOTICE_LIMITS.DESCRIPTION_MAX}
                  </span>
                </div>
                <textarea
                  rows={5}
                  required
                  maxLength={NOTICE_LIMITS.DESCRIPTION_MAX}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Escreva todos os detalhes importantes para alunos, professores e responsáveis (horários, turmas envolvidas, orientações)..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 leading-relaxed"
                />
              </div>

              {/* Highlight Toggle */}
              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-amber-200 bg-amber-50/60 cursor-pointer hover:bg-amber-50 transition-colors">
                <input
                  type="checkbox"
                  checked={isHighlighted}
                  onChange={(e) => setIsHighlighted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-700 rounded border-stone-300 focus:ring-emerald-600 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-600" />
                    <span>Destacar comunicado importante no início do mural</span>
                  </span>
                  <span className="text-xs text-amber-900/80 block mt-0.5">
                    Avisos destacados ficam fixados no topo da página do Mural de Avisos e aparecem na vitrine da página inicial.
                  </span>
                </div>
              </label>

              {/* Attachments Uploader */}
              <div className="space-y-3 border border-stone-200 rounded-2xl p-4 bg-stone-50/70">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-stone-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Anexos (Imagens e Documentos)</span>
                    </span>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Até {NOTICE_LIMITS.MAX_ATTACHMENTS} arquivos (máx. 8 MB cada): PNG, JPG, WEBP, PDF, DOCX, XLSX, PPTX, TXT.
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                    onChange={handleFilesSelected}
                    className="hidden"
                  />

                  <button
                    type="button"
                    disabled={
                      keptAttachments.length + newAttachments.length >=
                      NOTICE_LIMITS.MAX_ATTACHMENTS
                    }
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Anexar Arquivo</span>
                  </button>
                </div>

                {(keptAttachments.length > 0 || newAttachments.length > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {keptAttachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-stone-200"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {att.attachmentType === 'image' ? (
                            <img
                              src={att.url}
                              alt={att.fileName}
                              className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-stone-800 truncate">{att.fileName}</p>
                            <p className="text-[11px] text-stone-400">
                              {formatFileSize(att.fileSize)} · Salvo
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeKeptAttachment(att.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer shrink-0"
                          title="Remover anexo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {newAttachments.map((att, index) => {
                      const isImg = att.mimeType.startsWith('image/');
                      return (
                        <div
                          key={`${att.fileName}-${index}`}
                          className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {isImg ? (
                              <img
                                src={`data:${att.mimeType};base64,${att.base64Data}`}
                                alt={att.fileName}
                                className="w-10 h-10 rounded-lg object-cover border border-emerald-200 shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-emerald-950 truncate">
                                {att.fileName}
                              </p>
                              <p className="text-[11px] text-emerald-700">
                                {formatFileSize(att.fileSize)} · Novo anexo
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeNewAttachment(index)}
                            className="p-1.5 text-stone-500 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer shrink-0"
                            title="Remover anexo"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="border-t border-stone-200 pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Salvando...'
                      : editingNotice
                      ? 'Salvar Alterações'
                      : 'Publicar no Mural'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {noticeToDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Excluir Comunicado</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Tem certeza que deseja excluir permanentemente o aviso{' '}
                  <strong className="text-stone-900">"{noticeToDelete.title}"</strong>? Esta ação
                  também removerá os anexos vinculados e não pode ser desfeita.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setNoticeToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-red-700 hover:bg-red-800 text-white rounded-xl shadow-sm cursor-pointer disabled:opacity-60"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function sortNoticesClient(items: NoticeItem[]): NoticeItem[] {
  return [...items].sort((a, b) => {
    if (a.isHighlighted !== b.isHighlighted) {
      return a.isHighlighted ? -1 : 1;
    }
    if (a.publishedDate !== b.publishedDate) {
      return b.publishedDate.localeCompare(a.publishedDate);
    }
    return b.createdAt.localeCompare(a.createdAt);
  });
}
