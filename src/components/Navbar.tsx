import React from 'react';
import { Menu, X, GraduationCap, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  onOpenBullyingReport?: () => void;
}

export default function Navbar({ onOpenBullyingReport }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const links = [
    { name: 'Início', href: '#inicio' },
    { name: 'Sobre Nós', href: '#sobre' },
    { name: 'Informações', href: '#info' },
    { name: 'Contato', href: '#contato' },
  ];

  return (
    <nav className="bg-emerald-900 text-white sticky top-0 z-50 shadow-md border-b border-emerald-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <GraduationCap className="h-8 w-8 text-emerald-300" />
            <span className="font-bold text-xl tracking-tight hidden sm:block">CETI Verônica Celestina Dias</span>
            <span className="font-bold text-xl tracking-tight sm:hidden">CETI VCD</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:bg-emerald-800 hover:text-emerald-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Bullying Report Shortcut Button */}
          <div className="hidden sm:flex items-center shrink-0">
            <button
              onClick={onOpenBullyingReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-300 hover:bg-emerald-200 rounded-lg transition-colors whitespace-nowrap shadow-sm hover:shadow active:scale-95"
              title="Acessar Canal Seguro para Denúncia Anônima de Bullying"
            >
              <ShieldAlert className="w-4 h-4 text-emerald-900" />
              <span>Denúncia de Bullying</span>
            </button>
          </div>
          
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenBullyingReport}
              className="sm:hidden inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-300 hover:bg-emerald-200 rounded-md active:scale-95"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Denúncia Anônima</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-emerald-200 hover:text-white hover:bg-emerald-800 focus:outline-none"
              aria-label="Abrir menu principal"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-emerald-800 border-t border-emerald-700/60">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="hover:bg-emerald-700 hover:text-emerald-200 block px-3 py-2 rounded-md text-base font-medium"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2 border-t border-emerald-700/80">
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenBullyingReport) onOpenBullyingReport();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold text-emerald-950 bg-emerald-300 hover:bg-emerald-200 transition-colors"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Canal Anônimo de Combate ao Bullying</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
