import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Megaphone,
  Search,
  Calendar,
  Pin,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Download,
  ExternalLink,
  X,
  BookOpen,
  CalendarDays,
  Lock,
  RefreshCw,
  AlertCircle,
  User,
  Maximize2,
  Filter
} from 'lucide-react';
import {
  NoticeCategory,
  NoticeItem,
  NoticeAttachment,
  NOTICE_CATEGORIES
} from '../types/notices';
import { fetchNotices, formatFileSize } from '../services/noticesApi';

interface MuralDeAvisosPageProps {
  onBackToHome: () => void;
  onOpenLibrary?: () => void;
  onOpenSchoolInfo?: () => void;
  onOpenAdminNotices?: () => void;
}

const CATEGORY_STYLES: Record<NoticeCategory, { badge: string; dot: string }> = {
  Geral: {
    badge: 'bg-stone-100 text-stone-800 border-stone-200',
    dot: 'bg-stone-500',
  },
  Eventos: {
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    dot: 'bg-emerald-600',
  },
  Reuniões: {
    badge: 'bg-amber-100 text-amber-900 border-amber-200',
    dot: 'bg-amber-600',
  },
  Avaliações: {
    badge: 'bg-rose-100 text-rose-900 border-rose-200',
    dot: 'bg-rose-600',
  },
  Comunicados: {
    badge: 'bg-sky-100 text-sky-900 border-sky-200',
    dot: 'bg-sky-600',
  },
};

function formatNoticeDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    const months = [
      'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
      'jul', 'ago', 'set', 'out', 'nov', 'dez'
    ];
    const mIdx = Number(month) - 1;
    const monthLabel = months[mIdx] || month;
    return `${day} de ${monthLabel}. de ${year}`;
  }
  return dateStr;
}

