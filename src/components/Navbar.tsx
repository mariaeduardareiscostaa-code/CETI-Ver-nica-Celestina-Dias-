import React from 'react';
import { Menu, X, ShieldAlert, Lock, BookOpen } from 'lucide-react';

interface NavbarProps {
  onOpenBullyingReport?: () => void;
  onOpenAdminLogin?: () => void;
  onOpenLibrary?: () => void;
}

export default function Navbar({ onOpenBullyingReport, onOpenAdminLogin, onOpenLibrary }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const links = [
    { name: 'Início', href: '#inicio' },
    { name: 'Sobre Nós', href: '#sobre' },
    { name: 'Estrutura & Fotos', href: '#estrutura' },
    { name: 'Biblioteca Digital', href: '#biblioteca' },
    { name: 'Informações', href: '#info' },
    { name: 'Contato', href: '#contato' },
  ];

  return (
    <nav className="bg-emerald-900 text-white sticky top-0 z-50 shadow-md border-b border-emerald-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          <div className="flex items-center gap-2.5 shrink-0">
            <img 
              src="/assets/aistudio/branco_transparente_0a853876.png" 
              alt="Logo CETI Verônica Celestina Dias" 
              className="h-9 w-9 sm:h-10 sm:w-10 object-contain shrink-0 drop-shadow-sm" 
            />
            <span className="font-bold text-xl tracking-tight hidden sm:block">CETI Verônica Celestina Dias</span>
            <span className="font-bold text-xl tracking-tight sm:hidden">CETI VCD</span>
          </div>
          
          <div className="hidden lg:flex items-center space-x-3">
            {links.map((link) => {
              if (link.name === 'Biblioteca Digital' && onOpenLibrary) {
                return (
                  <button
                    key={link.name}
                    onClick={onOpenLibrary}
                    className="hover:bg-emerald-800 hover:text-emerald-200 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{link.name}</span>
                  </button>
                );
              }
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="hover:bg-emerald-800 hover:text-emerald-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Action Buttons: Biblioteca Shortcut + Bullying Report + Admin Login */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenLibrary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all whitespace-nowrap shadow-sm hover:shadow active:scale-95 cursor-pointer"
              title="Acessar Catálogo e Reservar Livros na Biblioteca Digital Escolar"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-950" />
              <span>Biblioteca Digital</span>
            </button>

            <button
              onClick={onOpenBullyingReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-200 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap shadow-sm hover:shadow active:scale-95 cursor-pointer"
              title="Acessar Canal de Denúncia e Acolhimento à Vítima de Bullying"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-900" />
              <span>Denúncia Bullying</span>
            </button>

            <button
              onClick={onOpenAdminLogin}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-100 hover:text-white bg-emerald-950/70 hover:bg-emerald-950 border border-emerald-700/60 rounded-lg transition-colors whitespace-nowrap active:scale-95 cursor-pointer"
              title="Acesso Administrativo (Direção e Coordenação)"
            >
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Gestão</span>
            </button>
          </div>
          
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={onOpenLibrary}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-md active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Biblioteca</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-emerald-200 hover:text-white hover:bg-emerald-800 focus:outline-none cursor-pointer"
              aria-label="Abrir menu principal"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-emerald-800 border-t border-emerald-700/60">
          <div className="px-3 pt-2 pb-3 space-y-1.5 sm:px-3">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  setIsOpen(false);
                  if (link.name === 'Biblioteca Digital' && onOpenLibrary) {
                    e.preventDefault();
                    onOpenLibrary();
                  }
                }}
                className="hover:bg-emerald-700 hover:text-emerald-200 block px-3 py-2 rounded-md text-base font-medium"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2 border-t border-emerald-700/80 space-y-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenLibrary) onOpenLibrary();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span>Biblioteca Digital Escolar (Catálogo & Reservas)</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenBullyingReport) onOpenBullyingReport();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold text-emerald-950 bg-emerald-300 hover:bg-emerald-200 transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Canal Anti-Bullying (Acolhimento à Vítima)</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenAdminLogin) onOpenAdminLogin();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-emerald-200 bg-emerald-950/80 hover:bg-emerald-950 border border-emerald-700/60 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Login da Administração</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
