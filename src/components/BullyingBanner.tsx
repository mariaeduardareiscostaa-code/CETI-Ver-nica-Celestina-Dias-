import React from 'react';
import { ShieldAlert, UserCheck, HeartHandshake, ArrowRight, Lock } from 'lucide-react';

interface BullyingBannerProps {
  onOpenBullyingReport: () => void;
}

export default function BullyingBanner({ onOpenBullyingReport }: BullyingBannerProps) {
  return (
    <section className="py-12 bg-emerald-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 border border-emerald-700/80 rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-emerald-300 text-xs font-semibold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Identificação da Vítima & Acolhimento pela Gestão</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Canal de Proteção e Denúncia com Identificação da Vítima
            </h2>

            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              O CETI Verônica Celestina Dias não tolera discriminação ou bullying. Para que a direção e coordenação possam intervir diretamente, acolher a vítima e notificar as famílias com responsabilidade, 
              <span className="text-emerald-300 font-semibold"> o canal agora identifica a vítima com total sigilo institucional</span>.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-emerald-200">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Vítima identificada para apoio</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Sigilo restrito à direção</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                <span>Acolhimento humanizado imediato</span>
              </span>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <button
              onClick={onOpenBullyingReport}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-base transition-all shadow-md hover:shadow-emerald-400/20 active:scale-95 cursor-pointer"
            >
              <ShieldAlert className="w-5 h-5 text-emerald-950" />
              <span>Registrar Denúncia da Vítima</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
