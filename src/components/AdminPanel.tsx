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
  BookmarkCheck,
  Phone,
  Users,
  User,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import { BookReservation, Book, INITIAL_BOOKS, PRESET_BOOK_COVERS } from '../data/libraryBooks';

interface AdminPanelProps {
  onBackToHome: () => void;
}

interface BullyingReport {
  id: string;
  // Identificação da Vítima (não mais anônimo)
  victimName: string;
  victimGrade: string;
  victimShift?: string;
  victimMatricula?: string;
  // Identificação de quem relatou
  reporterRole?: 'vitima' | 'colega' | 'professor' | 'responsavel' | 'outro';
  reporterName?: string;
  reporterContact?: string;
  // Agressores / Envolvidos
  aggressorNames?: string;
  aggressorGrade?: string;
  // Ocorrência
  type: string;
  location: string;
  frequency: string;
  incidentDate?: string;
  description: string;
  supportDesired: string[];
  date: string;
  status?: 'Pendente' | 'Em Acompanhamento' | 'Concluído';
  internalNotes?: string;
  // Compatibilidade com dados anteriores
  targetPerson?: string;
  classGrade?: string;
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
  const [librarySubTab, setLibrarySubTab] = useState<'reservations' | 'catalog'>('reservations');

  // Book management in admin
  const [showAdminAddBookModal, setShowAdminAddBookModal] = useState(false);
  const [adminBookTitle, setAdminBookTitle] = useState('');
  const [adminBookAuthor, setAdminBookAuthor] = useState('');
  const [adminBookCategory, setAdminBookCategory] = useState('Literatura Brasileira');
  const [adminBookCopies, setAdminBookCopies] = useState(5);
  const [adminBookShelf, setAdminBookShelf] = useState('Estante 01 · Prateleira A');
  const [adminBookCover, setAdminBookCover] = useState('');
  const [adminBookForCover, setAdminBookForCover] = useState<Book | null>(null);
  const [adminCoverInput, setAdminCoverInput] = useState('');

