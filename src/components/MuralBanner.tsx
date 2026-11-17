import React, { useEffect, useState } from 'react';
import { Megaphone, ArrowRight, Pin, Calendar, Paperclip } from 'lucide-react';
import { NoticeItem } from '../types/notices';
import { fetchNotices } from '../services/noticesApi';

interface MuralBannerProps {
  onOpenNotices: () => void;
}

function formatShortDate(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export default function MuralBanner({ onOpenNotices }: MuralBannerProps) {
  const [recentNotices, setRecentNotices] = useState<NoticeItem[]>([]);

  useEffect(() => {
    let active = true;
    fetchNotices()
      .then((list) => {
        if (active) setRecentNotices(list.slice(0, 3));
      })
      .catch(() => {
        // Silent fallback on home banner if server is temporarily unavailable
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-12 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="p-3.5 bg-emerald-900 text-emerald-300 rounded-2xl shrink-0 shadow-sm">
              <Megaphone className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-1">
                <span>Comunicados Oficiais</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
                Mural de Avisos
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-0.5 max-w-2xl">
                Fique por dentro dos comunicados, eventos e informações importantes do CETI.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenNotices}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-sm text-sm active:scale-95 cursor-pointer shrink-0"
          >
            <Megaphone className="w-4 h-4 text-emerald-300" />
            <span>Abrir Mural de Avisos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {recentNotices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentNotices.map((notice) => (
              <div
                key={notice.id}
                onClick={onOpenNotices}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  notice.isHighlighted
                    ? 'bg-emerald-50/70 border-emerald-300 hover:border-emerald-500'
                    : 'bg-stone-50 border-stone-200 hover:border-emerald-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-bold px-2.5 py-0.5 rounded-full bg-white border border-stone-200 text-emerald-900">
                      {notice.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-stone-500 font-medium">
                      <Calendar className="w-3 h-3 text-emerald-700" />
                      {formatShortDate(notice.publishedDate)}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-emerald-950 leading-snug line-clamp-2">
                    {notice.isHighlighted && (
                      <Pin className="w-3.5 h-3.5 text-emerald-700 inline mr-1 -mt-0.5" />
                    )}
                    {notice.title}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {notice.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-stone-200/70">
                  <span className="text-stone-500 truncate">{notice.authorName}</span>
                  {notice.attachments.length > 0 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold shrink-0">
                      <Paperclip className="w-3 h-3" />
                      {notice.attachments.length} anexo(s)
                    </span>
                  ) : (
                    <span className="text-emerald-800 font-bold shrink-0">Ler mais &rarr;</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