export default function MuralDeAvisosPage({
  onBackToHome,
  onOpenLibrary,
  onOpenSchoolInfo,
  onOpenAdminNotices,
}: MuralDeAvisosPageProps) {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | NoticeCategory>('Todos');
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [lightboxImage, setLightboxImage] = useState<NoticeAttachment | null>(null);

  const loadAllNotices = async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const data = await fetchNotices();
      setNotices(data);
    } catch (err) {
      setLoadError(
        err instanceof Error
          ? err.message
          : 'Não foi possível carregar os avisos do servidor.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllNotices();
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: notices.length };
    for (const cat of NOTICE_CATEGORIES) {
      counts[cat] = 0;
    }
    for (const n of notices) {
      counts[n.category] = (counts[n.category] || 0) + 1;
    }
    return counts;
  }, [notices]);

  const filteredNotices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return notices.filter((notice) => {
      const matchCat = selectedCategory === 'Todos' || notice.category === selectedCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        notice.title.toLowerCase().includes(q) ||
        notice.description.toLowerCase().includes(q) ||
        notice.category.toLowerCase().includes(q) ||
        notice.authorName.toLowerCase().includes(q) ||
        notice.attachments.some((a) => a.fileName.toLowerCase().includes(q))
      );
    });
  }, [notices, searchQuery, selectedCategory]);

  const highlightedNotices = useMemo(
    () => filteredNotices.filter((n) => n.isHighlighted),
    [filteredNotices]
  );

  const regularNotices = useMemo(
    () => filteredNotices.filter((n) => !n.isHighlighted),
    [filteredNotices]
  );

  const renderNoticeCard = (notice: NoticeItem) => {
    const catStyle = CATEGORY_STYLES[notice.category] || CATEGORY_STYLES.Geral;
    const images = notice.attachments.filter((a) => a.attachmentType === 'image');
    const docs = notice.attachments.filter((a) => a.attachmentType === 'document');

    return (
      <article
        key={notice.id}
        className={`bg-white rounded-3xl border transition-all flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
          notice.isHighlighted
            ? 'border-emerald-400 ring-2 ring-emerald-500/15'
            : 'border-stone-200 hover:border-emerald-300'
        }`}
      >
        <div>
          {/* Highlight banner strip */}
          {notice.isHighlighted && (
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white px-5 py-2 flex items-center justify-between text-xs font-bold">
              <span className="inline-flex items-center gap-1.5">
                <Pin className="w-3.5 h-3.5 text-amber-300" />
                <span>COMUNICADO EM DESTAQUE</span>
              </span>
              <span className="text-[11px] font-medium text-emerald-100">Prioritário</span>
            </div>
          )}

          {/* Card Content */}
          <div className="p-5 sm:p-6 space-y-4">
            {/* Top metadata row: Category + Date */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${catStyle.badge}`}
              >
                <span className={`w-2 h-2 rounded-full ${catStyle.dot}`} />
                <span>{notice.category}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <time dateTime={notice.publishedDate}>{formatNoticeDate(notice.publishedDate)}</time>
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-emerald-950 leading-snug">
                {notice.title}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line line-clamp-4">
                {notice.description}
              </p>
            </div>

            {/* Image Attachments Preview */}
            {images.length > 0 && (
              <div className={`grid gap-2 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {images.slice(0, 2).map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setLightboxImage(img)}
                    className="group relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 aspect-video cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    title={`Ampliar imagem: ${img.fileName}`}
                  >
                    <img
                      src={img.url}
                      alt={img.fileName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-950/85 text-white text-xs font-semibold px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Ampliar</span>
                      </span>
                    </div>
                  </button>
                ))}
                {images.length > 2 && (
                  <p className="col-span-2 text-xs text-emerald-800 font-semibold">
                    + {images.length - 2} outra(s) imagem(ns) anexada(s) — abra o aviso para ver todas.
                  </p>
                )}
              </div>
            )}

            {/* Document Attachments */}
            {docs.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                  <Paperclip className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Documentos Anexados ({docs.length})</span>
                </div>
                <div className="space-y-1.5">
                  {docs.map((docItem) => (
                    <div
                      key={docItem.id}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-stone-800 truncate">{docItem.fileName}</p>
                          <p className="text-[10px] text-stone-500">{formatFileSize(docItem.fileSize)}</p>
                        </div>
                      </div>
                      <a
                        href={docItem.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold transition-colors shrink-0"
                        title={`Baixar ${docItem.fileName}`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer inside card */}
        <div className="px-5 sm:px-6 py-3.5 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 text-stone-600 font-medium truncate">
            <User className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="truncate">{notice.authorName}</span>
          </span>

          <button
            type="button"
            onClick={() => setSelectedNotice(notice)}
            className="text-emerald-800 hover:text-emerald-950 font-bold underline underline-offset-4 cursor-pointer shrink-0"
          >
            Ver completo &rarr;
          </button>
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Top Institutional Header */}
      <header className="bg-emerald-950 text-white border-b border-emerald-900 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={onBackToHome}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-emerald-100 hover:text-white text-xs sm:text-sm font-medium transition-colors border border-emerald-700/70 cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Voltar ao Portal</span>
              </button>

              <div className="flex items-center gap-2.5 border-l border-emerald-800/80 pl-3 min-w-0">
                <img
                  src="/assets/aistudio/color_transparente_f0e67a56.png"
                  alt="Logo CETI Verônica Celestina Dias"
                  className="h-9 w-9 sm:h-11 sm:w-11 object-contain drop-shadow-sm brightness-110 shrink-0"
                />
                <div className="leading-tight min-w-0">
                  <h1 className="font-bold text-sm sm:text-base tracking-tight text-white truncate">
                    Mural de Avisos · CETI Verônica Celestina Dias
                  </h1>
                  <p className="text-[10px] sm:text-xs text-emerald-300 font-medium hidden sm:block truncate">
                    Comunicados Oficiais, Eventos, Reuniões e Avaliações
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onOpenSchoolInfo && (
                <button
                  onClick={onOpenSchoolInfo}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:text-white bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/70 rounded-lg transition-colors cursor-pointer"
                >
                  <CalendarDays className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Horários</span>
                </button>
              )}

              {onOpenLibrary && (
                <button
                  onClick={onOpenLibrary}
                  className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:text-white bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/70 rounded-lg transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Biblioteca</span>
                </button>
              )}

              {onOpenAdminNotices && (
                <button
                  onClick={onOpenAdminNotices}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-950 bg-emerald-300 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer shadow-xs active:scale-95"
                  title="Área restrita para administração publicar ou editar avisos"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-950" />
                  <span className="hidden sm:inline">Área da Gestão</span>
                  <span className="sm:hidden">Gestão</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-900 via-emerald-850 to-emerald-950 text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-emerald-800 shadow-inner relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/70 text-emerald-200 text-xs font-semibold">
              <Megaphone className="w-3.5 h-3.5 text-emerald-300" />
              <span>Comunicação Institucional · Acesso Público</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight flex items-center gap-3">
              <span>Mural de Avisos</span>
            </h2>

            <p className="text-emerald-100/95 text-sm sm:text-lg leading-relaxed max-w-2xl">
              Fique por dentro dos comunicados, eventos e informações importantes do CETI.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="bg-emerald-950/70 border border-emerald-700/60 rounded-2xl px-4 py-3 text-center">
              <div className="text-2xl font-black text-emerald-300">{notices.length}</div>
              <div className="text-[11px] text-emerald-200 font-medium">Avisos Ativos</div>
            </div>
            <div className="bg-emerald-950/70 border border-emerald-700/60 rounded-2xl px-4 py-3 text-center">
              <div className="text-2xl font-black text-amber-300">
                {notices.filter((n) => n.isHighlighted).length}
              </div>
              <div className="text-[11px] text-emerald-200 font-medium">Em Destaque</div>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-emerald-950/70 border border-emerald-700/60 rounded-2xl px-4 py-3 text-center">
              <div className="text-2xl font-black text-white">{NOTICE_CATEGORIES.length}</div>
              <div className="text-[11px] text-emerald-200 font-medium">Categorias</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Search & Category Filter Bar */}
        <section className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar avisos por título, descrição, categoria ou anexo..."
                aria-label="Pesquisar avisos"
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                  title="Limpar pesquisa"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={loadAllNotices}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0 disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Atualizar Mural</span>
            </button>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Categorias:</span>
            </span>

            {(['Todos', ...NOTICE_CATEGORIES] as const).map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                    active
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      active ? 'bg-emerald-700 text-emerald-100' : 'bg-white text-stone-600'
                    }`}
                  >
                    {categoryCounts[cat] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Loading / Error / Content */}
        {isLoading ? (
          <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-emerald-700 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-stone-600">Carregando comunicados do CETI...</p>
          </div>
        ) : loadError ? (
          <div className="bg-red-50 rounded-3xl p-8 border border-red-200 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
            <h3 className="font-bold text-red-900">Erro ao carregar o Mural de Avisos</h3>
            <p className="text-sm text-red-700">{loadError}</p>
            <button
              type="button"
              onClick={loadAllNotices}
              className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold cursor-pointer"
            >
              Tentar Novamente
            </button>
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center space-y-3">
            <Megaphone className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-lg font-bold text-stone-800">Nenhum aviso encontrado</h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto">
              Não há comunicados correspondentes ao filtro ou termo pesquisado no momento.
            </p>
            {(searchQuery || selectedCategory !== 'Todos') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Todos');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer"
              >
                Mostrar Todos os Avisos
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-10">
            {/* Highlighted / Pinned Notices */}
            {highlightedNotices.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900">
                    <Pin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-emerald-950">
                      Comunicados Importantes em Destaque
                    </h3>
                    <p className="text-xs text-stone-500">
                      Avisos prioritários fixados pela direção e coordenação escolar
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {highlightedNotices.map(renderNoticeCard)}
                </div>
              </section>
            )}

            {/* Regular Notices */}
            {regularNotices.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-stone-200/80 text-stone-800">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-stone-900">
                      Comunicados Recentes
                    </h3>
                    <p className="text-xs text-stone-500">
                      Ordenados dos mais recentes para os mais antigos
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularNotices.map(renderNoticeCard)}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Notice Full Detail Modal */}
      {selectedNotice && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedNotice(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-emerald-950 text-white px-6 py-4 flex items-center justify-between gap-4 z-10">
              <div className="flex items-center gap-2 min-w-0">
                <Megaphone className="w-5 h-5 text-emerald-300 shrink-0" />
                <span className="font-bold text-sm truncate">Detalhes do Comunicado</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="p-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-100 cursor-pointer"
                aria-label="Fechar detalhes"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      (CATEGORY_STYLES[selectedNotice.category] || CATEGORY_STYLES.Geral).badge
                    }`}
                  >
                    {selectedNotice.category}
                  </span>
                  {selectedNotice.isHighlighted && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                      <Pin className="w-3 h-3" />
                      <span>Destaque</span>
                    </span>
                  )}
                </div>

                <span className="inline-flex items-center gap-1.5 text-xs text-stone-500 font-semibold">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>{formatNoticeDate(selectedNotice.publishedDate)}</span>
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-black text-emerald-950 leading-tight">
                  {selectedNotice.title}
                </h3>
                <p className="text-xs text-stone-500 font-medium flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Publicado por: {selectedNotice.authorName}</span>
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                {selectedNotice.description}
              </div>

              {selectedNotice.attachments.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-emerald-700" />
                    <span>Anexos do Comunicado ({selectedNotice.attachments.length})</span>
                  </h4>

                  {/* Image attachments */}
                  {selectedNotice.attachments.some((a) => a.attachmentType === 'image') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedNotice.attachments
                        .filter((a) => a.attachmentType === 'image')
                        .map((img) => (
                          <div
                            key={img.id}
                            className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-100"
                          >
                            <button
                              type="button"
                              onClick={() => setLightboxImage(img)}
                              className="w-full block cursor-pointer group relative"
                            >
                              <img
                                src={img.url}
                                alt={img.fileName}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                              />
                            </button>
                            <div className="p-2.5 bg-white flex items-center justify-between gap-2 text-xs">
                              <span className="truncate font-medium text-stone-700 flex items-center gap-1">
                                <ImageIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                <span className="truncate">{img.fileName}</span>
                              </span>
                              <a
                                href={img.downloadUrl}
                                className="text-emerald-800 hover:text-emerald-950 font-bold shrink-0 inline-flex items-center gap-1"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Baixar</span>
                              </a>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Document attachments */}
                  {selectedNotice.attachments.some((a) => a.attachmentType === 'document') && (
                    <div className="space-y-2">
                      {selectedNotice.attachments
                        .filter((a) => a.attachmentType === 'document')
                        .map((docItem) => (
                          <div
                            key={docItem.id}
                            className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-stone-800 truncate">{docItem.fileName}</p>
                                <p className="text-[11px] text-stone-500">{formatFileSize(docItem.fileSize)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={docItem.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 font-semibold"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Abrir</span>
                              </a>
                              <a
                                href={docItem.downloadUrl}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Baixar</span>
                              </a>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="max-w-4xl w-full space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between text-white text-sm">
              <span className="font-semibold truncate pr-4">{lightboxImage.fileName}</span>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={lightboxImage.downloadUrl}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Imagem</span>
                </a>
                <button
                  type="button"
                  onClick={() => setLightboxImage(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  aria-label="Fechar imagem"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="bg-stone-950 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.fileName}
                className="max-h-[80vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Institutional Footer */}
      <footer className="bg-emerald-950 text-emerald-200/90 py-10 border-t border-emerald-900 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div className="flex items-center space-x-2.5">
              <img
                src="/assets/aistudio/branco_transparente_0a853876.png"
                alt="Logo CETI Verônica Celestina Dias"
                className="h-8 w-8 object-contain drop-shadow-sm brightness-110"
              />
              <span className="font-bold text-lg text-white">CETI Verônica Celestina Dias</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-emerald-300">
              <button onClick={onBackToHome} className="hover:text-white underline cursor-pointer">
                Página Inicial
              </button>
              {onOpenSchoolInfo && (
                <button onClick={onOpenSchoolInfo} className="hover:text-white underline cursor-pointer">
                  Horários
                </button>
              )}
              {onOpenLibrary && (
                <button onClick={onOpenLibrary} className="hover:text-white underline cursor-pointer">
                  Biblioteca Digital
                </button>
              )}
              {onOpenAdminNotices && (
                <button onClick={onOpenAdminNotices} className="hover:text-white underline cursor-pointer">
                  Área da Gestão
                </button>
              )}
            </div>

            <div className="text-center md:text-right space-y-1">
              <p className="text-xs text-emerald-300 font-semibold">
                Site escolar desenvolvido por alunos da 3ª série desenvolvimento de sistemas
              </p>
              <p className="text-xs text-emerald-400/80">
                R. Marino Caetano · Campo Alegre do Fidalgo - PI
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
