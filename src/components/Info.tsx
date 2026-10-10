import React from 'react';
import { MapPin, Clock, CalendarDays } from 'lucide-react';

export default function Info() {
  return (
    <section id="info" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-emerald-950 sm:text-4xl">Informações Úteis</h2>
          <div className="mt-2 h-1 w-20 bg-emerald-500 mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Working Hours */}
          <div className="flex flex-col justify-center space-y-8 bg-emerald-50/70 border border-emerald-100 p-8 rounded-2xl">
            <h3 className="text-2xl font-semibold text-emerald-950 border-b border-emerald-200/80 pb-4">Horário de Funcionamento</h3>
            
            <div className="flex items-start space-x-4">
              <Clock className="w-6 h-6 text-emerald-700 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 text-lg">Segunda a Sexta-feira</p>
                <p className="text-gray-600 mt-1">Ensino Integral: 07:00 às 17:00</p>
                <p className="text-gray-600">Atendimento da Secretaria: 08:00 às 16:00</p>
                <p className="text-emerald-800 text-sm font-medium mt-1">
                  Atendimento Telefônico: <a href="tel:+558994107024" className="underline hover:text-emerald-950">+55 89 9410-7024</a>
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CalendarDays className="w-6 h-6 text-emerald-700 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 text-lg">Finais de Semana e Feriados</p>
                <p className="text-gray-600 mt-1">Fechado</p>
              </div>
            </div>
          </div>

          {/* Address & Map */}
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

            {/* Stylized Map View */}
            <div className="w-full h-64 bg-emerald-950/5 rounded-2xl flex items-center justify-center overflow-hidden border border-emerald-200 relative">
               <svg className="absolute inset-0 w-full h-full text-emerald-900/10" xmlns="http://www.w3.org/2000/svg">
                 <defs>
                   <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                     <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                   </pattern>
                 </defs>
                 <rect width="100%" height="100%" fill="url(#map-grid)" />
                 <path d="M-20,120 Q180,60 300,160 T600,100" fill="none" stroke="currentColor" strokeWidth="4" className="text-emerald-600/30" />
                 <path d="M80,-20 Q140,160 260,200 T440,320" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-700/20" />
               </svg>
               <div className="relative z-10 flex flex-col items-center bg-white/95 px-6 py-4 rounded-xl shadow-sm border border-emerald-100 text-center max-w-xs">
                 <div className="p-2 bg-emerald-100 text-emerald-800 rounded-full mb-2">
                   <MapPin className="w-6 h-6" />
                 </div>
                 <span className="text-emerald-950 font-semibold text-sm">CETI Verônica Celestina Dias</span>
                 <span className="text-xs text-emerald-700 mt-0.5">R. Marino Caetano · Campo Alegre do Fidalgo - PI</span>
                 <a 
                   href="https://www.google.com/maps/search/?api=1&query=R.+Marino+Caetano,+Campo+Alegre+do+Fidalgo+-+PI,+64767-000" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="mt-2 text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline underline-offset-2"
                 >
                   Abrir no Google Maps &rarr;
                 </a>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
