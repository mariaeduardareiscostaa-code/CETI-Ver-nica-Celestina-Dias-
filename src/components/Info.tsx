import React from 'react';
import { MapPin, Clock, CalendarDays, ExternalLink, Image as ImageIcon } from 'lucide-react';
import fachadaImg from '../assets/images/ceti_fachada_frente_1792175517797.jpg';

export default function Info() {
  return (
    <section id="info" className="py-20 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-emerald-950 sm:text-4xl">Informações Úteis & Localização</h2>
          <div className="mt-2 h-1 w-20 bg-emerald-500 mx-auto rounded"></div>
          <p className="mt-4 text-stone-600 max-w-xl mx-auto text-sm sm:text-base">
            Horários de atendimento ao público e ponto de localização oficial da nossa unidade escolar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Working Hours */}
          <div className="flex flex-col justify-center space-y-8 bg-emerald-50/70 border border-emerald-100 p-8 rounded-3xl shadow-xs">
            <h3 className="text-2xl font-semibold text-emerald-950 border-b border-emerald-200/80 pb-4">
              Horário de Funcionamento
            </h3>
            
            <div className="flex items-start space-x-4">
              <Clock className="w-6 h-6 text-emerald-700 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 text-lg">Segunda a Sexta-feira</p>
                <p className="text-gray-600 mt-1">Ensino em Tempo Integral: 07:00 às 17:00</p>
                <p className="text-gray-600">Atendimento da Secretaria: 08:00 às 16:00</p>
                <p className="text-emerald-800 text-sm font-medium mt-1">
                  Atendimento Telefônico: <a href="tel:+558994107024" className="underline hover:text-emerald-950 font-semibold">+55 89 9410-7024</a>
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CalendarDays className="w-6 h-6 text-emerald-700 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 text-lg">Finais de Semana e Feriados</p>
                <p className="text-gray-600 mt-1">Atividades regulares fechadas</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-100/60 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <p className="font-bold">Acolhimento aos Responsáveis</p>
              <p>Reuniões de pais e atendimentos individualizados da coordenação pedagógica acontecem mediante agendamento prévio na secretaria.</p>
            </div>
          </div>

          {/* Address, Photo Reference & Map */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-2xl font-semibold text-emerald-950">Nossa Localização</h3>
            
            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-emerald-700 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 text-lg">Endereço Principal</p>
                <p className="text-gray-600 mt-1 leading-relaxed">
                  R. Marino Caetano<br />
                  Campo Alegre do Fidalgo - PI<br />
                  CEP: 64767-000
                </p>
              </div>
            </div>

            {/* Real photo reference for arriving at the school */}
            <div className="rounded-2xl overflow-hidden border border-emerald-200 shadow-sm bg-stone-50">
              <div className="relative h-44 sm:h-52 overflow-hidden">
                <img
                  src={fachadaImg}
                  alt="Foto da fachada para identificação no local"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <ImageIcon className="w-3 h-3 text-emerald-300" />
                  <span>Foto Real da Entrada</span>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between text-xs bg-emerald-50/50">
                <span className="text-stone-600 font-medium">Reconheça a entrada pelo pórtico oficial e rampa acessível</span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=R.+Marino+Caetano,+Campo+Alegre+do+Fidalgo+-+PI,+64767-000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-950 underline shrink-0 ml-2"
                >
                  <span>Abrir no Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Stylized Map View */}
            <div className="w-full h-40 bg-emerald-950/5 rounded-2xl flex items-center justify-center overflow-hidden border border-emerald-200 relative">
               <svg className="absolute inset-0 w-full h-full text-emerald-900/10" xmlns="http://www.w3.org/2000/svg">
                 <defs>
                   <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                     <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                   </pattern>
                 </defs>
                 <rect width="100%" height="100%" fill="url(#map-grid)" />
                 <path d="M-20,80 Q180,30 300,100 T600,60" fill="none" stroke="currentColor" strokeWidth="4" className="text-emerald-600/30" />
                 <path d="M80,-20 Q140,100 260,130 T440,200" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-700/20" />
               </svg>
               <div className="relative z-10 flex flex-col items-center bg-white/95 px-5 py-3 rounded-xl shadow-xs border border-emerald-100 text-center max-w-xs">
                 <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-full mb-1">
                   <MapPin className="w-5 h-5" />
                 </div>
                 <span className="text-emerald-950 font-semibold text-xs sm:text-sm">CETI Verônica Celestina Dias</span>
                 <span className="text-[11px] text-emerald-700 mt-0.5">R. Marino Caetano · Campo Alegre do Fidalgo - PI</span>
                 <a 
                   href="https://www.google.com/maps/search/?api=1&query=R.+Marino+Caetano,+Campo+Alegre+do+Fidalgo+-+PI,+64767-000" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="mt-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 inline-flex items-center gap-1"
                 >
                   <span>Navegar via Google Maps</span>
                   <ExternalLink className="w-3 h-3" />
                 </a>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
