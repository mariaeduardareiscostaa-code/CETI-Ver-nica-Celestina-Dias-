import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  UserCheck, 
  ShieldAlert, 
  Mail, 
  ArrowLeft, 
  LogOut, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  FileText, 
  Save, 
  X, 
  Check, 
  Filter, 
  BarChart3, 
  GraduationCap,
  Inbox,
  KeyRound,
  BookOpen,
  BookmarkCheck
} from 'lucide-react';
import { BookReservation, Book, INITIAL_BOOKS } from '../data/libraryBooks';

interface AdminPanelProps {
  onBackToHome: () => void;
}

interface BullyingReport {
  id: string;
  type: string;
  location: string;
  frequency: string;
  targetPerson: string;
  classGrade?: string;
  description: string;
  supportDesired: string[];
  date: string;
  status?: 'Pendente' | 'Em Acompanhamento' | 'Concluído';
  internalNotes?: string;
}

interface ContactMessage {
  id: string;
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
  data: string;
  status?: string;
}

export default function AdminPanel({ onBackToHome }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('vcd_admin_logged_in') === 'true';
  });

  const [accessKey, setAccessKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'bullying' | 'messages' | 'stats' | 'library'>('bullying');

  // Bullying Reports state
  const [reports, setReports] = useState<BullyingReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<BullyingReport | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<'Pendente' | 'Em Acompanhamento' | 'Concluído'>('Pendente');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Contact Messages state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Digital Library Management state
  const [libraryReservations, setLibraryReservations] = useState<BookReservation[]>([]);
  const [libraryBooks, setLibraryBooks] = useState<Book[]>([]);
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryFilter, setLibraryFilter] = useState<string>('todos');
  const [libraryFeedback, setLibraryFeedback] = useState('');

  // Initial load and seed
  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  const loadData = () => {
    // 1. Bullying reports
    try {
      const stored = localStorage.getItem('vcd_bullying_reports');
      if (stored) {
        setReports(JSON.parse(stored));
      } else {
        // Seed initial mock reports for immediate demonstration
        const sampleReports: BullyingReport[] = [
          {
            id: 'VCD-ANON-782914',
            type: 'verbal',
            location: 'patio',
            frequency: 'diaria',
            targetPerson: 'colega',
            classGrade: '1º Ano do Ensino Médio',
            description: 'Alguns alunos estão zombando de um colega novato durante o intervalo por conta de sua cidade de origem. O colega começou a ficar isolado no recreio.',
            supportDesired: ['Mediação pacífica na turma sem expor quem relatou', 'Aumento de supervisão de inspetores no local indicado'],
            date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            status: 'Pendente',
            internalNotes: 'Inspetor da área do pátio avisado para intensificar a ronda.'
          },
          {
            id: 'VCD-ANON-904321',
            type: 'cyber',
            location: 'internet',
            frequency: 'recente',
            targetPerson: 'eu',
            classGrade: '2º Ano B',
            description: 'Criaram uma figurinha ofensiva com minha foto e estão compartilhando nos grupos de turma do WhatsApp.',
            supportDesired: ['Conversa confidencial com a coordenação pedagógica', 'Apoio e acolhimento psicológico/emocional'],
            date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
            status: 'Em Acompanhamento',
            internalNotes: 'Agendada conversa de acolhimento com a equipe psicopedagógica.'
          }
        ];
        localStorage.setItem('vcd_bullying_reports', JSON.stringify(sampleReports));
        setReports(sampleReports);
      }
    } catch {
      // ignore
    }

    // 2. Contact messages
    try {
      const storedMsgs = localStorage.getItem('vcd_contact_messages');
      if (storedMsgs) {
        setMessages(JSON.parse(storedMsgs));
      } else {
        const sampleMsgs: ContactMessage[] = [
          {
            id: 'MSG-4821',
            nome: 'Ana Beatriz Souza',
            email: 'ana.souza.responsavel@gmail.com',
            assunto: 'secretaria',
            mensagem: 'Gostaria de saber o prazo final para confirmação de matrícula do ano letivo.',
            data: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
            status: 'Respondida'
          },
          {
            id: 'MSG-8912',
            nome: 'Carlos Eduardo Oliveira',
            email: 'carlos.eduardo@gmail.com',
            assunto: 'coordenacao',
            mensagem: 'Parabéns pela iniciativa do ensino em tempo integral. Gostaria de solicitar informações sobre o projeto de robótica.',
            data: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
            status: 'Nova'
          }
        ];
        localStorage.setItem('vcd_contact_messages', JSON.stringify(sampleMsgs));
        setMessages(sampleMsgs);
      }
    } catch {
      // ignore
    }

    // 3. Digital Library
    try {
      const storedRes = localStorage.getItem('vcd_library_reservations');
      if (storedRes) {
        setLibraryReservations(JSON.parse(storedRes));
      } else {
        const sampleRes: BookReservation[] = [
          {
            id: 'CETI-LIB-2026-4821',
            bookId: 'book-05',
            bookTitle: 'Redação Nota 1000: Técnicas e Repertórios para o ENEM',
            bookAuthor: 'Profª. Clarice Mendonça & Equipe Pedagógica',
            bookCategory: 'ENEM & Vestibulares',
            shelfLocation: 'Estante 03 · Prateleira A (Bancada Preparatória ENEM)',
            studentName: 'Ana Clara Fernandes',
            studentMatricula: '2024-VCD-1089',
            studentGrade: '3º Ano A - Ensino Médio Integral',
            studentContact: '(89) 99422-1100',
            reservationDate: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
            pickupDeadline: new Date(Date.now() + 1000 * 60 * 60 * 30).toISOString(),
            returnDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
            status: 'Pendente para Retirada',
            notes: 'Preparação para o simulado do ENEM deste mês.'
          }
        ];
        localStorage.setItem('vcd_library_reservations', JSON.stringify(sampleRes));
        setLibraryReservations(sampleRes);
      }

      const storedBooks = localStorage.getItem('vcd_library_books');
      if (storedBooks) {
        setLibraryBooks(JSON.parse(storedBooks));
      } else {
        localStorage.setItem('vcd_library_books', JSON.stringify(INITIAL_BOOKS));
        setLibraryBooks(INITIAL_BOOKS);
      }
    } catch {
      // ignore
    }
  };

  const handleUpdateReservationStatus = (reservationId: string, newStatus: BookReservation['status']) => {
    const targetReservation = libraryReservations.find(r => r.id === reservationId);
    if (!targetReservation) return;

    const oldStatus = targetReservation.status;
    const updated = libraryReservations.map((r) => {
      if (r.id === reservationId) {
        return { ...r, status: newStatus };
      }
      return r;
    });

    // If changing to 'Devolvido' or 'Cancelado' from 'Pendente para Retirada' or 'Retirado / Emprestado', return book copy
    if ((newStatus === 'Devolvido' || newStatus === 'Cancelado') && oldStatus !== 'Devolvido' && oldStatus !== 'Cancelado') {
      setLibraryBooks((prevBooks) => {
        const newBooks = prevBooks.map((b) =>
          b.id === targetReservation.bookId ? { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) } : b
        );
        localStorage.setItem('vcd_library_books', JSON.stringify(newBooks));
        return newBooks;
      });
    }

    setLibraryReservations(updated);
    localStorage.setItem('vcd_library_reservations', JSON.stringify(updated));
    setLibraryFeedback(`Status da reserva ${reservationId} atualizado para: "${newStatus}"`);
    setTimeout(() => setLibraryFeedback(''), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanKey = accessKey.trim();

    if (cleanKey === '12345') {
      setIsAuthenticated(true);
      localStorage.setItem('vcd_admin_logged_in', 'true');
    } else {
      setLoginError('Chave de acesso incorreta. Por favor, verifique a chave informada.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('vcd_admin_logged_in');
  };

  const openReportModal = (rep: BullyingReport) => {
    setSelectedReport(rep);
    setEditNotes(rep.internalNotes || '');
    setEditStatus(rep.status || 'Pendente');
    setSaveSuccess(false);
  };

  const handleSaveReportUpdate = () => {
    if (!selectedReport) return;
    const updated = reports.map(r => {
      if (r.id === selectedReport.id) {
        return {
          ...r,
          status: editStatus,
          internalNotes: editNotes
        };
      }
      return r;
    });

    setReports(updated);
    setSelectedReport(prev => prev ? { ...prev, status: editStatus, internalNotes: editNotes } : null);
    try {
      localStorage.setItem('vcd_bullying_reports', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.classGrade && r.classGrade.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'todos' || (r.status || 'Pendente') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getBullyingTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      verbal: 'Verbal / Ofensas',
      fisico: 'Físico / Agressão',
      psicologico: 'Psicológico / Exclusão',
      cyber: 'Cyberbullying (Virtual)',
      patrimonial: 'Dano a Patrimônio/Material',
      ameaca: 'Ameaça e Intimidação',
      outro: 'Outro'
    };
    return map[type] || type;
  };

  const getLocationLabel = (loc: string) => {
    const map: Record<string, string> = {
      sala: 'Sala de aula',
      patio: 'Pátio / Recreio',
      banheiro: 'Banheiro',
      quadra: 'Quadra de esportes',
      portao: 'Entrada / Portão',
      transporte: 'Transporte escolar',
      internet: 'Internet / Redes sociais',
      outro: 'Outro local'
    };
    return map[loc] || loc;
  };

  // If not authenticated, render Login Page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col justify-between font-sans">
        {/* Navigation */}
        <header className="bg-emerald-950 text-white border-b border-emerald-900 py-4 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-emerald-300" />
              <span className="font-bold text-lg text-white">CETI Verônica Celestina Dias</span>
            </div>
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-emerald-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Portal Público</span>
            </button>
          </div>
        </header>

        {/* Login Form Container */}
        <main className="flex-grow flex items-center justify-center p-4 py-12">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-stone-200/80 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <KeyRound className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-extrabold text-emerald-950 tracking-tight">
                Painel da Gestão Escolar
              </h1>
              <p className="text-xs sm:text-sm text-stone-600">
                Insira a chave de acesso da administração para entrar no painel.
              </p>
            </div>

            {loginError && (
              <div className="p-3.5 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs sm:text-sm leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Chave de Acesso
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    required
                    autoFocus
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    placeholder="Digite a chave de acesso"
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm bg-white text-stone-900 font-mono tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-700 cursor-pointer"
                    title={showKey ? "Ocultar chave" : "Exibir chave"}
                    aria-label={showKey ? "Ocultar chave" : "Exibir chave"}
                  >
                    {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl transition-all shadow-md active:scale-98 text-sm cursor-pointer"
              >
                Acessar Painel da Gestão
              </button>
            </form>
          </div>
        </main>

        <footer className="text-center py-6 text-xs text-stone-500">
          CETI Verônica Celestina Dias · Campo Alegre do Fidalgo - PI · Sistema de Gestão Escolar
        </footer>
      </div>
    );
  }

  // When Authenticated: Render Administrative Dashboard
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Top Header of Admin Dashboard */}
      <header className="bg-emerald-950 text-white border-b border-emerald-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-900 rounded-lg text-emerald-300">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg block leading-tight">Painel da Administração</span>
              <span className="text-xs text-emerald-300/80 hidden sm:block">CETI Verônica Celestina Dias · Gestão & Acolhimento</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="px-3 py-1.5 text-xs font-medium bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 rounded-lg border border-emerald-800 transition-colors hidden sm:inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ver Site Público</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-200 bg-red-950/60 hover:bg-red-900/70 border border-red-800 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-grow w-full space-y-6">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Denúncias Bullying</span>
              <span className="text-2xl font-bold text-emerald-950 mt-1 block">{reports.length}</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Casos Pendentes</span>
              <span className="text-2xl font-bold text-amber-700 mt-1 block">
                {reports.filter(r => (r.status || 'Pendente') === 'Pendente').length}
              </span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Acolhimento Ativo</span>
              <span className="text-2xl font-bold text-blue-700 mt-1 block">
                {reports.filter(r => r.status === 'Em Acompanhamento').length}
              </span>
            </div>
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Mensagens Comunidade</span>
              <span className="text-2xl font-bold text-stone-800 mt-1 block">{messages.length}</span>
            </div>
            <div className="p-3 bg-stone-100 text-stone-700 rounded-xl">
              <Mail className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Reservas Biblioteca</span>
              <span className="text-2xl font-bold text-emerald-800 mt-1 block">{libraryReservations.length}</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-stone-200 bg-white px-4 pt-2 rounded-t-2xl shadow-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('bullying')}
            className={`pb-3 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'bullying'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Relatos de Bullying ({reports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`pb-3 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'library'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Biblioteca & Reservas ({libraryReservations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-3 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'messages'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Mensagens ({messages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`pb-3 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'stats'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Indicadores</span>
          </button>
        </div>

        {/* Tab 1: Bullying Reports Management */}
        {activeTab === 'bullying' && (
          <div className="bg-white rounded-b-2xl p-6 border border-stone-200 border-t-0 space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Buscar por protocolo, palavra ou turma..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-stone-50/50"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-stone-500" />
                <span className="text-xs text-stone-500 font-semibold uppercase">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs font-medium px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-800 focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="Pendente">Apenas Pendentes</option>
                  <option value="Em Acompanhamento">Em Acompanhamento</option>
                  <option value="Concluído">Concluídos</option>
                </select>
              </div>
            </div>

            {/* List / Table of Reports */}
            {filteredReports.length === 0 ? (
              <div className="text-center py-12 text-stone-500 space-y-2">
                <ShieldAlert className="w-10 h-10 text-stone-300 mx-auto" />
                <p className="font-semibold text-stone-700">Nenhum relato encontrado com os filtros aplicados.</p>
                <p className="text-xs">Quando novos relatos forem enviados pelo canal anônimo, eles aparecerão aqui instantaneamente.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-50 text-stone-600 text-xs uppercase font-semibold border-y border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Protocolo</th>
                      <th className="py-3 px-4">Tipo / Local</th>
                      <th className="py-3 px-4">Turma</th>
                      <th className="py-3 px-4">Data</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredReports.map((r) => (
                      <tr key={r.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-950">
                          {r.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-stone-900 block">{getBullyingTypeLabel(r.type)}</span>
                          <span className="text-xs text-stone-500">{getLocationLabel(r.location)}</span>
                        </td>
                        <td className="py-3.5 px-4 text-stone-600">
                          {r.classGrade || 'Não informada'}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-stone-500 whitespace-nowrap">
                          {new Date(r.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            (r.status || 'Pendente') === 'Pendente'
                              ? 'bg-amber-100 text-amber-800'
                              : r.status === 'Em Acompanhamento'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {r.status || 'Pendente'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => openReportModal(r)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold text-xs transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Analisar</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Contact Messages Management */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-b-2xl p-6 border border-stone-200 border-t-0 space-y-6">
            <h3 className="text-lg font-bold text-emerald-950">Mensagens Recebidas pelo Portal</h3>
            {messages.length === 0 ? (
              <p className="text-sm text-stone-500">Nenhuma mensagem registrada no momento.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {messages.map((m) => (
                  <div key={m.id} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-stone-900">{m.nome}</h4>
                        <a href={`mailto:${m.email}`} className="text-xs text-emerald-700 hover:underline">
                          {m.email}
                        </a>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold capitalize">
                        {m.assunto}
                      </span>
                    </div>
                    <p className="text-sm text-stone-700 bg-white p-3 rounded-xl border border-stone-100 leading-relaxed">
                      "{m.mensagem}"
                    </p>
                    <div className="text-xs text-stone-400 flex items-center justify-between pt-1">
                      <span>{new Date(m.data).toLocaleDateString('pt-BR')}</span>
                      <a
                        href={`mailto:${m.email}?subject=Resposta CETI Verônica Celestina Dias - ${m.assunto}`}
                        className="font-semibold text-emerald-800 hover:underline text-xs"
                      >
                        Responder por E-mail &rarr;
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Indicators and Pedagogical Plan */}
        {activeTab === 'stats' && (
          <div className="bg-white rounded-b-2xl p-6 border border-stone-200 border-t-0 space-y-6">
            <h3 className="text-lg font-bold text-emerald-950">Protocolo de Prevenção & Indicadores</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                <h4 className="font-bold text-emerald-950">1. Acolhimento da Vítima</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Garantir escuta empática e sigilosa sem colocar a vítima em situação de confronto com os agressores.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                <h4 className="font-bold text-emerald-950">2. Intervenção na Turma</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Realizar dinâmicas reflexivas sobre respeito e convivência pacífica, sem citar a existência da denúncia anônima.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                <h4 className="font-bold text-emerald-950">3. Comunicação aos Responsáveis</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Em situações reincidentes ou graves, convocar as famílias para plano conjunto de acompanhamento com assistência social.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Digital Library & Book Reservations */}
        {activeTab === 'library' && (
          <div className="bg-white rounded-b-2xl p-6 border border-stone-200 border-t-0 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-800" />
                  <span>Gestão da Biblioteca Escolar & Reservas de Alunos</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Acompanhe e despache os pedidos de reserva de livros feitos pelos estudantes do CETI.
                </p>
              </div>

              {/* Acervo inventory pill */}
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 text-xs font-semibold text-emerald-900">
                <span>Acervo: <strong>{libraryBooks.length}</strong> títulos</span>
                <span>·</span>
                <span><strong>{libraryBooks.reduce((a, b) => a + b.availableCopies, 0)}</strong> de <strong>{libraryBooks.reduce((a, b) => a + b.totalCopies, 0)}</strong> livros livres</span>
              </div>
            </div>

            {libraryFeedback && (
              <div className="p-3 bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>{libraryFeedback}</span>
              </div>
            )}

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Buscar por aluno, matrícula, livro ou protocolo..."
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
                {['todos', 'Pendente para Retirada', 'Retirado / Emprestado', 'Devolvido', 'Cancelado'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setLibraryFilter(status)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      libraryFilter === status
                        ? 'bg-emerald-800 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {status === 'todos' ? 'Todas as Reservas' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Reservations List */}
            {(() => {
              const filtered = libraryReservations.filter((res) => {
                const matchesSearch =
                  res.studentName.toLowerCase().includes(librarySearch.toLowerCase()) ||
                  res.studentMatricula.toLowerCase().includes(librarySearch.toLowerCase()) ||
                  res.bookTitle.toLowerCase().includes(librarySearch.toLowerCase()) ||
                  res.id.toLowerCase().includes(librarySearch.toLowerCase());
                const matchesFilter = libraryFilter === 'todos' || res.status === libraryFilter;
                return matchesSearch && matchesFilter;
              });

              if (filtered.length === 0) {
                return (
                  <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200/80 p-6 space-y-2">
                    <BookmarkCheck className="w-8 h-8 text-stone-400 mx-auto" />
                    <p className="text-sm font-semibold text-stone-700">Nenhuma reserva encontrada</p>
                    <p className="text-xs text-stone-500">Tente alterar os termos da busca ou os filtros de status.</p>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {filtered.map((res) => {
                    const isPending = res.status === 'Pendente para Retirada';
                    const isBorrowed = res.status === 'Retirado / Emprestado';
                    const isReturned = res.status === 'Devolvido';
                    const isCancelled = res.status === 'Cancelado';

                    return (
                      <div
                        key={res.id}
                        className="p-4 rounded-2xl border border-stone-200 hover:border-emerald-300 bg-stone-50/50 hover:bg-white transition-all space-y-3 shadow-xs"
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-stone-200/80 pb-2.5">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
                                {res.id}
                              </span>
                              <span className="text-xs text-stone-500">
                                Solicitado em: {new Date(res.reservationDate).toLocaleDateString('pt-BR')} às {new Date(res.reservationDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-emerald-950 mt-1">
                              {res.bookTitle}
                            </h4>
                            <p className="text-xs text-stone-600">Autor: {res.bookAuthor} · {res.shelfLocation}</p>
                          </div>

                          <div>
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                isPending
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : isBorrowed
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                  : isReturned
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-red-100 text-red-800 border border-red-200'
                              }`}
                            >
                              {isPending && <Clock className="w-3.5 h-3.5" />}
                              {isBorrowed && <BookOpen className="w-3.5 h-3.5" />}
                              {isReturned && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {isCancelled && <AlertCircle className="w-3.5 h-3.5" />}
                              <span>{res.status}</span>
                            </span>
                          </div>
                        </div>

                        {/* Student Info & Deadlines */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                          <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                            <span className="text-stone-500 block font-medium">Estudante:</span>
                            <span className="font-bold text-stone-800 text-sm">{res.studentName}</span>
                            <div className="text-stone-600 font-mono text-[11px] mt-0.5">Matrícula: {res.studentMatricula}</div>
                            <div className="text-stone-600 text-[11px]">Turma: {res.studentGrade}</div>
                          </div>

                          <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                            <span className="text-stone-500 block font-medium">Contato & Observação:</span>
                            <span className="font-medium text-stone-800">{res.studentContact}</span>
                            <p className="text-stone-600 text-[11px] mt-1 line-clamp-2">
                              {res.notes || 'Sem anotações adicionais'}
                            </p>
                          </div>

                          <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                            <span className="text-stone-500 block font-medium">Prazos de Retirada / Devolução:</span>
                            <div className="text-amber-800 font-semibold text-[11px]">
                              Retirada até: {new Date(res.pickupDeadline).toLocaleDateString('pt-BR')} (48h)
                            </div>
                            <div className="text-stone-600 text-[11px] mt-0.5">
                              Devolução: {new Date(res.returnDeadline).toLocaleDateString('pt-BR')} (14 dias)
                            </div>
                          </div>
                        </div>

                        {/* Management Actions */}
                        <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-stone-200/60">
                          {isPending && (
                            <button
                              onClick={() => handleUpdateReservationStatus(res.id, 'Retirado / Emprestado')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs cursor-pointer"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Confirmar Entrega ao Aluno</span>
                            </button>
                          )}

                          {isBorrowed && (
                            <button
                              onClick={() => handleUpdateReservationStatus(res.id, 'Devolvido')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Registrar Devolução à Biblioteca</span>
                            </button>
                          )}

                          {isPending && (
                            <button
                              onClick={() => handleUpdateReservationStatus(res.id, 'Cancelado')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Cancelar Pedido</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

          </div>
        )}

      </main>

      {/* Modal for Analyzing a Bullying Report */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">Detalhes da Ocorrência</span>
                <h3 className="text-xl font-bold text-emerald-950 font-mono mt-0.5">
                  Protocolo {selectedReport.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-stone-500 block">Tipo:</span>
                <span className="font-bold text-stone-800">{getBullyingTypeLabel(selectedReport.type)}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-stone-500 block">Local:</span>
                <span className="font-bold text-stone-800">{getLocationLabel(selectedReport.location)}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-stone-500 block">Frequência:</span>
                <span className="font-bold text-stone-800 capitalize">{selectedReport.frequency}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-stone-500 block">Alvo indicado:</span>
                <span className="font-bold text-stone-800 capitalize">{selectedReport.targetPerson}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-stone-500 block">Turma:</span>
                <span className="font-bold text-stone-800">{selectedReport.classGrade || 'Não informada'}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-stone-500 block">Data de Envio:</span>
                <span className="font-bold text-stone-800">{new Date(selectedReport.date).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            {/* Full Report Narrative */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
                Relato do Aluno (Anônimo):
              </label>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-sm text-stone-800 leading-relaxed whitespace-pre-wrap">
                {selectedReport.description}
              </div>
            </div>

            {/* Support Desired by Student */}
            {selectedReport.supportDesired && selectedReport.supportDesired.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
                  Apoio Solicitado pelo Aluno:
                </label>
                <div className="space-y-1">
                  {selectedReport.supportDesired.map((sup, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{sup}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status & Internal Notes Editor */}
            <div className="border-t border-stone-200 pt-4 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Atualizar Status do Acompanhamento:
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em Acompanhamento">Em Acompanhamento</option>
                  <option value="Concluído">Concluído</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                  Anotações Internas da Gestão (Confidencial):
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Ex: 'Coordenação conversou com o professor regente em 16/10. Vítima encaminhada para conversa de acolhimento.'"
                  className="w-full px-4 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 resize-none"
                ></textarea>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Alterações salvas com sucesso!</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={handleSaveReportUpdate}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Acompanhamento</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
