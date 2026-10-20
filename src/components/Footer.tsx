import React from 'react';
import { ShieldAlert, Lock } from 'lucide-react';

interface FooterProps {
  onOpenBullyingReport?: () => void;
  onOpenAdminLogin?: () => void;
  onOpenLibrary?: () => void;
  onOpenSchoolInfo?: () => void;
}

export default function Footer({ onOpenBullyingReport, onOpenAdminLogin, onOpenLibrary, onOpenSchoolInfo }: FooterProps) {
  return (
    <footer className="bg-emerald-950 text-emerald-200/90 py-12 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2.5">
            <img 
              src="/assets/aistudio/branco_transparente_0a853876.png" 
              alt="Logo CETI Verônica Celestina Dias" 
              className="h-9 w-9 sm:h-10 sm:w-10 object-contain drop-shadow-sm brightness-110" 
            />
            <div>
              <span className="font-bold text-lg sm:text-xl text-white block">CETI Verônica Celestina Dias</span>
              <span className="text-xs text-emerald-300/80">Governo do Estado do Piauí · SEDUC</span>
            </div>
          </div>
          
          <div className="text-center md:text-right text-sm space-y-2">
            <p className="text-emerald-200/90 text-xs sm:text-sm">
              R. Marino Caetano, Campo Alegre do Fidalgo - PI, 64767-000 · <a href="tel:+558994107024" className="hover:text-white underline underline-offset-2">+55 89 9410-7024</a>
            </p>

            {/* Main Navigation Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-xs text-emerald-300">
              <a href="#inicio" className="hover:text-white underline underline-offset-2">
                Início
              </a>
              <span>·</span>
              <a href="#sobre" className="hover:text-white underline underline-offset-2">
                A Escola
              </a>
              {onOpenSchoolInfo && (
                <>
                  <span>·</span>
                  <button onClick={onOpenSchoolInfo} className="hover:text-white underline underline-offset-2 cursor-pointer text-emerald-300">
                    Horários
                  </button>
                </>
              )}
              {onOpenLibrary && (
                <>
                  <span>·</span>
                  <button onClick={onOpenLibrary} className="hover:text-white underline underline-offset-2 cursor-pointer text-emerald-300">
                    Biblioteca
                  </button>
                </>
              )}
              <span>·</span>
              <a href="#contato" className="hover:text-white underline underline-offset-2">
                Contato
              </a>
            </div>

            {/* Dedicated Secondary Footer Actions: Denúncia & Gestão */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-end gap-2.5 text-xs">
              {onOpenBullyingReport && (
                <button 
                  onClick={onOpenBullyingReport} 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-800 transition-colors cursor-pointer"
                  title="Acessar Canal Oficial de Denúncia e Acolhimento à Vítima"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Canal de Denúncia</span>
                </button>
              )}

              {onOpenAdminLogin && (
                <button 
                  onClick={onOpenAdminLogin} 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-800 transition-colors cursor-pointer"
                  title="Acesso Administrativo (Direção e Coordenação)"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Área da Gestão</span>
                </button>
              )}
            </div>

            <p className="text-emerald-100/70 pt-2 text-xs">&copy; {new Date().getFullYear()} CETI Verônica Celestina Dias. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
