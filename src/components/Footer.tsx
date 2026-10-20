import React from 'react';

interface FooterProps {
  onOpenBullyingReport?: () => void;
  onOpenAdminLogin?: () => void;
  onOpenLibrary?: () => void;
}

export default function Footer({ onOpenBullyingReport, onOpenAdminLogin, onOpenLibrary }: FooterProps) {
  return (
    <footer className="bg-emerald-950 text-emerald-200/90 py-12 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2.5 mb-4 md:mb-0">
            <img 
              src="/assets/aistudio/branco_transparente_0a853876.png" 
              alt="Logo CETI Verônica Celestina Dias" 
              className="h-9 w-9 sm:h-10 sm:w-10 object-contain drop-shadow-sm brightness-110" 
            />
            <span className="font-bold text-xl text-white">CETI Verônica Celestina Dias</span>
          </div>
          <div className="text-center md:text-right text-sm">
            <p className="text-emerald-200/90 text-xs sm:text-sm">
              R. Marino Caetano, Campo Alegre do Fidalgo - PI, 64767-000 · <a href="tel:+558994107024" className="hover:text-white underline underline-offset-2">+55 89 9410-7024</a>
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-xs mt-1 text-emerald-300">
              {onOpenLibrary && (
                <button onClick={onOpenLibrary} className="hover:text-white underline underline-offset-2 cursor-pointer text-emerald-300 font-semibold">
                  Biblioteca Digital Escolar
                </button>
              )}
              {onOpenBullyingReport && (
                <>
                  <span>·</span>
                  <button onClick={onOpenBullyingReport} className="hover:text-white underline underline-offset-2 cursor-pointer">
                    Canal de Bullying
                  </button>
                </>
              )}
              {onOpenAdminLogin && (
                <>
                  <span>·</span>
                  <button onClick={onOpenAdminLogin} className="hover:text-white underline underline-offset-2 cursor-pointer text-emerald-200">
                    Área Administrativa
                  </button>
                </>
              )}
            </div>
            <p className="text-emerald-100 mt-1">&copy; {new Date().getFullYear()} CETI Verônica Celestina Dias.</p>
            <p className="text-emerald-400/60 mt-0.5 text-xs">Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
