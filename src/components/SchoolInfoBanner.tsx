import React from 'react';
import { CalendarDays, Clock, Users, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

interface SchoolInfoBannerProps {
  onOpenSchoolInfo: () => void;
}

export default function SchoolInfoBanner({ onOpenSchoolInfo }: SchoolInfoBannerProps) {
  return (
    <section className="bg-gradient-to-r from-emerald-900 via-emerald-850 to-teal-950 text-white py-10 px-4 sm:px-6 lg:px-8 border-y border-emerald-700/50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Side: Icon & Copy */}
        <div className="flex items-start sm:items-center gap-4 text-left">
          <div className="p-3.5 bg-emerald-400 text-emerald-950 rounded-2xl shrink-0 shadow-sm">
            <CalendarDays className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800 border border-emerald-600/70 text-emerald-200 text-xs font-semibold mb-1">
              <Sparkles className="w-3 h-3 text-emerald-300" />
              <span>Portal Exclusivo · Ano Letivo 2026</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Grade de Horários & Informações da Escola
            </h3>
            <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Consulte a grade completa de aulas da 1ª, 2ª e 3ª Série, horários da rotina de tempo integral (07h às 17h), cardápio das 4 refeições, calendário escolar e normas de convivência.
            </p>
          </div>
        </div>

        {/* Right Side: Action Button */}
        <div className="shrink-0 w-full sm:w-auto">
          <button
            onClick={onOpenSchoolInfo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-300 hover:bg-emerald-200 text-emerald-950 font-extrabold px-6 py-3.5 rounded-xl transition-all shadow-md text-sm active:scale-95 cursor-pointer"
            title="Acessar página exclusiva com a grade de horários e dados escolares"
          >
            <Clock className="w-4 h-4 text-emerald-950" />
            <span>Acessar Grade & Informações</span>
            <ArrowRight className="w-4 h-4 text-emerald-950" />
          </button>
        </div>

      </div>
    </section>
  );
}
