import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ShieldAlert, 
  Lock, 
  BookOpen, 
  CalendarDays, 
  ChevronDown, 
  Users, 
  Building2, 
  Info,
  ChevronRight
} from 'lucide-react';

interface NavbarProps {
  onOpenBullyingReport?: () => void;
  onOpenAdminLogin?: () => void;
  onOpenLibrary?: () => void;
  onOpenSchoolInfo?: () => void;
  onBackToHome?: () => void;
}

export default function Navbar({ 
  onOpenBullyingReport, 
  onOpenAdminLogin, 
  onOpenLibrary, 
  onOpenSchoolInfo,
  onBackToHome 
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);
  const [isMobileSchoolExpanded, setIsMobileSchoolExpanded] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSchoolDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHomeClick = (e: React.MouseEvent) => {
    if (onBackToHome) {
      onBackToHome();
    }
  };

  return (
    <nav className="bg-emerald-900 text-white sticky top-0 z-50 shadow-md border-b border-emerald-800/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          
          {/* Brand / Logo */}
          <a 
            href="#inicio" 
            onClick={handleHomeClick}
            className="flex items-center gap-2 sm:gap-2.5 shrink-0 group cursor-pointer max-w-[75%] sm:max-w-none"
            title="Ir para o início"
          >
            <img 
              src="/assets/aistudio/branco_transparente_0a853876.png" 
              alt="Logo CETI Verônica Celestina Dias" 
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain shrink-0 drop-shadow-sm brightness-110 group-hover:scale-105 transition-transform" 
            />
            <div className="leading-tight min-w-0">
              <span className="font-bold text-sm sm:text-lg lg:text-xl tracking-tight text-white block truncate">
                CETI Verônica Celestina Dias
              </span>
              <span className="text-[10px] text-emerald-300 font-medium hidden sm:block truncate">
                Ensino Médio em Tempo Integral · SEDUC Piauí
              </span>
            </div>
          </a>
          
          {/* Main Clean Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            
            {/* 1. Início */}
            <a
              href="#inicio"
              onClick={handleHomeClick}
              className="hover:bg-emerald-800 hover:text-emerald-200 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer text-emerald-50"
            >
              Início
            </a>

            {/* 2. A Escola (Dropdown with Sobre Nós, Estrutura, Informações) */}
            <div 
              className="relative" 
              ref={dropdownRef}
              onMouseEnter={() => setIsSchoolDropdownOpen(true)}
              onMouseLeave={() => setIsSchoolDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsSchoolDropdownOpen(prev => !prev)}
                className={`hover:bg-emerald-800 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isSchoolDropdownOpen ? 'bg-emerald-800 text-emerald-200' : 'text-emerald-50 hover:text-emerald-200'
                }`}
                aria-expanded={isSchoolDropdownOpen}
              >
                <span>A Escola</span>
                <ChevronDown className={`w-4 h-4 text-emerald-300 transition-transform duration-200 ${isSchoolDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu Card */}
              {isSchoolDropdownOpen && (
                <div className="absolute left-0 top-full pt-1.5 w-64 z-50">
                  <div className="rounded-2xl bg-emerald-950/95 backdrop-blur-md border border-emerald-700/80 shadow-2xl py-2 overflow-hidden ring-1 ring-black/20">
                    <a
                      href="#sobre"
                      onClick={() => setIsSchoolDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs text-emerald-100 hover:text-white hover:bg-emerald-850/80 transition-colors group"
                    >
                      <div className="p-1.5 rounded-lg bg-emerald-900/80 group-hover:bg-emerald-700 text-emerald-300 transition-colors">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">Sobre Nós</div>
                        <div className="text-[11px] text-emerald-300/80 font-normal">Nossa proposta e valores</div>
                      </div>
                    </a>

                    <a
                      href="#estrutura"
                      onClick={() => setIsSchoolDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs text-emerald-100 hover:text-white hover:bg-emerald-850/80 transition-colors group"
                    >
                      <div className="p-1.5 rounded-lg bg-emerald-900/80 group-hover:bg-emerald-700 text-emerald-300 transition-colors">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">Estrutura & Fotos</div>
                        <div className="text-[11px] text-emerald-300/80 font-normal">Ambientes e fotos reais</div>
                      </div>
                    </a>

                    <a
                      href="#info"
                      onClick={() => setIsSchoolDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs text-emerald-100 hover:text-white hover:bg-emerald-850/80 transition-colors group"
                    >
                      <div className="p-1.5 rounded-lg bg-emerald-900/80 group-hover:bg-emerald-700 text-emerald-300 transition-colors">
                        <Info className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">Informações Úteis</div>
                        <div className="text-[11px] text-emerald-300/80 font-normal">Localização e expediente</div>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Horários */}
            <button
              onClick={onOpenSchoolInfo}
              className="hover:bg-emerald-800 hover:text-emerald-200 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 text-emerald-50"
              title="Consultar grade de horários, turmas e rotina integral"
            >
              <CalendarDays className="w-4 h-4 text-emerald-300" />
              <span>Horários</span>
            </button>

            {/* 4. Biblioteca */}
            <button
              onClick={onOpenLibrary}
              className="hover:bg-emerald-800 hover:text-emerald-200 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 text-emerald-50"
              title="Acessar acervo e reservar livros da biblioteca"
            >
              <BookOpen className="w-4 h-4 text-emerald-300" />
              <span>Biblioteca</span>
            </button>

            {/* 5. Contato */}
            <a
              href="#contato"
              className="hover:bg-emerald-800 hover:text-emerald-200 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer text-emerald-50"
            >
              Contato
            </a>

          </div>

          {/* Secondary Action Area: Discreet and clean (Gestão & Denúncia) */}
          <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-emerald-800/80 text-xs">
            <button
              onClick={onOpenBullyingReport}
              className="text-emerald-200 hover:text-white hover:bg-emerald-800/80 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
              title="Canal de Acolhimento e Denúncia de Bullying"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              <span>Denúncia</span>
            </button>

            <button
              onClick={onOpenAdminLogin}
              className="text-emerald-200 hover:text-white hover:bg-emerald-800/80 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
              title="Área Administrativa (Gestão Escolar)"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gestão</span>
            </button>
          </div>
          
          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800 focus:outline-none cursor-pointer transition-colors"
              aria-label="Abrir menu de navegação"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-emerald-950/95 backdrop-blur-md border-t border-emerald-800/90 shadow-2xl">
          <div className="px-4 pt-3 pb-4 space-y-2">
            
            {/* Início */}
            <a
              href="#inicio"
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleHomeClick(e);
              }}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl text-base font-semibold text-emerald-100 hover:text-white hover:bg-emerald-900 transition-colors"
            >
              <span>Início</span>
              <ChevronRight className="w-4 h-4 text-emerald-500" />
            </a>

            {/* A Escola (Accordion with Sobre Nós, Estrutura, Informações) */}
            <div className="rounded-2xl bg-emerald-900/40 border border-emerald-800/60 overflow-hidden">
              <button
                onClick={() => setIsMobileSchoolExpanded(!isMobileSchoolExpanded)}
                className="w-full flex items-center justify-between py-2.5 px-3 text-base font-semibold text-emerald-100 hover:text-white transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-300" />
                  <span>A Escola</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-emerald-300 transition-transform ${isMobileSchoolExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isMobileSchoolExpanded && (
                <div className="pl-4 pr-3 pb-2.5 pt-1 space-y-1 border-t border-emerald-800/40 text-sm">
                  <a
                    href="#sobre"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 px-2.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sobre Nós</span>
                  </a>

                  <a
                    href="#estrutura"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 px-2.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Estrutura & Fotos</span>
                  </a>

                  <a
                    href="#info"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 px-2.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Informações Úteis</span>
                  </a>
                </div>
              )}
            </div>

            {/* Horários */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onOpenSchoolInfo) onOpenSchoolInfo();
              }}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-base font-semibold text-emerald-100 hover:text-white hover:bg-emerald-900 transition-colors text-left cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-emerald-300" />
                <span>Horários</span>
              </span>
              <ChevronRight className="w-4 h-4 text-emerald-500" />
            </button>

            {/* Biblioteca */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onOpenLibrary) onOpenLibrary();
              }}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-base font-semibold text-emerald-100 hover:text-white hover:bg-emerald-900 transition-colors text-left cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-300" />
                <span>Biblioteca</span>
              </span>
              <ChevronRight className="w-4 h-4 text-emerald-500" />
            </button>

            {/* Contato */}
            <a
              href="#contato"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl text-base font-semibold text-emerald-100 hover:text-white hover:bg-emerald-900 transition-colors"
            >
              <span>Contato</span>
              <ChevronRight className="w-4 h-4 text-emerald-500" />
            </a>

            {/* Área Secundária: Gestão & Denúncia */}
            <div className="pt-3 border-t border-emerald-800/80 grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenBullyingReport) onOpenBullyingReport();
                }}
                className="py-2.5 px-3 rounded-xl text-emerald-200 bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-800 flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                <span>Denúncia</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenAdminLogin) onOpenAdminLogin();
                }}
                className="py-2.5 px-3 rounded-xl text-emerald-200 bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-800 flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gestão</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}
