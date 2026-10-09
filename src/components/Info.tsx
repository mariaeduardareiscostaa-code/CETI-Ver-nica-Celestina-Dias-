import React from 'react';
import { MapPin, Clock, CalendarDays } from 'lucide-react';

export default function Info() {
  return (
    <section id="info" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-blue-900 sm:text-4xl">Informações Úteis</h2>
          <div className="mt-2 h-1 w-20 bg-yellow-400 mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Working Hours */}
          <div className="flex flex-col justify-center space-y-8 bg-blue-50 p-8 rounded-2xl">
            <h3 className="text-2xl font-semibold text-blue-900 border-b border-blue-200 pb-4">Horário de Funcionamento</h3>
            
            <div className="flex items-start space-x-4">
              <Clock className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 text-lg">Segunda a Sexta-feira</p>
                <p className="text-gray-600 mt-1">Ensino Integral: 07:00 às 17:00</p>
                <p className="text-gray-600">Atendimento da Secretaria: 08:00 às 16:00</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CalendarDays className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 text-lg">Finais de Semana e Feriados</p>
                <p className="text-gray-600 mt-1">Fechado</p>
              </div>
            </div>
          </div>

          {/* Address & Map */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-2xl font-semibold text-blue-900">Nossa Localização</h3>
            
            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 text-lg">Endereço Principal</p>
                <p className="text-gray-600 mt-1">
                  Rua da Educação, S/N - Bairro Escolar<br />
                  CEP: 00000-000<br />
                  Cidade - Estado
                </p>
              </div>
            </div>

            {/* Placeholder for Map */}
            <div className="w-full h-64 bg-gray-200 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-300 relative">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
               <div className="relative z-10 flex flex-col items-center bg-white/90 p-4 rounded-lg shadow-sm">
                 <MapPin className="w-8 h-8 text-blue-600 mb-2" />
                 <span className="text-gray-700 font-medium">Localização no Mapa</span>
                 <span className="text-sm text-gray-500">(Mapa interativo em breve)</span>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
