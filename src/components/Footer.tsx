import React from 'react';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-200/90 py-12 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <GraduationCap className="h-8 w-8 text-emerald-400" />
            <span className="font-bold text-xl text-white">CETI Verônica Celestina Dias</span>
          </div>
          <div className="text-center md:text-right text-sm">
            <p className="text-emerald-200/90 text-xs sm:text-sm">
              R. Marino Caetano, Campo Alegre do Fidalgo - PI, 64767-000 · <a href="tel:+558994107024" className="hover:text-white underline underline-offset-2">+55 89 9410-7024</a>
            </p>
            <p className="text-emerald-100 mt-1">&copy; {new Date().getFullYear()} CETI Verônica Celestina Dias.</p>
            <p className="text-emerald-400/60 mt-0.5 text-xs">Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
