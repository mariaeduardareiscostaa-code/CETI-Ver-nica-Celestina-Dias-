import React from 'react';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <GraduationCap className="h-8 w-8 text-yellow-400" />
            <span className="font-bold text-xl text-white">CETI Verônica Celestina Dias</span>
          </div>
          <div className="text-center md:text-right text-sm">
            <p>&copy; {new Date().getFullYear()} CETI Verônica Celestina Dias.</p>
            <p className="text-gray-500 mt-1">Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
