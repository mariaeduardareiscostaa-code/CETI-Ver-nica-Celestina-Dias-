import React, { useState, useEffect } from 'react';
import { BookOpen, BookmarkCheck, ArrowRight, Sparkles, GraduationCap, Clock, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Book, INITIAL_BOOKS } from '../data/libraryBooks';

interface LibraryBannerProps {
  onOpenLibrary: () => void;
}

export default function LibraryBanner({ onOpenLibrary }: LibraryBannerProps) {
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const stored = localStorage.getItem('vcd_library_books');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BOOKS;
  });

  const [page, setPage] = useState(0);
  const pageSize = 4;

  // Listen to changes when books are added, edited, or covers are changed
  useEffect(() => {
    const handleStorageUpdate = () => {
      try {
        const stored = localStorage.getItem('vcd_library_books');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBooks(parsed);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('focus', handleStorageUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('focus', handleStorageUpdate);
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(books.length / pageSize));
  const currentBooks = books.slice(page * pageSize, (page + 1) * pageSize);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

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

          {/* Right Featured Books Preview Grid with Real Book Covers */}
          <div className="lg:col-span-6">
            <div className="bg-emerald-950/80 p-4 sm:p-5 rounded-3xl border border-emerald-700/60 shadow-2xl space-y-4">
              
              {/* Header with Title and Pagination Controls */}
              <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3 gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 
                  <span>Livros Atuais do Acervo ({books.length})</span>
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1 bg-emerald-900/80 px-1 py-0.5 rounded-lg border border-emerald-700/60">
                      <button
                        onClick={handlePrev}
                        className="p-1 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded transition-colors cursor-pointer"
                        title="Ver livros anteriores"
                        aria-label="Página anterior"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] text-emerald-300 px-1 font-semibold">
                        {page + 1}/{totalPages}
                      </span>
                      <button
                        onClick={handleNext}
                        className="p-1 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded transition-colors cursor-pointer"
                        title="Ver próximos livros"
                        aria-label="Próxima página"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={onOpenLibrary}
                    className="text-xs text-emerald-300 hover:text-white font-semibold underline underline-offset-4 cursor-pointer hidden sm:inline"
                  >
                    Ver todos &rarr;
                  </button>
                </div>
              </div>

              {/* Grid of Actual Books with Respective Covers */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {currentBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={onOpenLibrary}
                    className="p-2.5 sm:p-3 rounded-2xl bg-emerald-900/60 hover:bg-emerald-800/90 border border-emerald-700/50 hover:border-emerald-400/70 transition-all cursor-pointer flex flex-col justify-between group shadow-lg hover:shadow-emerald-950/60"
                    title={`Clique para ver detalhes e reservar "${book.title}"`}
                  >
                    {/* Book Cover Image Container */}
                    <div className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden bg-emerald-950 mb-2.5 shadow-md border border-white/10 flex items-center justify-center">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={`Capa do livro ${book.title}`}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${book.coverGradient || 'from-emerald-700 to-emerald-950'} flex flex-col items-center justify-center p-3 text-center`}>
                          <BookOpen className="w-8 h-8 text-white/50 mb-1.5" />
                          <span className="text-[11px] font-bold text-white/90 line-clamp-2 leading-tight">{book.title}</span>
                        </div>
                      )}

                      {/* Subtle Dark Gradient Overlay for Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                      {/* Top Badge */}
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 z-10">
                        <span className="text-[9px] sm:text-[10px] font-bold text-emerald-950 bg-emerald-300 px-2 py-0.5 rounded-full shadow-sm truncate max-w-[90%]">
                          {book.badge || book.category}
                        </span>
                      </div>

                      {/* Bottom Info on Cover */}
                      <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between text-[10px]">
                        <span className="bg-black/60 backdrop-blur-xs text-white/95 px-2 py-0.5 rounded-md border border-white/20 font-medium">
                          {book.availableCopies > 0 ? `${book.availableCopies} disp.` : 'Emprestado'}
                        </span>
                        <span className="text-[10px] text-emerald-300 font-bold group-hover:translate-x-0.5 transition-transform">
                          Reservar &rarr;
                        </span>
                      </div>
                    </div>

                    {/* Book Metadata */}
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-tight group-hover:text-emerald-200 transition-colors line-clamp-2">
                        {book.title}
                      </h4>
                      <p className="text-[11px] text-emerald-300/80 truncate font-medium">
                        {book.author}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Catalog Summary */}
              <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-800/60 flex items-center justify-between gap-2 text-xs">
                <span className="text-emerald-200/90 font-medium truncate">
                  📚 {books.length} títulos cadastrados com capas reais no CETI.
                </span>
                <button
                  onClick={onOpenLibrary}
                  className="text-emerald-300 hover:text-white font-bold underline shrink-0 cursor-pointer text-xs"
                >
                  Abrir Biblioteca &rarr;
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