  // Initial load and seed
  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  const loadData = () => {
    // 1. Bullying reports with identified victims
    try {
      const stored = localStorage.getItem('vcd_bullying_reports');
      if (stored) {
        const parsed: BullyingReport[] = JSON.parse(stored);
        // Normalize any older records that lacked explicit victimName
        const normalized = parsed.map((item, idx) => ({
          ...item,
          victimName: item.victimName || (item.targetPerson === 'eu' ? 'Aluno(a) Autorrelatado' : `Aluno(a) Vítima Relatada #${idx + 1}`),
          victimGrade: item.victimGrade || item.classGrade || 'Ensino Médio Integral',
          victimShift: item.victimShift || 'Tempo Integral',
          reporterRole: item.reporterRole || (item.targetPerson === 'eu' ? 'vitima' : 'colega'),
          reporterName: item.reporterName || (item.targetPerson === 'eu' ? item.victimName : 'Denunciante da Comunidade'),
          reporterContact: item.reporterContact || '(89) 99410-7024',
          aggressorNames: item.aggressorNames || 'Envolvidos sob apuração'
        }));
        setReports(normalized);
      } else {
        // Seed initial mock reports with identified victims
        const sampleReports: BullyingReport[] = [
          {
            id: 'VCD-DEN-782914',
            victimName: 'Lucas Gabriel Mendonça',
            victimGrade: '1º Ano A - Ensino Médio Integral',
            victimShift: 'Tempo Integral',
            victimMatricula: '2025-VCD-0891',
            reporterRole: 'colega',
            reporterName: 'Carlos Eduardo Silva',
            reporterContact: '(89) 99422-3344',
            aggressorNames: 'Alunos do 2º Ano B (Pedro H. e colegas)',
            aggressorGrade: '2º Ano B',
            type: 'verbal',
            location: 'patio',
            frequency: 'diaria',
            incidentDate: 'esta_semana',
            description: 'Alguns alunos estão zombando do Lucas durante o recreio por conta do sotaque e de sua cidade natal. Ele começou a ficar isolado e chorou no banheiro ontem.',
            supportDesired: [
              'Conversa confidencial imediata da coordenação com a vítima',
              'Apoio psicopedagógico e acolhimento emocional escolar',
              'Aumento de supervisão e ronda de inspetores no local indicado'
            ],
            date: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
            status: 'Pendente',
            internalNotes: 'Inspetor da área do pátio avisado para intensificar a ronda. Agendar acolhimento com Lucas e convocar os responsáveis.'
          },
          {
            id: 'VCD-DEN-904321',
            victimName: 'Mariana Rios de Albuquerque',
            victimGrade: '2º Ano B - Ensino Médio Integral',
            victimShift: 'Tempo Integral',
            victimMatricula: '2024-VCD-1420',
            reporterRole: 'vitima',
            reporterName: 'Mariana Rios de Albuquerque',
            reporterContact: '(89) 99455-8811',
            aggressorNames: 'Grupo de alunas da mesma turma',
            aggressorGrade: '2º Ano B',
            type: 'cyber',
            location: 'internet',
            frequency: 'recente',
            incidentDate: 'ontem',
            description: 'Criaram uma figurinha com montagem ofensiva da minha foto e compartilharam nos grupos de WhatsApp da turma, além de me excluírem das atividades.',
            supportDesired: [
              'Conversa confidencial imediata da coordenação com a vítima',
              'Convocação reservada da família dos envolvidos pela direção',
              'Mediação pacífica na turma sem expor a vítima aos agressores'
            ],
            date: new Date(Date.now() - 1000 * 60 * 60 * 44).toISOString(),
            status: 'Em Acompanhamento',
            internalNotes: 'Coordenação acolheu a aluna Mariana em 18/10. Reunião individual com os responsáveis dos envolvidos convocada para esta semana.'
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

  const handleAddBookAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminBookTitle.trim() || !adminBookAuthor.trim()) return;

    const newBook: Book = {
      id: `book-${Date.now().toString().slice(-6)}`,
      title: adminBookTitle.trim(),
      author: adminBookAuthor.trim(),
      category: adminBookCategory as Book['category'],
      isbn: `978-85-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}-0`,
      year: new Date().getFullYear(),
      pages: 180,
      publisher: 'Acervo SEDUC-PI / CETI',
      synopsis: 'Obra inserida pela gestão escolar para estudo, pesquisa e desenvolvimento literário.',
      shelfLocation: adminBookShelf.trim() || 'Estante 01 · Geral',
      totalCopies: Number(adminBookCopies) || 5,
      availableCopies: Number(adminBookCopies) || 5,
      coverGradient: 'from-emerald-700 to-emerald-950',
      coverImage: adminBookCover.trim() || undefined,
      badge: 'Acervo Escolar',
      recommendedGrade: 'Ensino Médio Integral',
      rating: 5.0,
      tags: ['Acervo Escolar', 'SEDUC']
    };

    const updated = [newBook, ...libraryBooks];
    setLibraryBooks(updated);
    localStorage.setItem('vcd_library_books', JSON.stringify(updated));
    setShowAdminAddBookModal(false);
    setAdminBookTitle('');
    setAdminBookAuthor('');
    setAdminBookCover('');
    setLibraryFeedback(`Livro "${newBook.title}" adicionado ao acervo com sucesso!`);
    setTimeout(() => setLibraryFeedback(''), 3500);
  };

  const handleDeleteBookAdmin = (book: Book) => {
    if (window.confirm(`Deseja realmente remover o livro "${book.title}" do acervo escolar?`)) {
      const updated = libraryBooks.filter(b => b.id !== book.id);
      setLibraryBooks(updated);
      localStorage.setItem('vcd_library_books', JSON.stringify(updated));
      setLibraryFeedback(`Livro "${book.title}" removido do catálogo com sucesso.`);
      setTimeout(() => setLibraryFeedback(''), 3500);
    }
  };

  const handleSaveCoverAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminBookForCover) return;
    const newCover = adminCoverInput.trim();
    const updated = libraryBooks.map(b => 
      b.id === adminBookForCover.id ? { ...b, coverImage: newCover || undefined } : b
    );
    setLibraryBooks(updated);
    localStorage.setItem('vcd_library_books', JSON.stringify(updated));
    setAdminBookForCover(null);
    setAdminCoverInput('');
    setLibraryFeedback(`Capa do livro "${adminBookForCover.title}" atualizada com sucesso!`);
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
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      r.id.toLowerCase().includes(term) ||
      (r.victimName && r.victimName.toLowerCase().includes(term)) ||
      (r.victimGrade && r.victimGrade.toLowerCase().includes(term)) ||
      (r.victimMatricula && r.victimMatricula.toLowerCase().includes(term)) ||
      (r.reporterName && r.reporterName.toLowerCase().includes(term)) ||
      (r.aggressorNames && r.aggressorNames.toLowerCase().includes(term)) ||
      r.description.toLowerCase().includes(term) ||
      (r.classGrade && r.classGrade.toLowerCase().includes(term));
    
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
                  placeholder="Buscar por vítima, protocolo, turma ou agressores..."
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
                <p className="text-xs">Quando novos relatos forem enviados pelo canal com a vítima identificada, eles aparecerão aqui instantaneamente.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-50 text-stone-600 text-xs uppercase font-semibold border-y border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Protocolo</th>
                      <th className="py-3 px-4">Vítima Identificada</th>
                      <th className="py-3 px-4">Quem Relatou</th>
                      <th className="py-3 px-4">Tipo / Local</th>
                      <th className="py-3 px-4">Data</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredReports.map((r) => (
                      <tr key={r.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-950 text-xs">
                          {r.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                              {(r.victimName || 'V').charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-stone-900 block leading-tight">
                                {r.victimName || 'Vítima não especificada'}
                              </span>
                              <span className="text-xs text-stone-500">
                                {r.victimGrade || r.classGrade || 'Turma não informada'}
                                {r.victimMatricula ? ` · Mat: ${r.victimMatricula}` : ''}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-stone-800 block text-xs">
                            {r.reporterRole === 'vitima' ? 'A própria vítima' : r.reporterName || 'Comunidade Escolar'}
                          </span>
                          {r.reporterContact && (
                            <span className="text-xs text-emerald-700 block font-mono">
                              {r.reporterContact}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-stone-900 block text-xs">{getBullyingTypeLabel(r.type)}</span>
                          <span className="text-xs text-stone-500">{getLocationLabel(r.location)}</span>
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
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold text-xs transition-colors cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-800" />
                            <span>Acolher</span>
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
                  <span>Gestão da Biblioteca Escolar</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Gerencie o catálogo de livros, adicione capas e acompanhe os pedidos de reserva dos alunos.
                </p>
              </div>

              {/* Sub tabs and actions */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex bg-stone-100 p-1 rounded-xl">
                  <button
                    onClick={() => setLibrarySubTab('reservations')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      librarySubTab === 'reservations'
                        ? 'bg-white text-emerald-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Reservas ({libraryReservations.length})
                  </button>
                  <button
                    onClick={() => setLibrarySubTab('catalog')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      librarySubTab === 'catalog'
                        ? 'bg-white text-emerald-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Catálogo de Livros ({libraryBooks.length})
                  </button>
                </div>

                {librarySubTab === 'catalog' && (
                  <button
                    onClick={() => setShowAdminAddBookModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Livro</span>
                  </button>
                )}
              </div>
            </div>

            {libraryFeedback && (
              <div className="p-3 bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>{libraryFeedback}</span>
              </div>
            )}

            {/* SUB-TAB 1: RESERVATIONS */}
            {librarySubTab === 'reservations' && (
              <div className="space-y-4">
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

            {/* SUB-TAB 2: CATALOG MANAGEMENT (ADD / REMOVE / CHANGE COVERS) */}
            {librarySubTab === 'catalog' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                  <p className="text-xs text-stone-600">
                    Obras disponíveis na biblioteca escolar do CETI. Você pode adicionar novas obras, remover títulos e atualizar capas.
                  </p>
                  <button
                    onClick={() => setShowAdminAddBookModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Cadastrar Novo Livro</span>
                  </button>
                </div>

                <div className="overflow-x-auto border border-stone-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-3">Capa</th>
                        <th className="py-3 px-3">Obra & Autor</th>
                        <th className="py-3 px-3">Categoria</th>
                        <th className="py-3 px-3">Localização</th>
                        <th className="py-3 px-3 text-center">Exemplares</th>
                        <th className="py-3 px-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {libraryBooks.map((b) => (
                        <tr key={b.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-2.5 px-3">
                            {b.coverImage ? (
                              <img
                                src={b.coverImage}
                                alt={b.title}
                                className="w-9 h-12 object-cover rounded shadow-xs border border-stone-200"
                              />
                            ) : (
                              <div className={`w-9 h-12 rounded bg-gradient-to-r ${b.coverGradient} flex items-center justify-center text-white/50 text-[10px]`}>
                                <ImageIcon className="w-4 h-4" />
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-stone-900 text-sm">{b.title}</div>
                            <div className="text-stone-500 text-xs">{b.author}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium">
                              {b.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-stone-600 max-w-[180px] truncate">
                            {b.shelfLocation}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-emerald-800">
                            {b.availableCopies} / {b.totalCopies}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setAdminBookForCover(b);
                                  setAdminCoverInput(b.coverImage || '');
                                }}
                                className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                                title="Alterar ou adicionar capa"
                              >
                                <ImageIcon className="w-3.5 h-3.5 text-stone-500" />
                                <span>{b.coverImage ? 'Capa' : '+ Capa'}</span>
                              </button>
                              <button
                                onClick={() => handleDeleteBookAdmin(b)}
                                className="p-1 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                                title="Remover livro do acervo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Modal: Admin Add Book */}
        {showAdminAddBookModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="font-bold text-emerald-950 text-lg">Adicionar Livro ao Catálogo</h3>
                <button
                  onClick={() => setShowAdminAddBookModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddBookAdmin} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Título da Obra *</label>
                  <input
                    type="text"
                    required
                    value={adminBookTitle}
                    onChange={(e) => setAdminBookTitle(e.target.value)}
                    placeholder="Ex: Senhora"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Autor(a) *</label>
                  <input
                    type="text"
                    required
                    value={adminBookAuthor}
                    onChange={(e) => setAdminBookAuthor(e.target.value)}
                    placeholder="Ex: José de Alencar"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Categoria</label>
                    <select
                      value={adminBookCategory}
                      onChange={(e) => setAdminBookCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="Literatura Brasileira">Literatura Brasileira</option>
                      <option value="Autores do Piauí e Nordeste">Autores do Piauí e Nordeste</option>
                      <option value="ENEM & Vestibulares">ENEM & Vestibulares</option>
                      <option value="Ciências da Natureza">Ciências da Natureza</option>
                      <option value="Filosofia & Sociologia">Filosofia & Sociologia</option>
                      <option value="Ficção Juvenil & Contos">Ficção Juvenil & Contos</option>
                      <option value="Matemática & Tecnologia">Matemática & Tecnologia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Total Exemplares</label>
                    <input
                      type="number"
                      min={1}
                      value={adminBookCopies}
                      onChange={(e) => setAdminBookCopies(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Localização na Estante</label>
                  <input
                    type="text"
                    value={adminBookShelf}
                    onChange={(e) => setAdminBookShelf(e.target.value)}
                    placeholder="Ex: Estante 01 · Prateleira A"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Link (URL) da Capa do Livro</label>
                  <input
                    type="url"
                    value={adminBookCover}
                    onChange={(e) => setAdminBookCover(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAdminAddBookModal(false)}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold"
                  >
                    Salvar Livro
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Admin Change Cover */}
        {adminBookForCover && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="font-bold text-emerald-950 text-base">Adicionar / Alterar Capa</h3>
                <button
                  onClick={() => setAdminBookForCover(null)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCoverAdmin} className="space-y-3 text-xs">
                <p className="text-stone-600">
                  Livro: <strong className="text-emerald-950">{adminBookForCover.title}</strong>
                </p>

                {adminCoverInput && (
                  <div className="flex justify-center py-2">
                    <img
                      src={adminCoverInput}
                      alt="Prévia"
                      className="w-24 h-36 object-cover rounded-xl shadow border border-stone-200"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">URL da Imagem da Capa</label>
                  <input
                    type="url"
                    required
                    value={adminCoverInput}
                    onChange={(e) => setAdminCoverInput(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setAdminBookForCover(null)}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold"
                  >
                    Atualizar Capa
                  </button>
                </div>
              </form>
            </div>
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

            {/* Card 1: Vítima Identificada */}
            <div className="bg-emerald-50/80 border border-emerald-300 rounded-2xl p-4.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm sm:text-base">
                  <UserCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>Vítima Identificada para Acolhimento</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold text-xs">
                  Vítima Identificada
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3.5 rounded-xl border border-emerald-100">
                <div>
                  <span className="text-stone-500 block font-semibold uppercase text-[10px]">Nome Completo da Vítima:</span>
                  <span className="font-extrabold text-emerald-950 text-sm block mt-0.5">
                    {selectedReport.victimName || 'Não informado'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block font-semibold uppercase text-[10px]">Turma / Ano Escolar:</span>
                  <span className="font-bold text-stone-900 block mt-0.5">
                    {selectedReport.victimGrade || selectedReport.classGrade || 'Não informada'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block font-semibold uppercase text-[10px]">Turno & Matrícula:</span>
                  <span className="font-medium text-stone-800 block mt-0.5">
                    {selectedReport.victimShift || 'Tempo Integral'}
                    {selectedReport.victimMatricula ? ` · Mat: ${selectedReport.victimMatricula}` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Quem Relatou & Agressores Indicados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-stone-700 font-bold uppercase text-[11px]">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Quem Registrou a Denúncia:</span>
                </div>
                <p className="font-bold text-stone-900 text-sm">
                  {selectedReport.reporterName || 'Autorrelato'}
                  <span className="text-xs font-normal text-stone-500 ml-1.5">
                    ({selectedReport.reporterRole === 'vitima' ? 'A própria vítima' : selectedReport.reporterRole || 'Relatante'})
                  </span>
                </p>
                {selectedReport.reporterContact && (
                  <div className="pt-1 flex items-center gap-2">
                    <span className="text-stone-500">Contato:</span>
                    <a
                      href={`tel:${selectedReport.reporterContact.replace(/\D/g, '')}`}
                      className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold underline font-mono text-xs"
                      title="Ligar ou enviar mensagem"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{selectedReport.reporterContact}</span>
                    </a>
                  </div>
                )}
              </div>

              <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold uppercase text-[11px]">
                  <Users className="w-3.5 h-3.5 text-amber-700" />
                  <span>Agressores / Autores Indicados:</span>
                </div>
                <p className="font-bold text-stone-900 text-sm">
                  {selectedReport.aggressorNames || 'Não especificados nominalmente'}
                </p>
                {selectedReport.aggressorGrade && (
                  <p className="text-stone-600 text-xs">
                    Turma informada dos agressores: <strong className="text-stone-800">{selectedReport.aggressorGrade}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
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
                <span className="text-stone-500 block">Data de Registro:</span>
                <span className="font-bold text-stone-800">{new Date(selectedReport.date).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            {/* Full Report Narrative */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
                Relato Detalhado dos Fatos:
              </label>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-sm text-stone-800 leading-relaxed whitespace-pre-wrap">
                {selectedReport.description}
              </div>
            </div>

            {/* Support Desired by Student */}
            {selectedReport.supportDesired && selectedReport.supportDesired.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
                  Apoio Solicitado para a Vítima:
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
