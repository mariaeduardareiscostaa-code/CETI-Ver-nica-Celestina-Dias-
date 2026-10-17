import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Bookmark, 
  BookmarkCheck, 
  AlertCircle, 
  User, 
  Sparkles, 
  GraduationCap, 
  MapPin, 
  Share2, 
  Printer, 
  X, 
  Info, 
  Library, 
  Tag, 
  Layers, 
  ChevronRight, 
  Copy, 
  Check, 
  Phone,
  BookCheck,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { Book, BookReservation, INITIAL_BOOKS } from '../data/libraryBooks';

interface DigitalLibraryPageProps {
  onBackToHome: () => void;
  onOpenAdminLogin?: () => void;
}

export default function DigitalLibraryPage({ onBackToHome, onOpenAdminLogin }: DigitalLibraryPageProps) {
  // Books & Inventory State
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const stored = localStorage.getItem('vcd_library_books');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BOOKS;
  });

  // Reservations State
  const [reservations, setReservations] = useState<BookReservation[]>(() => {
    try {
      const stored = localStorage.getItem('vcd_library_reservations');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
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
  });

  // UI Tabs & Filters
  const [activeTab, setActiveTab] = useState<'catalog' | 'reservations' | 'info'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Modals
  const [selectedBookForDetails, setSelectedBookForDetails] = useState<Book | null>(null);
  const [selectedBookForReservation, setSelectedBookForReservation] = useState<Book | null>(null);
  const [confirmedReservation, setConfirmedReservation] = useState<BookReservation | null>(null);
  const [reservationSearchMatricula, setReservationSearchMatricula] = useState('');
  const [copiedProtocol, setCopiedProtocol] = useState(false);

  // Reservation Form State
  const [studentName, setStudentName] = useState('');
  const [studentMatricula, setStudentMatricula] = useState('');
  const [studentGrade, setStudentGrade] = useState('1º Ano A - Médio Integral');
  const [studentContact, setStudentContact] = useState('');
  const [studentNotes, setStudentNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Persist books and reservations
  useEffect(() => {
    localStorage.setItem('vcd_library_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('vcd_library_reservations', JSON.stringify(reservations));
  }, [reservations]);

  const categories = [
    'Todos',
    'Literatura Brasileira',
    'Autores do Piauí e Nordeste',
    'ENEM & Vestibulares',
    'Ciências da Natureza',
    'Filosofia & Sociologia',
    'Ficção Juvenil & Contos',
    'Matemática & Tecnologia'
  ];

  // Filtering books
  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'Todos' || b.category === selectedCategory;
    const matchesAvailability = !onlyAvailable || b.availableCopies > 0;

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const totalCopiesCount = books.reduce((acc, curr) => acc + curr.totalCopies, 0);
  const availableCopiesCount = books.reduce((acc, curr) => acc + curr.availableCopies, 0);
  const activeReservationsCount = reservations.filter(
    (r) => r.status === 'Pendente para Retirada' || r.status === 'Retirado / Emprestado'
  ).length;

  // Handle Reservation Submit
  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookForReservation) return;

    if (!studentName.trim() || studentName.trim().length < 3) {
      setFormError('Por favor, informe o nome completo do aluno.');
      return;
    }

    if (!studentMatricula.trim()) {
      setFormError('Informe a matrícula ou número de chamada escolar.');
      return;
    }

    if (selectedBookForReservation.availableCopies <= 0) {
      setFormError('Desculpe, todos os exemplares deste livro já estão emprestados no momento.');
      return;
    }

    // Generate Protocol
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newReservationId = `CETI-LIB-${new Date().getFullYear()}-${randomCode}`;

    const pickupDate = new Date();
    pickupDate.setDate(pickupDate.getDate() + 2); // 48h to pick up

    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 16); // 14 days after pickup

    const newReservation: BookReservation = {
      id: newReservationId,
      bookId: selectedBookForReservation.id,
      bookTitle: selectedBookForReservation.title,
      bookAuthor: selectedBookForReservation.author,
      bookCategory: selectedBookForReservation.category,
      shelfLocation: selectedBookForReservation.shelfLocation,
      studentName: studentName.trim(),
      studentMatricula: studentMatricula.trim(),
      studentGrade: studentGrade,
      studentContact: studentContact.trim() || 'Não informado',
      reservationDate: new Date().toISOString(),
      pickupDeadline: pickupDate.toISOString(),
      returnDeadline: returnDate.toISOString(),
      status: 'Pendente para Retirada',
      notes: studentNotes.trim()
    };

    // Decrement available copies in book catalog
    setBooks((prev) =>
      prev.map((item) =>
        item.id === selectedBookForReservation.id
          ? { ...item, availableCopies: Math.max(0, item.availableCopies - 1) }
          : item
      )
    );

    // Save reservation
    setReservations((prev) => [newReservation, ...prev]);

    // Show voucher
    setConfirmedReservation(newReservation);
    setSelectedBookForReservation(null);
    setFormError('');

    // Reset inputs
    setStudentName('');
    setStudentMatricula('');
    setStudentContact('');
    setStudentNotes('');
  };

  const handleCancelReservation = (reservationId: string, bookId: string) => {
    if (window.confirm('Tem certeza de que deseja cancelar esta reserva? O livro voltará a ficar disponível para outros alunos.')) {
      setReservations((prev) =>
        prev.map((r) => (r.id === reservationId ? { ...r, status: 'Cancelado' } : r))
      );

      // Increment available copy back
      setBooks((prev) =>
        prev.map((b) => (b.id === bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b))
      );
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedProtocol(true);
    setTimeout(() => setCopiedProtocol(false), 2500);
  };

  const printVoucher = () => {
    window.print();
  };

  const filteredStudentReservations = reservations.filter((r) => {
    if (!reservationSearchMatricula.trim()) return true;
    const query = reservationSearchMatricula.toLowerCase();
    return (
      r.studentMatricula.toLowerCase().includes(query) ||
      r.studentName.toLowerCase().includes(query) ||
      r.id.toLowerCase().includes(query) ||
      r.bookTitle.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-slate-100 font-sans">
      
      {/* Top Banner Navigation */}
      <header className="bg-emerald-950/90 backdrop-blur-md border-b border-emerald-800/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-700/60 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Portal</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Biblioteca Digital Escolar</span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-400 text-emerald-950 uppercase tracking-wide">
                    Acervo Oficial
                  </span>
                </h1>
                <p className="text-xs text-emerald-300/80 font-light hidden sm:block">
                  CETI Verônica Celestina Dias · Campo Alegre do Fidalgo - PI
                </p>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('reservations')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95 ${
                activeTab === 'reservations'
                  ? 'bg-emerald-400 text-emerald-950'
                  : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>Minhas Reservas</span>
              {activeReservationsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 text-[11px] font-bold flex items-center justify-center">
                  {activeReservationsCount}
                </span>
              )}
            </button>

            {onOpenAdminLogin && (
              <button
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-300 hover:text-white bg-emerald-950/70 hover:bg-emerald-950 border border-emerald-800/80 transition-colors cursor-pointer"
                title="Gestão da Biblioteca para Professores e Coordenação"
              >
                <span>Gestão</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Section of Digital Library */}
        <section className="bg-gradient-to-r from-emerald-900/90 via-emerald-850/80 to-emerald-950/90 rounded-3xl p-6 sm:p-8 border border-emerald-700/50 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/90 border border-emerald-600/70 text-emerald-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Incentivo à Leitura & Formação Integral</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Consulte o catálogo da escola e reserve seu livro online
            </h2>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-light">
              Os estudantes do <strong className="text-emerald-300 font-semibold">CETI Verônica Celestina Dias</strong> podem pesquisar livros clássicos, títulos para o ENEM, literatura piauiense e ciências, garantindo a reserva do exemplar para retirada rápida na biblioteca da escola.
            </p>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-emerald-950/70 p-3 rounded-2xl border border-emerald-800/60">
                <div className="text-xl sm:text-2xl font-black text-emerald-300">{books.length}</div>
                <div className="text-xs text-emerald-200/80 font-medium">Obras Cadastradas</div>
              </div>
              <div className="bg-emerald-950/70 p-3 rounded-2xl border border-emerald-800/60">
                <div className="text-xl sm:text-2xl font-black text-emerald-300">{availableCopiesCount} / {totalCopiesCount}</div>
                <div className="text-xs text-emerald-200/80 font-medium">Exemplares Livres</div>
              </div>
              <div className="bg-emerald-950/70 p-3 rounded-2xl border border-emerald-800/60">
                <div className="text-xl sm:text-2xl font-black text-emerald-300">14 Dias</div>
                <div className="text-xs text-emerald-200/80 font-medium">Prazo de Empréstimo</div>
              </div>
              <div className="bg-emerald-950/70 p-3 rounded-2xl border border-emerald-800/60">
                <div className="text-xl sm:text-2xl font-black text-emerald-300">48 Horas</div>
                <div className="text-xs text-emerald-200/80 font-medium">Tolerância Retirada</div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs (Catálogo / Minhas Reservas / Regras da Biblioteca) */}
        <div className="flex border-b border-emerald-800/80 gap-2 sm:gap-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-emerald-400 text-emerald-950 shadow-md'
                : 'text-emerald-300 hover:text-white hover:bg-emerald-900/60'
            }`}
          >
            <Library className="w-4 h-4" />
            <span>Catálogo de Livros ({filteredBooks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'reservations'
                ? 'bg-emerald-400 text-emerald-950 shadow-md'
                : 'text-emerald-300 hover:text-white hover:bg-emerald-900/60'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>Consultar Reservas Realizadas</span>
            {reservations.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'reservations' ? 'bg-emerald-950 text-emerald-300' : 'bg-emerald-800 text-emerald-200'
              }`}>
                {reservations.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'info'
                ? 'bg-emerald-400 text-emerald-950 shadow-md'
                : 'text-emerald-300 hover:text-white hover:bg-emerald-900/60'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Regras & Funcionamento</span>
          </button>
        </div>

        {/* TAB 1: CATALOG */}
        {activeTab === 'catalog' && (
          <section className="space-y-6">
            
            {/* Search & Filter Toolbar */}
            <div className="bg-emerald-900/60 p-4 sm:p-5 rounded-2xl border border-emerald-800/80 shadow-lg space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                
                {/* Search Box */}
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquise por título, autor (ex: Machado de Assis, Graciliano Ramos), ENEM, assunto..."
                    className="w-full bg-emerald-950/90 text-white pl-11 pr-4 py-2.5 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-emerald-400/50 text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Available only toggle */}
                <label className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-950/70 border border-emerald-700/60 text-xs sm:text-sm text-emerald-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-emerald-900 border-emerald-700 cursor-pointer"
                  />
                  <span>Somente disponíveis para retirada imediata</span>
                </label>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-emerald-400/80 font-semibold uppercase text-[10px] tracking-wider pl-1 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Categorias:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-emerald-400 text-emerald-950 font-bold shadow-sm'
                        : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-800/80 border border-emerald-800/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Book Cards Grid */}
            {filteredBooks.length === 0 ? (
              <div className="text-center py-16 bg-emerald-900/30 rounded-3xl border border-emerald-800/60 p-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-800/50 flex items-center justify-center text-emerald-300">
                  <FolderOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Nenhum livro encontrado</h3>
                <p className="text-sm text-emerald-300/80 max-w-md mx-auto">
                  Não encontramos títulos para &ldquo;{searchQuery}&rdquo;. Tente buscar por outro termo ou remover os filtros de categoria e disponibilidade.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Todos');
                    setOnlyAvailable(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-400 text-emerald-950 font-bold text-xs hover:bg-emerald-300 transition-colors cursor-pointer"
                >
                  Limpar todos os filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => {
                  const isAvailable = book.availableCopies > 0;
                  return (
                    <article
                      key={book.id}
                      className="bg-emerald-950/80 rounded-2xl border border-emerald-800/70 overflow-hidden shadow-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between group"
                    >
                      {/* Top Spine / Visual Header */}
                      <div className={`p-4 bg-gradient-to-r ${book.coverGradient} border-b border-white/10 relative`}>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[11px] font-semibold tracking-wide text-emerald-200 uppercase bg-black/40 px-2.5 py-0.5 rounded-full border border-white/10">
                            {book.category}
                          </span>
                          {book.badge && (
                            <span className="text-[10px] font-bold text-emerald-950 bg-emerald-300 px-2 py-0.5 rounded-full shadow-sm">
                              {book.badge}
                            </span>
                          )}
                        </div>

                        <div className="mt-3">
                          <h3 className="text-lg font-bold text-white leading-snug group-hover:text-emerald-200 transition-colors">
                            {book.title}
                          </h3>
                          <p className="text-xs text-emerald-200 font-medium mt-0.5">
                            {book.author}
                          </p>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 space-y-3.5 flex-grow flex flex-col justify-between">
                        
                        <div className="space-y-2.5">
                          <p className="text-xs text-emerald-100/80 line-clamp-3 leading-relaxed">
                            {book.synopsis}
                          </p>

                          {/* Shelf and Location */}
                          <div className="bg-emerald-900/40 p-2 rounded-xl border border-emerald-800/50 text-[11px] space-y-1">
                            <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="truncate">{book.shelfLocation}</span>
                            </div>
                            <div className="flex items-center justify-between text-emerald-400/80 text-[10px] pt-0.5">
                              <span>Ano: {book.year} · {book.pages} págs.</span>
                              <span>ISBN: {book.isbn}</span>
                            </div>
                          </div>
                        </div>

                        {/* Stock & Availability status */}
                        <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-between gap-2">
                          <div>
                            {isAvailable ? (
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>{book.availableCopies} {book.availableCopies === 1 ? 'exemplar disponível' : 'exemplares disponíveis'}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-300">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                                <span>Todos exemplares emprestados</span>
                              </div>
                            )}
                          </div>

                          <span className="text-[10px] text-emerald-400/80">
                            Total: {book.totalCopies}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="pt-1 grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setSelectedBookForDetails(book)}
                            className="w-full py-2 px-2.5 rounded-xl text-xs font-semibold text-emerald-200 bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-700/60 transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                          >
                            <Info className="w-3.5 h-3.5" />
                            <span>Ver Detalhes</span>
                          </button>

                          <button
                            onClick={() => setSelectedBookForReservation(book)}
                            disabled={!isAvailable}
                            className={`w-full py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm ${
                              isAvailable
                                ? 'bg-emerald-400 hover:bg-emerald-300 text-emerald-950'
                                : 'bg-emerald-900/40 text-emerald-500 border border-emerald-800/40 cursor-not-allowed'
                            }`}
                          >
                            <BookmarkCheck className="w-3.5 h-3.5" />
                            <span>{isAvailable ? 'Reservar Livro' : 'Indisponível'}</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: RESERVATIONS CONSULTATION */}
        {activeTab === 'reservations' && (
          <section className="space-y-6">
            <div className="bg-emerald-900/60 p-5 rounded-3xl border border-emerald-800/80 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <BookmarkCheck className="w-5 h-5 text-emerald-300" />
                    <span>Minhas Reservas na Biblioteca</span>
                  </h3>
                  <p className="text-xs text-emerald-300/80">
                    Localize sua reserva através da matrícula, nome do aluno ou código do protocolo.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-400 text-emerald-950 font-semibold text-xs hover:bg-emerald-300 transition-colors cursor-pointer"
                >
                  + Reservar Novo Livro
                </button>
              </div>

              {/* Filter by Matrícula / Student */}
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                <input
                  type="text"
                  value={reservationSearchMatricula}
                  onChange={(e) => setReservationSearchMatricula(e.target.value)}
                  placeholder="Filtrar por Matrícula (ex: 2024-VCD-...), Nome do Aluno ou Livro..."
                  className="w-full bg-emerald-950/90 text-white pl-11 pr-4 py-2.5 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-emerald-400/50 text-sm"
                />
              </div>
            </div>

            {filteredStudentReservations.length === 0 ? (
              <div className="text-center py-16 bg-emerald-900/30 rounded-3xl border border-emerald-800/60 p-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-800/50 flex items-center justify-center text-emerald-300">
                  <Bookmark className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">Nenhuma reserva encontrada</h4>
                <p className="text-sm text-emerald-300/80 max-w-md mx-auto">
                  Não localizamos nenhuma reserva com o termo pesquisado. Você pode pesquisar pelo acervo e reservar um exemplar agora mesmo.
                </p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-400 text-emerald-950 font-bold text-xs hover:bg-emerald-300 transition-colors cursor-pointer"
                >
                  Abrir Catálogo de Livros
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStudentReservations.map((res) => {
                  const isPending = res.status === 'Pendente para Retirada';
                  const isBorrowed = res.status === 'Retirado / Emprestado';
                  const isReturned = res.status === 'Devolvido';
                  const isCancelled = res.status === 'Cancelado';

                  return (
                    <div
                      key={res.id}
                      className="bg-emerald-950/80 p-5 rounded-2xl border border-emerald-800/70 shadow-lg space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/60 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-700/60">
                              {res.id}
                            </span>
                            <span className="text-xs text-emerald-400/80">
                              Data: {new Date(res.reservationDate).toLocaleDateString('pt-BR')} às {new Date(res.reservationDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <h4 className="text-base sm:text-lg font-bold text-white mt-1">
                            {res.bookTitle}
                          </h4>
                          <p className="text-xs text-emerald-300">Autor: {res.bookAuthor} · {res.bookCategory}</p>
                        </div>

                        <div>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              isPending
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                : isBorrowed
                                ? 'bg-blue-400/20 text-blue-300 border border-blue-400/40'
                                : isReturned
                                ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                                : 'bg-rose-400/20 text-rose-300 border border-rose-400/40'
                            }`}
                          >
                            {isPending && <Clock className="w-3.5 h-3.5" />}
                            {isBorrowed && <BookCheck className="w-3.5 h-3.5" />}
                            {isReturned && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {isCancelled && <AlertCircle className="w-3.5 h-3.5" />}
                            <span>{res.status}</span>
                          </span>
                        </div>
                      </div>

                      {/* Details row */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="bg-emerald-900/40 p-3 rounded-xl border border-emerald-800/50">
                          <span className="text-emerald-400/80 block font-medium">Aluno(a) Solicitante:</span>
                          <span className="font-bold text-white text-sm">{res.studentName}</span>
                          <div className="text-emerald-300/80 mt-0.5">Matrícula: {res.studentMatricula}</div>
                          <div className="text-emerald-300/80">Turma: {res.studentGrade}</div>
                        </div>

                        <div className="bg-emerald-900/40 p-3 rounded-xl border border-emerald-800/50">
                          <span className="text-emerald-400/80 block font-medium">Localização no CETI:</span>
                          <span className="font-semibold text-emerald-200">{res.shelfLocation}</span>
                          <div className="text-emerald-300/80 mt-1">Contato: {res.studentContact}</div>
                        </div>

                        <div className="bg-emerald-900/40 p-3 rounded-xl border border-emerald-800/50">
                          <span className="text-emerald-400/80 block font-medium">Prazo para Retirada:</span>
                          <span className="font-bold text-amber-300">
                            Até {new Date(res.pickupDeadline).toLocaleDateString('pt-BR')} (48 horas úteis)
                          </span>
                          <div className="text-emerald-300/80 mt-1 text-[11px]">
                            Apresente a matrícula ou este comprovante na biblioteca física do CETI.
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-800/50">
                        <button
                          onClick={() => copyToClipboard(res.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold border border-emerald-700/60 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Protocolo</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setConfirmedReservation(res)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-emerald-950 text-xs font-bold cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Ver Comprovante Oficial</span>
                          </button>

                          {isPending && (
                            <button
                              onClick={() => handleCancelReservation(res.id, res.bookId)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-200 text-xs font-semibold border border-rose-800/60 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Cancelar Reserva</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* TAB 3: RULES & LIBRARY INFORMATION */}
        {activeTab === 'info' && (
          <section className="space-y-6">
            <div className="bg-emerald-950/80 p-6 sm:p-8 rounded-3xl border border-emerald-800/80 shadow-xl space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Library className="w-6 h-6 text-emerald-300" />
                  <span>Regulamento & Funcionamento da Biblioteca Escolar</span>
                </h3>
                <p className="text-xs sm:text-sm text-emerald-300/80 mt-1">
                  Espaço de aprendizagem, pesquisa e cidadania do CETI Verônica Celestina Dias
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Rules Card 1 */}
                <div className="bg-emerald-900/40 p-5 rounded-2xl border border-emerald-800/60 space-y-3">
                  <h4 className="font-bold text-base text-emerald-200 flex items-center gap-2">
                    <BookCheck className="w-5 h-5 text-emerald-400" />
                    <span>Regras de Empréstimo e Devolução</span>
                  </h4>
                  <ul className="text-xs text-emerald-100/90 space-y-2 list-disc list-inside leading-relaxed">
                    <li><strong className="text-white">Prazo de Empréstimo:</strong> 14 (quatorze) dias corridos para cada exemplar.</li>
                    <li><strong className="text-white">Renovação:</strong> Permitida até 2 (duas) vezes, desde que não haja fila de espera para a obra.</li>
                    <li><strong className="text-white">Limite por Aluno:</strong> Cada estudante pode reservar até 2 (dois) livros simultaneamente.</li>
                    <li><strong className="text-white">Retirada da Reserva:</strong> O aluno tem até 48 horas úteis após a reserva online para buscar o exemplar no balcão da biblioteca.</li>
                  </ul>
                </div>

                {/* Rules Card 2 */}
                <div className="bg-emerald-900/40 p-5 rounded-2xl border border-emerald-800/60 space-y-3">
                  <h4 className="font-bold text-base text-emerald-200 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-400" />
                    <span>Ambiente e Cuidados com o Acervo</span>
                  </h4>
                  <ul className="text-xs text-emerald-100/90 space-y-2 list-disc list-inside leading-relaxed">
                    <li><strong className="text-white">Silêncio e Respeito:</strong> A biblioteca é espaço prioritário para leitura e estudos individuais ou em pequenos grupos.</li>
                    <li><strong className="text-white">Preservação do Acervo:</strong> Não sublinhar com caneta, não dobrar páginas nem danificar as capas. Os livros pertencem a toda a comunidade escolar.</li>
                    <li><strong className="text-white">Computadores para Pesquisa:</strong> Estão disponíveis para realização de trabalhos acadêmicos e pesquisas do ENEM.</li>
                    <li><strong className="text-white">Apoio Pedagógico:</strong> Os professores e coordenadores estão disponíveis para auxiliar na escolha de leituras e projetos interdisciplinares.</li>
                  </ul>
                </div>
              </div>

              {/* Physical space details */}
              <div className="bg-emerald-900/30 p-4 rounded-2xl border border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>Localização: Pavilhão Pedagógico · Sala 04</span>
                  </div>
                  <p className="text-xs text-emerald-300/80">
                    Horário: Segunda a Sexta, das 07h15 às 17h00 (Regime de Tempo Integral)
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-sm"
                >
                  Explorar Acervo Agora
                </button>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* MODAL 1: BOOK DETAILS */}
      {selectedBookForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-emerald-950 border border-emerald-700/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedBookForDetails(null)}
              className="absolute right-4 top-4 text-emerald-400 hover:text-white p-1 rounded-lg bg-emerald-900/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`p-4 rounded-2xl bg-gradient-to-r ${selectedBookForDetails.coverGradient} border border-white/10`}>
              <span className="text-[10px] font-bold text-emerald-950 bg-emerald-300 px-2 py-0.5 rounded-full">
                {selectedBookForDetails.category}
              </span>
              <h3 className="text-xl font-bold text-white mt-2 leading-snug">
                {selectedBookForDetails.title}
              </h3>
              <p className="text-xs text-emerald-200 font-medium">
                {selectedBookForDetails.author}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-bold text-emerald-300 uppercase text-[10px] tracking-wider">Sinopse da Obra:</h4>
                <p className="text-emerald-100/90 leading-relaxed mt-1">
                  {selectedBookForDetails.synopsis}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-emerald-900/50 p-3 rounded-2xl border border-emerald-800/60">
                <div>
                  <span className="text-emerald-400/80 block text-[10px]">Indicação:</span>
                  <span className="font-semibold text-white">{selectedBookForDetails.recommendedGrade}</span>
                </div>
                <div>
                  <span className="text-emerald-400/80 block text-[10px]">Editora / Acervo:</span>
                  <span className="font-semibold text-white">{selectedBookForDetails.publisher}</span>
                </div>
                <div>
                  <span className="text-emerald-400/80 block text-[10px]">ISBN:</span>
                  <span className="font-semibold text-white">{selectedBookForDetails.isbn}</span>
                </div>
                <div>
                  <span className="text-emerald-400/80 block text-[10px]">Páginas / Ano:</span>
                  <span className="font-semibold text-white">{selectedBookForDetails.pages} páginas · {selectedBookForDetails.year}</span>
                </div>
              </div>

              <div className="bg-emerald-900/40 p-3 rounded-2xl border border-emerald-800/50 flex items-center justify-between">
                <div>
                  <span className="text-emerald-400/80 block text-[10px]">Localização na Estante:</span>
                  <span className="font-bold text-emerald-200 text-xs">{selectedBookForDetails.shelfLocation}</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400/80 block text-[10px]">Disponibilidade:</span>
                  <span className="font-bold text-emerald-300 text-xs">
                    {selectedBookForDetails.availableCopies} de {selectedBookForDetails.totalCopies} disponíveis
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedBookForDetails.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-emerald-900 text-emerald-300 text-[10px] border border-emerald-700/50">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center gap-2 border-t border-emerald-800/60">
              <button
                onClick={() => setSelectedBookForDetails(null)}
                className="w-1/3 py-2.5 rounded-xl bg-emerald-900/70 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Fechar
              </button>

              <button
                onClick={() => {
                  const bookToReserve = selectedBookForDetails;
                  setSelectedBookForDetails(null);
                  setSelectedBookForReservation(bookToReserve);
                }}
                disabled={selectedBookForDetails.availableCopies <= 0}
                className={`w-2/3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                  selectedBookForDetails.availableCopies > 0
                    ? 'bg-emerald-400 hover:bg-emerald-300 text-emerald-950'
                    : 'bg-emerald-900/50 text-emerald-500 cursor-not-allowed'
                }`}
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>{selectedBookForDetails.availableCopies > 0 ? 'Prosseguir para Reserva' : 'Exemplar Indisponível'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: RESERVATION FORM */}
      {selectedBookForReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-emerald-950 border border-emerald-700/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedBookForReservation(null)}
              className="absolute right-4 top-4 text-emerald-400 hover:text-white p-1 rounded-lg bg-emerald-900/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 text-[10px] font-bold uppercase">
                <BookmarkCheck className="w-3 h-3 text-emerald-400" />
                Formulário de Reserva Escolar
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                Reservar Exemplar
              </h3>
              <p className="text-xs text-emerald-300/80">
                Preencha seus dados de estudante para assegurar a reserva do livro.
              </p>
            </div>

            {/* Selected Book summary banner */}
            <div className="bg-emerald-900/50 p-3.5 rounded-2xl border border-emerald-800/70 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white">{selectedBookForReservation.title}</h4>
                <p className="text-xs text-emerald-300 font-medium">{selectedBookForReservation.author}</p>
                <p className="text-[11px] text-emerald-400/80 mt-0.5">{selectedBookForReservation.shelfLocation}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-emerald-300/80 block">Disponíveis:</span>
                <span className="text-sm font-bold text-emerald-300">{selectedBookForReservation.availableCopies} un.</span>
              </div>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-700/60 text-xs text-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleReserveSubmit} className="space-y-3.5 text-xs">
              
              <div>
                <label className="block text-emerald-200 font-medium mb-1">
                  Nome Completo do(a) Aluno(a) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Ex: Maria Eduarda Silva"
                    className="w-full bg-emerald-900/70 text-white pl-9 pr-3 py-2 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-200 font-medium mb-1">
                    Matrícula Escolar <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentMatricula}
                    onChange={(e) => setStudentMatricula(e.target.value)}
                    placeholder="Ex: 2024-VCD-1234"
                    className="w-full bg-emerald-900/70 text-white px-3 py-2 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-emerald-200 font-medium mb-1">
                    Turma / Ano
                  </label>
                  <select
                    value={studentGrade}
                    onChange={(e) => setStudentGrade(e.target.value)}
                    className="w-full bg-emerald-900/70 text-white px-3 py-2 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs"
                  >
                    <option value="1º Ano A - Médio Integral">1º Ano A - Médio Integral</option>
                    <option value="1º Ano B - Médio Integral">1º Ano B - Médio Integral</option>
                    <option value="2º Ano A - Médio Integral">2º Ano A - Médio Integral</option>
                    <option value="2º Ano B - Médio Integral">2º Ano B - Médio Integral</option>
                    <option value="3º Ano A - Médio Integral">3º Ano A - Médio Integral</option>
                    <option value="3º Ano B - Médio Integral">3º Ano B - Médio Integral</option>
                    <option value="Curso Técnico Integrado">Curso Técnico Integrado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-emerald-200 font-medium mb-1">
                  WhatsApp / Telefone para aviso de retirada (Opcional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="tel"
                    value={studentContact}
                    onChange={(e) => setStudentContact(e.target.value)}
                    placeholder="(89) 9XXXX-XXXX"
                    className="w-full bg-emerald-900/70 text-white pl-9 pr-3 py-2 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-emerald-200 font-medium mb-1">
                  Observações adicionais para a biblioteca (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                  placeholder="Ex: Trabalho de literatura com a professora; retirada no intervalo da manhã..."
                  className="w-full bg-emerald-900/70 text-white p-2.5 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs resize-none"
                />
              </div>

              <div className="bg-emerald-900/40 p-3 rounded-xl border border-emerald-800/50 text-[11px] text-emerald-300/90 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-200">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Atenção ao Prazo de Retirada:</span>
                </div>
                <p>
                  Após confirmar, você terá <strong className="text-white">48 horas úteis</strong> para retirar o livro na Biblioteca do CETI. Apresente o protocolo ou seu número de matrícula.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookForReservation(null)}
                  className="w-1/3 py-2.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                >
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Confirmar e Gerar Comprovante</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: OFFICIAL RESERVATION VOUCHER / RECEIPT */}
      {confirmedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-emerald-950 border border-emerald-600/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto print:bg-white print:text-black">
            
            <button
              onClick={() => setConfirmedReservation(null)}
              className="absolute right-4 top-4 text-emerald-400 hover:text-white p-1 rounded-lg bg-emerald-900/60 cursor-pointer print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Voucher */}
            <div className="text-center space-y-1 border-b border-emerald-800/80 pb-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 mb-2">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">
                Reserva Confirmada com Sucesso!
              </h3>
              <p className="text-xs text-emerald-300 font-medium">
                Comprovante Digital de Reserva Escolar · CETI Verônica Celestina Dias
              </p>
            </div>

            {/* Protocol Box */}
            <div className="bg-emerald-900/70 p-4 rounded-2xl border border-emerald-700/60 text-center space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-300">
                Número do Protocolo Oficial:
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-lg sm:text-xl font-black text-white tracking-wider">
                  {confirmedReservation.id}
                </span>
                <button
                  onClick={() => copyToClipboard(confirmedReservation.id)}
                  className="p-1 rounded bg-emerald-800 text-emerald-300 hover:text-white text-xs cursor-pointer print:hidden"
                  title="Copiar código"
                >
                  {copiedProtocol ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {copiedProtocol && (
                <span className="text-[10px] text-emerald-300 block font-medium">Código copiado para a área de transferência!</span>
              )}
            </div>

            {/* Receipt Details Table */}
            <div className="bg-emerald-950/90 rounded-2xl border border-emerald-800/70 p-4 space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-emerald-800/50 pb-1.5">
                <span className="text-emerald-400/80">Livro Selecionado:</span>
                <span className="font-bold text-white text-right">{confirmedReservation.bookTitle}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-800/50 pb-1.5">
                <span className="text-emerald-400/80">Autor:</span>
                <span className="font-medium text-emerald-200">{confirmedReservation.bookAuthor}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-800/50 pb-1.5">
                <span className="text-emerald-400/80">Localização Física:</span>
                <span className="font-semibold text-emerald-300 text-right">{confirmedReservation.shelfLocation}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-800/50 pb-1.5">
                <span className="text-emerald-400/80">Aluno(a):</span>
                <span className="font-bold text-white">{confirmedReservation.studentName}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-800/50 pb-1.5">
                <span className="text-emerald-400/80">Matrícula / Turma:</span>
                <span className="font-mono text-emerald-200">{confirmedReservation.studentMatricula} ({confirmedReservation.studentGrade})</span>
              </div>
              <div className="flex justify-between border-b border-emerald-800/50 pb-1.5">
                <span className="text-emerald-400/80">Data da Reserva:</span>
                <span className="text-emerald-200">{new Date(confirmedReservation.reservationDate).toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-300 font-bold">Prazo Limite Retirada:</span>
                <span className="font-bold text-amber-300">
                  {new Date(confirmedReservation.pickupDeadline).toLocaleDateString('pt-BR')} (48 horas úteis)
                </span>
              </div>
            </div>

            {/* Next step instruction */}
            <div className="bg-emerald-900/40 p-3 rounded-2xl border border-emerald-800/60 text-[11px] text-emerald-200 space-y-1">
              <strong className="text-emerald-300 block">Como retirar seu livro:</strong>
              <p>
                Dirija-se à biblioteca física da escola durante o horário de aula ou nos intervalos e informe sua matrícula <code className="bg-emerald-950 px-1 py-0.5 rounded text-white">{confirmedReservation.studentMatricula}</code> ou apresente este comprovante.
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 print:hidden">
              <button
                onClick={printVoucher}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold border border-emerald-700/60 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Comprovante</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setConfirmedReservation(null);
                    setActiveTab('reservations');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  Ver em Minhas Reservas
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
