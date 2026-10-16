import React from 'react';
import { ShieldAlert, MapPin, Sparkles, Users, ArrowDown } from 'lucide-react';
import fachadaImg from '../assets/images/ceti_fachada_frente_1792175517797.jpg';
import patioImg from '../assets/images/ceti_patio_convivencia_1792175517664.jpg';

interface HeroProps {
  onOpenBullyingReport?: () => void;
}

export default function Hero({ onOpenBullyingReport }: HeroProps) {
  return (
    <section id="inicio" className="relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white pt-16 pb-20 sm:pt-20 sm:pb-28 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="pattern-dots" patternUnits="userSpaceOnUse" width="36" height="36">
              <circle cx="3" cy="3" r="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern-dots)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Governo do Estado do Piauí · SEDUC</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight leading-tight sm:leading-none">
              Centro Estadual de Tempo Integral <br />
              <span className="text-emerald-300 drop-shadow-sm">Verônica Celestina Dias</span>
            </h1>

            <p className="text-base sm:text-xl text-emerald-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Compromisso com o futuro, excelência acadêmica e formação humana em tempo integral. 
              Ambiente acolhedor, seguro e inclusivo no coração de Campo Alegre do Fidalgo - PI.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs text-emerald-200/90">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 rounded-full border border-emerald-700/50">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>R. Marino Caetano, Campo Alegre do Fidalgo</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 rounded-full border border-emerald-700/50">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Educação em Tempo Integral</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href="#estrutura"
                className="inline-flex items-center justify-center gap-2 bg-emerald-400 text-emerald-950 font-bold px-7 py-3.5 rounded-2xl hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-950/30 text-sm sm:text-base active:scale-95"
              >
                <span>Conhecer Nossas Instalações</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenBullyingReport}
                className="inline-flex items-center justify-center gap-2 bg-emerald-800/80 hover:bg-emerald-800 text-white border border-emerald-400/50 font-semibold px-6 py-3.5 rounded-2xl transition-all shadow-md backdrop-blur-sm hover:border-emerald-300 text-sm sm:text-base active:scale-95 cursor-pointer"
              >
                <ShieldAlert className="w-5 h-5 text-emerald-300" />
                <span>Denúncia Anônima</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Photo Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Photo: Fachada */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-600/40 bg-emerald-950 group">
                <img
                  src={fachadaImg}
                  alt="Fachada principal do CETI Verônica Celestina Dias com identificação oficial"
                  className="w-full h-64 sm:h-72 object-cover object-center group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-200">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold">Fachada Oficial · Entrada</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-900/80 text-emerald-300 text-[11px] font-medium border border-emerald-700/50">
                    SEDUC-PI
                  </span>
                </div>
              </div>

              {/* Overlapping Floating Photo: Pátio Central */}
              <div className="relative -mt-12 ml-6 sm:ml-12 rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-400/40 bg-emerald-950 group">
                <img
                  src={patioImg}
                  alt="Pátio central com alunos estudando em grupos no CETI Verônica Celestina Dias"
                  className="w-full h-48 sm:h-56 object-cover object-center group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-200">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold">Pátio Central & Vivência dos Alunos</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-400 text-emerald-950 text-[11px] font-bold">
                    Tempo Integral
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
