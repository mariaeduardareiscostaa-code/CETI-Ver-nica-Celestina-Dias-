import React from 'react';
import { BookOpen, BookmarkCheck, ArrowRight, Sparkles, GraduationCap, Clock, CheckCircle2 } from 'lucide-react';

interface LibraryBannerProps {
  onOpenLibrary: () => void;
}

export default function LibraryBanner({ onOpenLibrary }: LibraryBannerProps) {
  const featuredBooks = [
    {
      title: 'Redação Nota 1000 - ENEM',
      author: 'Profª. Clarice Mendonça',
      category: 'ENEM & Vestibulares',
      gradient: 'from-blue-600 to-indigo-950',
      badge: 'Mais Procurado'
    },
    {
      title: 'Dom Casmurro',
      author: 'Machado de Assis',
      category: 'Literatura Brasileira',
      gradient: 'from-amber-700 to-amber-950',
      badge: 'Clássico Obrigatório'
    },
    {
      title: 'Antologia da Poesia Piauiense',
      author: 'H. Dobal & Autores do Piauí',
      category: 'Cultura do Piauí',
      gradient: 'from-emerald-700 to-emerald-950',
      badge: 'Acervo Regional'
    },
    {
      title: 'O Homem que Calculava',
      author: 'Malba Tahan',
      category: 'Matemática & Raciocínio',
      gradient: 'from-cyan-700 to-blue-950',
      badge: 'Lógica & Saber'
    }
  ];

  return (
    <section id="biblioteca" className="py-12 sm:py-16 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white relative overflow-hidden border-t border-b border-emerald-800/80">
      
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text & CTA */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/70 text-emerald-200 text-xs font-semibold">
              <BookOpen className="w-4 h-4 text-emerald-300" />
              <span>Novo Recurso Estudantil</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Biblioteca Digital Escolar do <br />
              <span className="text-emerald-300">CETI Verônica Celestina Dias</span>
            </h2>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-light">
              Explore o catálogo completo de livros físicos da biblioteca escolar, consulte a disponibilidade em tempo real e faça a reserva do seu livro preferido com sua matrícula, com retirada rápida no pavilhão pedagógico.
            </p>

            {/* Key benefits list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-emerald-200/90 pt-1">
              <div className="flex items-center gap-2 bg-emerald-950/70 p-2.5 rounded-xl border border-emerald-800/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Obras do ENEM, clássicos e autores piauienses</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-950/70 p-2.5 rounded-xl border border-emerald-800/60">
                <BookmarkCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Reserva online instantânea sem filas</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-950/70 p-2.5 rounded-xl border border-emerald-800/60">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>48h de tolerância para retirada na escola</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-950/70 p-2.5 rounded-xl border border-emerald-800/60">
                <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Empréstimo de 14 dias renováveis</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={onOpenLibrary}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-extrabold text-sm sm:text-base shadow-xl hover:shadow-emerald-400/20 transition-all cursor-pointer active:scale-95 group"
              >
                <BookOpen className="w-5 h-5 text-emerald-950" />
                <span>Acessar Catálogo & Reservar Livro</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right Featured Books Preview Grid */}
          <div className="lg:col-span-6">
            <div className="bg-emerald-950/80 p-5 rounded-3xl border border-emerald-700/60 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Destaques do Acervo Escolar
                </span>
                <button
                  onClick={onOpenLibrary}
                  className="text-xs text-emerald-300 hover:text-white font-semibold underline underline-offset-4 cursor-pointer"
                >
                  Ver todos os títulos &rarr;
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                {featuredBooks.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={onOpenLibrary}
                    className="p-3.5 rounded-2xl bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-700/50 hover:border-emerald-400/60 transition-all cursor-pointer space-y-2 group shadow-sm"
                  >
                    <div className={`h-2 rounded-full bg-gradient-to-r ${item.gradient}`} />
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full inline-block">
                      {item.badge}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-tight group-hover:text-emerald-200 transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-emerald-300/80 truncate">
                      {item.author}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-800/60 text-center">
                <p className="text-xs text-emerald-200/90 font-medium">
                  📚 Mais de 150 exemplares físicos disponíveis no acervo do CETI.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
