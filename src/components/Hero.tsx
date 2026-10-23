import React, { useState } from 'react';
import { ShieldAlert, MapPin, Users, ArrowDown, Image as ImageIcon, Award, BookOpen, CalendarDays } from 'lucide-react';
import fachadaImg from '../assets/images/cetifrente2.jpeg';
import patioImg from '../assets/images/cetipatio.jpeg';
import escadaImg from '../assets/images/cetiescada (1).jpeg';

interface HeroProps {
  onOpenBullyingReport?: () => void;
  onOpenLibrary?: () => void;
  onOpenSchoolInfo?: () => void;
}

export default function Hero({ onOpenBullyingReport, onOpenLibrary, onOpenSchoolInfo }: HeroProps) {
  const [activePhoto, setActivePhoto] = useState<'fachada' | 'escada' | 'patio'>('fachada');

  return (
    <section id="inicio" className="relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-emerald-200 text-xs font-semibold">
              <img 
                src="/assets/aistudio/Bras_o_do_Piau__em_Branco_00ffc3d3.png" 
                alt="Brasão do Estado do Piauí" 
                className="w-4 h-4 object-contain brightness-110 shrink-0" 
              />
              <span>Governo do Estado do Piauí · SEDUC</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Centro Estadual de Tempo Integral <br />
              <span className="text-emerald-300">Verônica Celestina Dias</span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Educação pública de excelência, desenvolvimento integral e acolhimento humano para os jovens de Campo Alegre do Fidalgo - PI.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs text-emerald-200/90">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/70 rounded-lg border border-emerald-700/50">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>R. Marino Caetano, Campo Alegre do Fidalgo - PI</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/70 rounded-lg border border-emerald-700/50">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ensino Médio em Tempo Integral</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3">
              <button
                onClick={onOpenSchoolInfo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-300 hover:bg-emerald-200 text-emerald-950 font-bold px-5 py-3 rounded-xl transition-all shadow-md text-sm sm:text-base active:scale-95 cursor-pointer ring-2 ring-emerald-300/40"
                title="Consultar grade de horários, rotina integral e informações da escola"
              >
                <CalendarDays className="w-5 h-5 text-emerald-950 shrink-0" />
                <span>Grade de Horários & Info</span>
              </button>

              <button
                onClick={onOpenLibrary}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-800/90 hover:bg-emerald-800 text-white border border-emerald-400/50 font-bold px-5 py-3 rounded-xl transition-all shadow-md text-sm sm:text-base active:scale-95 cursor-pointer"
                title="Acessar o acervo de livros e reservar exemplar online"
              >
                <BookOpen className="w-5 h-5 text-emerald-300 shrink-0" />
                <span>Biblioteca Digital</span>
              </button>

              <button
                onClick={onOpenBullyingReport}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-900/90 hover:bg-emerald-800 text-white border border-emerald-500/40 font-semibold px-4 py-3 rounded-xl transition-all shadow-sm text-sm sm:text-base active:scale-95 cursor-pointer"
              >
                <ShieldAlert className="w-5 h-5 text-emerald-300 shrink-0" />
                <span>Canal Bullying</span>
              </button>
            </div>
          </div>

          {/* Right Column: 100% Real, Uncropped, Unaltered Photos */}
          <div className="lg:col-span-6 w-full">
            <div className="bg-white/10 backdrop-blur-xs p-3 sm:p-4 rounded-3xl border border-emerald-500/30 shadow-2xl">
              
              {/* Photo Selector Tabs */}
              <div className="flex items-center justify-between gap-1 sm:gap-1.5 mb-3 bg-emerald-950/80 p-1.5 rounded-2xl border border-emerald-800/60 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActivePhoto('fachada')}
                  className={`flex-1 min-w-[90px] py-2 px-2 sm:px-2.5 rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 ${
                    activePhoto === 'fachada'
                      ? 'bg-emerald-400 text-emerald-950 shadow-sm'
                      : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Fachada</span>
                </button>

                <button
                  onClick={() => setActivePhoto('escada')}
                  className={`flex-1 min-w-[90px] py-2 px-2 sm:px-2.5 rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 ${
                    activePhoto === 'escada'
                      ? 'bg-emerald-400 text-emerald-950 shadow-sm'
                      : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Escadaria</span>
                </button>

                <button
                  onClick={() => setActivePhoto('patio')}
                  className={`flex-1 min-w-[90px] py-2 px-2 sm:px-2.5 rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 ${
                    activePhoto === 'patio'
                      ? 'bg-emerald-400 text-emerald-950 shadow-sm'
                      : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Pátio</span>
                </button>
              </div>

              {/* Photo Display: Full, Uncropped, No Overlays, Real Image */}
              <div className="bg-emerald-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                {activePhoto === 'fachada' && (
                  <img
                    src={fachadaImg}
                    alt="Foto real da fachada do CETI Verônica Celestina Dias com entrada, rampa de acessibilidade e placas oficiais"
                    className="w-full h-auto block rounded-2xl"
                  />
                )}
                {activePhoto === 'escada' && (
                  <img
                    src={escadaImg}
                    alt="Escadaria com valores para o sucesso no CETI Verônica Celestina Dias"
                    className="w-full h-auto block rounded-2xl"
                  />
                )}
                {activePhoto === 'patio' && (
                  <img
                    src={patioImg}
                    alt="Foto real do pátio interno coberto e arborizado do CETI Verônica Celestina Dias com estudantes em aula e convivência"
                    className="w-full h-auto block rounded-2xl"
                  />
                )}
              </div>

              {/* Caption Under the Photo (Not on top) */}
              <div className="mt-3 px-2 flex items-center justify-between text-xs text-emerald-200">
                <div className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-medium">
                    {activePhoto === 'fachada' && 'Entrada oficial e rampa acessível na R. Marino Caetano (cetifrente2)'}
                    {activePhoto === 'escada' && 'Escadaria motivacional: Caráter, Persistência, Sonhar, Força, Alegria'}
                    {activePhoto === 'patio' && 'Pátio central com área de convivência, estudo e árvores'}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-300 font-semibold bg-emerald-900/80 px-2 py-0.5 rounded-md border border-emerald-700/60 shrink-0">
                  Foto Original
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
