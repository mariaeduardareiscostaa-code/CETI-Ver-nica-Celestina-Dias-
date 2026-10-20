import React, { useState, useEffect, useRef } from 'react';
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
  FolderOpen,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  Edit3,
  ShieldCheck,
  Lock,
  KeyRound,
  ExternalLink,
  Eye,
  Sliders
} from 'lucide-react';
import { Book, BookReservation, INITIAL_BOOKS, PRESET_BOOK_COVERS, PresetCover } from '../data/libraryBooks';

interface DigitalLibraryPageProps {
  onBackToHome: () => void;
  onOpenAdminLogin?: () => void;
}

export default function DigitalLibraryPage({ onBackToHome, onOpenAdminLogin }: DigitalLibraryPageProps) {
  // Management Auth & Mode
  const [isManagementMode, setIsManagementMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vcd_admin_logged_in') === 'true';
    } catch {
      return false;
    }
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');

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
  const [activeTab, setActiveTab] = useState<'catalog' | 'reservations' | 'management' | 'info'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Feedback Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Modals
  const [selectedBookForDetails, setSelectedBookForDetails] = useState<Book | null>(null);
  const [selectedBookForReservation, setSelectedBookForReservation] = useState<Book | null>(null);
  const [confirmedReservation, setConfirmedReservation] = useState<BookReservation | null>(null);
  const [reservationSearchMatricula, setReservationSearchMatricula] = useState('');
  const [copiedProtocol, setCopiedProtocol] = useState(false);

  // Management Modals: Add Book / Edit Book / Delete Book / Manage Cover
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [bookForCoverChange, setBookForCoverChange] = useState<Book | null>(null);

  // Add/Edit Book Form State
  const [bookFormTitle, setBookFormTitle] = useState('');
  const [bookFormAuthor, setBookFormAuthor] = useState('');
  const [bookFormCategory, setBookFormCategory] = useState<string>('Literatura Brasileira');
  const [bookFormIsbn, setBookFormIsbn] = useState('');
  const [bookFormYear, setBookFormYear] = useState<number>(new Date().getFullYear());
  const [bookFormPages, setBookFormPages] = useState<number>(200);
  const [bookFormPublisher, setBookFormPublisher] = useState('');
  const [bookFormSynopsis, setBookFormSynopsis] = useState('');
  const [bookFormShelfLocation, setBookFormShelfLocation] = useState('Estante 01 · Prateleira A');
  const [bookFormTotalCopies, setBookFormTotalCopies] = useState<number>(5);
  const [bookFormCoverGradient, setBookFormCoverGradient] = useState('from-emerald-700 to-emerald-950');
  const [bookFormCoverImage, setBookFormCoverImage] = useState<string>('');
  const [bookFormBadge, setBookFormBadge] = useState('');
  const [bookFormRecommendedGrade, setBookFormRecommendedGrade] = useState('1º ao 3º Ano do Ensino Médio');
  const [bookFormTags, setBookFormTags] = useState('');
  const [bookFormError, setBookFormError] = useState('');

  // Quick Cover Edit State
  const [coverUrlInput, setCoverUrlInput] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addModalFileInputRef = useRef<HTMLInputElement>(null);

  // Reservation Form State
  const [studentName, setStudentName] = useState('');
  const [studentMatricula, setStudentMatricula] = useState('');
  const [studentGrade, setStudentGrade] = useState('1º Ano A - Médio Integral');
  const [studentContact, setStudentContact] = useState('');
  const [studentNotes, setStudentNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Persist books and reservations
  useEffect(() => {
    try {
      localStorage.setItem('vcd_library_books', JSON.stringify(books));
    } catch (e) {
      console.error('Failed to save books to localStorage:', e);
    }
  }, [books]);

  useEffect(() => {
    try {
      localStorage.setItem('vcd_library_reservations', JSON.stringify(reservations));
    } catch (e) {
      console.error('Failed to save reservations to localStorage:', e);
    }
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

  const totalCopiesCount = books.reduce((acc, curr) => acc + (curr.totalCopies || 0), 0);
  const availableCopiesCount = books.reduce((acc, curr) => acc + (curr.availableCopies || 0), 0);
  const activeReservationsCount = reservations.filter(
    (r) => r.status === 'Pendente para Retirada' || r.status === 'Retirado / Emprestado'
  ).length;

  // Management Authentication
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput.trim() === '12345') {
      setIsManagementMode(true);
      localStorage.setItem('vcd_admin_logged_in', 'true');
      setShowAdminLoginModal(false);
      setAdminPasswordInput('');
      setAdminLoginError('');
      showToast('Modo de Gestão da Biblioteca ativado com sucesso!');
    } else {
      setAdminLoginError('Chave de acesso inválida. Dica institucional: 12345');
    }
  };

  const handleLogoutManagement = () => {
    setIsManagementMode(false);
    localStorage.removeItem('vcd_admin_logged_in');
    if (activeTab === 'management') {
      setActiveTab('catalog');
    }
    showToast('Modo de Gestão desativado.');
  };

  // Image Upload helper (converts to base64 data URL)
  const handleImageFileSelect = (file: File, callback: (dataUrl: string) => void) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecione um arquivo de imagem válido (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      alert('A imagem é muito grande. Escolha uma imagem de até 4MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        callback(result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Open Add Book Modal
  const handleOpenAddBook = () => {
    setBookToEdit(null);
    setBookFormTitle('');
    setBookFormAuthor('');
    setBookFormCategory('Literatura Brasileira');
    setBookFormIsbn(`978-85-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}-${Math.floor(1 + Math.random() * 9)}`);
    setBookFormYear(new Date().getFullYear());
    setBookFormPages(220);
    setBookFormPublisher('Acervo Escolar CETI VCD / SEDUC-PI');
    setBookFormSynopsis('');
    setBookFormShelfLocation('Estante 01 · Prateleira A (Acervo Geral)');
    setBookFormTotalCopies(5);
    setBookFormCoverGradient('from-emerald-700 to-emerald-950');
    setBookFormCoverImage('');
    setBookFormBadge('Novo no Acervo');
    setBookFormRecommendedGrade('Ensino Médio Integral');
    setBookFormTags('Literatura, Ensino Médio');
    setBookFormError('');
    setShowAddBookModal(true);
  };

  // Open Edit Book Modal
  const handleOpenEditBook = (book: Book) => {
    setBookToEdit(book);
    setBookFormTitle(book.title);
    setBookFormAuthor(book.author);
    setBookFormCategory(book.category);
    setBookFormIsbn(book.isbn);
    setBookFormYear(book.year);
    setBookFormPages(book.pages);
    setBookFormPublisher(book.publisher);
    setBookFormSynopsis(book.synopsis);
    setBookFormShelfLocation(book.shelfLocation);
    setBookFormTotalCopies(book.totalCopies);
    setBookFormCoverGradient(book.coverGradient || 'from-emerald-700 to-emerald-950');
    setBookFormCoverImage(book.coverImage || '');
    setBookFormBadge(book.badge || '');
    setBookFormRecommendedGrade(book.recommendedGrade);
    setBookFormTags(book.tags.join(', '));
    setBookFormError('');
    setShowAddBookModal(true);
  };

  // Submit Add or Edit Book
  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookFormTitle.trim()) {
      setBookFormError('Por favor informe o título da obra.');
      return;
    }
    if (!bookFormAuthor.trim()) {
      setBookFormError('Por favor informe o autor da obra.');
      return;
    }
    if (bookFormTotalCopies < 1) {
      setBookFormError('A quantidade de exemplares deve ser de pelo menos 1.');
      return;
    }

    const tagList = bookFormTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (bookToEdit) {
      // Update existing book
      const differenceInTotal = bookFormTotalCopies - bookToEdit.totalCopies;
      const updatedAvailable = Math.max(0, bookToEdit.availableCopies + differenceInTotal);

      const updatedBook: Book = {
        ...bookToEdit,
        title: bookFormTitle.trim(),
        author: bookFormAuthor.trim(),
        category: bookFormCategory as Book['category'],
        isbn: bookFormIsbn.trim() || bookToEdit.isbn,
        year: Number(bookFormYear) || bookToEdit.year,
        pages: Number(bookFormPages) || bookToEdit.pages,
        publisher: bookFormPublisher.trim() || bookToEdit.publisher,
        synopsis: bookFormSynopsis.trim() || 'Obra disponível para consulta e empréstimo na biblioteca do CETI.',
        shelfLocation: bookFormShelfLocation.trim() || bookToEdit.shelfLocation,
        totalCopies: Number(bookFormTotalCopies),
        availableCopies: updatedAvailable,
        coverGradient: bookFormCoverGradient,
        coverImage: bookFormCoverImage.trim() || undefined,
        badge: bookFormBadge.trim() || undefined,
        recommendedGrade: bookFormRecommendedGrade.trim(),
        tags: tagList.length > 0 ? tagList : bookToEdit.tags
      };

      setBooks((prev) => prev.map((b) => (b.id === bookToEdit.id ? updatedBook : b)));
      showToast(`Livro "${updatedBook.title}" atualizado com sucesso!`);
    } else {
      // Add new book
      const newBookId = `book-${Date.now().toString().slice(-6)}`;
      const newBook: Book = {
        id: newBookId,
        title: bookFormTitle.trim(),
        author: bookFormAuthor.trim(),
        category: bookFormCategory as Book['category'],
        isbn: bookFormIsbn.trim() || `978-85-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}-0`,
        year: Number(bookFormYear) || new Date().getFullYear(),
        pages: Number(bookFormPages) || 150,
        publisher: bookFormPublisher.trim() || 'Editora Escolar CETI',
        synopsis: bookFormSynopsis.trim() || 'Obra cadastrada pela equipe pedagógica para leitura e consulta dos alunos do CETI Verônica Celestina Dias.',
        shelfLocation: bookFormShelfLocation.trim() || 'Estante 01 · Prateleira A (Geral)',
        totalCopies: Number(bookFormTotalCopies),
        availableCopies: Number(bookFormTotalCopies),
        coverGradient: bookFormCoverGradient,
        coverImage: bookFormCoverImage.trim() || undefined,
        badge: bookFormBadge.trim() || 'Novo no Acervo',
        recommendedGrade: bookFormRecommendedGrade.trim() || 'Ensino Médio',
        rating: 5.0,
        tags: tagList.length > 0 ? tagList : ['Acervo Escolar', 'Leitura']
      };

      setBooks((prev) => [newBook, ...prev]);
      showToast(`Livro "${newBook.title}" adicionado ao catálogo com sucesso!`);
    }

    setShowAddBookModal(false);
    setBookToEdit(null);
  };

  // Open Cover Management Modal
  const handleOpenCoverModal = (book: Book) => {
    setBookForCoverChange(book);
    setCoverUrlInput(book.coverImage || '');
    setCoverPreview(book.coverImage || '');
  };

  // Save Book Cover
  const handleSaveCover = () => {
    if (!bookForCoverChange) return;

    const newCover = coverPreview.trim();
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookForCoverChange.id
          ? { ...b, coverImage: newCover ? newCover : undefined }
          : b
      )
    );

    // Also update selectedBookForDetails if open
    if (selectedBookForDetails && selectedBookForDetails.id === bookForCoverChange.id) {
      setSelectedBookForDetails({
        ...selectedBookForDetails,
        coverImage: newCover ? newCover : undefined
      });
    }

    showToast(`Capa do livro "${bookForCoverChange.title}" atualizada com sucesso!`);
    setBookForCoverChange(null);
    setCoverUrlInput('');
    setCoverPreview('');
  };

  // Confirm Delete Book
  const handleConfirmDeleteBook = () => {
    if (!bookToDelete) return;

    // Check if there are active reservations
    const hasActiveReservations = reservations.some(
      (r) => r.bookId === bookToDelete.id && (r.status === 'Pendente para Retirada' || r.status === 'Retirado / Emprestado')
    );

    if (hasActiveReservations) {
      const proceed = window.confirm(
        `Atenção: Este livro possui reservas ativas em andamento. Deseja realmente remover "${bookToDelete.title}" do catálogo? As reservas existentes serão mantidas no histórico.`
      );
      if (!proceed) return;
    }

    setBooks((prev) => prev.filter((b) => b.id !== bookToDelete.id));
    showToast(`Livro "${bookToDelete.title}" removido do catálogo com sucesso.`);
    setBookToDelete(null);

    if (selectedBookForDetails && selectedBookForDetails.id === bookToDelete.id) {
      setSelectedBookForDetails(null);
    }
  };

  // Restore Default Catalog
  const handleRestoreInitialBooks = () => {
    const confirmRestore = window.confirm(
      'Deseja restaurar o catálogo de livros padrão inicial da escola? Seus livros adicionados recentemente serão mesclados com o acervo base.'
    );
    if (!confirmRestore) return;

    // Merge without duplicates by title
    setBooks((current) => {
      const existingTitles = new Set(current.map((b) => b.title.toLowerCase().trim()));
      const toAdd = INITIAL_BOOKS.filter((b) => !existingTitles.has(b.title.toLowerCase().trim()));
      const merged = [...current, ...toAdd];
      localStorage.setItem('vcd_library_books', JSON.stringify(merged));
      return merged;
    });

    showToast('Acervo padrão sincronizado com sucesso!');
  };

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
    showToast('Reserva realizada com sucesso! Protocolo gerado.');
  };

  const handleCancelReservation = (reservationId: string, bookId: string) => {
    if (window.confirm('Tem certeza de que deseja cancelar esta reserva? O livro voltará a ficar disponível para outros alunos.')) {
      setReservations((prev) =>
        prev.map((r) => (r.id === reservationId ? { ...r, status: 'Cancelado' } : r))
      );

      // Increment available copy back
      setBooks((prev) =>
        prev.map((b) => (b.id === bookId ? { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) } : b))
      );
      showToast('Reserva cancelada com sucesso.');
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
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-400 text-emerald-950 font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-300 border border-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-950 shrink-0" />
          <span className="text-xs sm:text-sm">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-emerald-950/70 hover:text-emerald-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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

            {/* Management Mode Button */}
            {isManagementMode ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleOpenAddBook}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-950 bg-emerald-300 hover:bg-emerald-200 shadow-md transition-all active:scale-95 cursor-pointer"
                  title="Cadastrar novo livro no catálogo escolar"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Adicionar Livro</span>
                </button>

                <button
                  onClick={() => setActiveTab('management')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'management'
                      ? 'bg-amber-400 text-stone-950 font-bold'
                      : 'bg-amber-500/20 text-amber-200 border border-amber-400/40 hover:bg-amber-500/30'
                  }`}
                  title="Painel de controle do acervo"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Gestão Ativa</span>
                </button>

                <button
                  onClick={handleLogoutManagement}
                  className="p-1.5 rounded-lg text-xs font-medium text-emerald-400 hover:text-white bg-emerald-900/60 hover:bg-emerald-900 transition-colors cursor-pointer"
                  title="Desativar modo de gestão"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAdminLoginModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700/60 transition-colors cursor-pointer"
                title="Acesso da Gestão: Adicionar e remover livros do acervo, além de adicionar capas"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Modo Gestão</span>
              </button>
            )}

            {onOpenAdminLogin && (
              <button
                onClick={onOpenAdminLogin}
                className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-400 hover:text-white hover:bg-emerald-900/50 transition-colors cursor-pointer"
                title="Painel Geral Administrativo CETI"
              >
                <span>Portal Geral</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Management Mode Alert Ribbon (if active) */}
        {isManagementMode && (
          <div className="bg-gradient-to-r from-amber-500/20 via-emerald-800/40 to-amber-500/20 border border-amber-400/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400/30 border border-amber-300/50 flex items-center justify-center text-amber-200 shrink-0">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Modo Gestão da Biblioteca Ativo</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black uppercase">
                    Coordenação & Bibliotecário
                  </span>
                </h3>
                <p className="text-xs text-emerald-200/90 font-light">
                  Você pode <strong>adicionar novos títulos</strong>, <strong>remover livros do catálogo</strong> e <strong>fazer upload ou alterar a capa de qualquer livro</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={handleOpenAddBook}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Adicionar Livro ao Catálogo</span>
              </button>
              <button
                onClick={() => setActiveTab('management')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-200 bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/60 transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Tabela de Gestão</span>
              </button>
            </div>
          </div>
        )}

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

        {/* Navigation Tabs (Catálogo / Minhas Reservas / Gestão do Acervo / Regras da Biblioteca) */}
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

          {isManagementMode && (
            <button
              onClick={() => setActiveTab('management')}
              className={`py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'management'
                  ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                  : 'text-amber-300 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Gestão do Acervo ({books.length})</span>
            </button>
          )}

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
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-950/70 border border-emerald-700/60 text-xs sm:text-sm text-emerald-200 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={onlyAvailable}
                      onChange={(e) => setOnlyAvailable(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-emerald-900 border-emerald-700 cursor-pointer"
                    />
                    <span>Somente disponíveis para retirada imediata</span>
                  </label>

                  {isManagementMode && (
                    <button
                      onClick={handleOpenAddBook}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Livro</span>
                    </button>
                  )}
                </div>
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
                <div className="flex items-center justify-center gap-3">
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
                  {isManagementMode && (
                    <button
                      onClick={handleOpenAddBook}
                      className="px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 font-bold text-xs transition-colors cursor-pointer"
                    >
                      + Cadastrar Novo Livro
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => {
                  const isAvailable = book.availableCopies > 0;
                  return (
                    <article
                      key={book.id}
                      className="bg-emerald-950/85 rounded-2xl border border-emerald-800/70 overflow-hidden shadow-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between group"
                    >
                      {/* Top Visual / Real Cover Image */}
                      <div className="relative">
                        {book.coverImage ? (
                          <div className="relative h-56 w-full overflow-hidden bg-emerald-950">
                            <img
                              src={book.coverImage}
                              alt={`Capa do livro ${book.title}`}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                // If image fails to load, fallback gracefully
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            {/* Gradient Overlay for Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/50 to-transparent" />
                            
                            {/* Badges on top of cover */}
                            <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
                              <span className="text-[10px] font-bold tracking-wide text-emerald-100 uppercase bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
                                {book.category}
                              </span>
                              {book.badge && (
                                <span className="text-[10px] font-bold text-emerald-950 bg-emerald-300 px-2 py-0.5 rounded-full shadow-md">
                                  {book.badge}
                                </span>
                              )}
                            </div>

                            {/* Title overlay on bottom of cover */}
                            <div className="absolute bottom-3 left-3 right-3 z-10">
                              <h3 className="text-lg font-bold text-white leading-snug drop-shadow-md group-hover:text-emerald-200 transition-colors">
                                {book.title}
                              </h3>
                              <p className="text-xs text-emerald-200/90 font-medium drop-shadow-xs">
                                {book.author}
                              </p>
                            </div>
                          </div>
                        ) : (
                          /* Fallback Spine / Visual Header if no image */
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
                        )}

                        {/* Management Floating Action Pill on the Card */}
                        {isManagementMode && (
                          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-xl border border-white/20 shadow-lg">
                            <button
                              onClick={() => handleOpenCoverModal(book)}
                              className="p-1.5 text-emerald-300 hover:text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                              title="Adicionar ou alterar capa do livro"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditBook(book)}
                              className="p-1.5 text-amber-300 hover:text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                              title="Editar dados deste livro"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setBookToDelete(book)}
                              className="p-1.5 text-rose-400 hover:text-rose-200 hover:bg-rose-900/60 rounded-lg transition-colors cursor-pointer"
                              title="Remover livro do catálogo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
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

                        {/* Direct Management Bar at Bottom of Card */}
                        {isManagementMode && (
                          <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-[11px] text-amber-200/90 bg-amber-950/20 -mx-4 -mb-4 px-4 py-2 rounded-b-2xl">
                            <span className="flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-amber-300" />
                              <span>Gestão:</span>
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenCoverModal(book)}
                                className="text-emerald-300 hover:text-white underline font-semibold cursor-pointer"
                              >
                                {book.coverImage ? 'Alterar Capa' : '+ Adicionar Capa'}
                              </button>
                              <span>·</span>
                              <button
                                onClick={() => setBookToDelete(book)}
                                className="text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                              >
                                Remover
                              </button>
                            </div>
                          </div>
                        )}

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

        {/* TAB 3: DEDICATED MANAGEMENT VIEW (WHEN ADMIN IS ACTIVE) */}
        {activeTab === 'management' && isManagementMode && (
          <section className="space-y-6">
            <div className="bg-emerald-950/85 p-6 rounded-3xl border border-amber-400/40 shadow-xl space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-amber-300" />
                    <span>Painel da Gestão: Acervo & Capas da Biblioteca</span>
                  </h3>
                  <p className="text-xs text-emerald-300/80 mt-1">
                    Adicione novos livros, remova títulos do catálogo escolar e atualize capas com fotos do dispositivo ou links.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleOpenAddBook}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Adicionar Novo Livro</span>
                  </button>
                  <button
                    onClick={handleRestoreInitialBooks}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 text-xs font-semibold transition-colors cursor-pointer"
                    title="Mesclar e restaurar títulos padrão da SEDUC"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Restaurar Base SEDUC</span>
                  </button>
                </div>
              </div>

              {/* Management Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-emerald-800 text-emerald-300 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3">Capa</th>
                      <th className="py-3 px-3">Título & Autor</th>
                      <th className="py-3 px-3">Categoria</th>
                      <th className="py-3 px-3">Estante</th>
                      <th className="py-3 px-3 text-center">Exemplares</th>
                      <th className="py-3 px-3 text-right">Ações da Gestão</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/60">
                    {books.map((b) => (
                      <tr key={b.id} className="hover:bg-emerald-900/30 transition-colors">
                        
                        {/* Book Cover Thumbnail */}
                        <td className="py-3 px-3">
                          <div className="relative group/thumb">
                            {b.coverImage ? (
                              <img
                                src={b.coverImage}
                                alt={b.title}
                                className="w-10 h-14 object-cover rounded-lg shadow border border-emerald-700/60"
                              />
                            ) : (
                              <div className={`w-10 h-14 rounded-lg bg-gradient-to-r ${b.coverGradient} flex items-center justify-center text-white/50 border border-white/10`}>
                                <ImageIcon className="w-4 h-4" />
                              </div>
                            )}
                            <button
                              onClick={() => handleOpenCoverModal(b)}
                              className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center text-emerald-300 transition-opacity cursor-pointer"
                              title="Alterar capa"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        {/* Title and Author */}
                        <td className="py-3 px-3">
                          <div className="font-bold text-white text-sm">{b.title}</div>
                          <div className="text-emerald-300 text-xs">{b.author}</div>
                          <div className="text-[10px] text-emerald-400/70 mt-0.5">ISBN: {b.isbn} · {b.year}</div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-900/80 text-emerald-200 text-[10px] font-medium border border-emerald-700/60">
                            {b.category}
                          </span>
                        </td>

                        {/* Shelf */}
                        <td className="py-3 px-3 text-emerald-200">
                          <div className="truncate max-w-[180px]">{b.shelfLocation}</div>
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-3 text-center">
                          <span className="font-bold text-emerald-300">{b.availableCopies}</span>
                          <span className="text-emerald-400/80"> / {b.totalCopies}</span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenCoverModal(b)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold border border-emerald-700/60 flex items-center gap-1 cursor-pointer"
                              title="Adicionar ou alterar capa do livro"
                            >
                              <ImageIcon className="w-3.5 h-3.5 text-emerald-300" />
                              <span>{b.coverImage ? 'Capa' : '+ Capa'}</span>
                            </button>

                            <button
                              onClick={() => handleOpenEditBook(b)}
                              className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold border border-amber-400/40 flex items-center gap-1 cursor-pointer"
                              title="Editar informações do livro"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                              <span>Editar</span>
                            </button>

                            <button
                              onClick={() => setBookToDelete(b)}
                              className="px-2 py-1 rounded-lg bg-rose-950/70 hover:bg-rose-900 text-rose-300 text-xs font-semibold border border-rose-800/60 flex items-center gap-1 cursor-pointer"
                              title="Remover livro do catálogo"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                              <span>Remover</span>
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </section>
        )}

        {/* TAB 4: RULES & LIBRARY INFORMATION */}
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

      {/* MODAL: ADMIN ACCESS LOGIN */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-emerald-950 border border-emerald-700/80 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            
            <button
              onClick={() => {
                setShowAdminLoginModal(false);
                setAdminLoginError('');
                setAdminPasswordInput('');
              }}
              className="absolute right-4 top-4 text-emerald-400 hover:text-white p-1 rounded-lg bg-emerald-900/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Acesso da Gestão da Biblioteca
              </h3>
              <p className="text-xs text-emerald-300/80">
                Área reservada para a coordenação, professores e equipe da biblioteca gerenciarem o acervo.
              </p>
            </div>

            {adminLoginError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-700/60 text-xs text-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{adminLoginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-emerald-200 font-medium text-xs mb-1">
                  Chave de Acesso Institucional
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="password"
                    autoFocus
                    required
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="Digite a chave da gestão (Dica: 12345)"
                    className="w-full bg-emerald-900/80 text-white pl-9 pr-3 py-2.5 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                  />
                </div>
                <p className="text-[11px] text-emerald-400/70 mt-1">
                  Dica para teste: Utilize a senha institucional <code className="bg-emerald-900 px-1.5 py-0.5 rounded text-amber-300 font-mono">12345</code>
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setAdminPasswordInput('12345')}
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-900/70 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Preencher 12345
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95"
                >
                  Entrar no Modo Gestão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD OR EDIT BOOK (COM UPLOAD DE CAPA E FORMULÁRIO COMPLETO) */}
      {showAddBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-emerald-950 border border-emerald-700/80 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative space-y-5 max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={() => {
                setShowAddBookModal(false);
                setBookToEdit(null);
              }}
              className="absolute right-4 top-4 text-emerald-400 hover:text-white p-1 rounded-lg bg-emerald-900/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                Gestão do Acervo da Biblioteca
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                {bookToEdit ? 'Editar Dados do Livro' : 'Cadastrar Novo Livro no Catálogo'}
              </h3>
              <p className="text-xs text-emerald-300/80">
                Preencha os dados da obra e adicione a capa correspondente.
              </p>
            </div>

            {bookFormError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-700/60 text-xs text-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{bookFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveBook} className="space-y-4 text-xs">
              
              {/* SECTION: CAPA DO LIVRO (FEATURE PRINCIPAL) */}
              <div className="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-emerald-200 font-bold flex items-center gap-1.5 text-xs">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>Capa do Livro (Imagem)</span>
                  </label>
                  {bookFormCoverImage && (
                    <button
                      type="button"
                      onClick={() => setBookFormCoverImage('')}
                      className="text-[11px] text-rose-300 hover:text-rose-200 underline cursor-pointer"
                    >
                      Remover imagem da capa
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  
                  {/* Live Preview of Cover */}
                  <div className="sm:col-span-1 flex flex-col items-center">
                    <div className="w-28 h-40 rounded-xl overflow-hidden border-2 border-dashed border-emerald-600/80 bg-emerald-950 flex flex-col items-center justify-center relative shadow-lg">
                      {bookFormCoverImage ? (
                        <img
                          src={bookFormCoverImage}
                          alt="Prévia da capa"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-r ${bookFormCoverGradient} flex flex-col items-center justify-center p-2 text-center text-white/80`}>
                          <ImageIcon className="w-6 h-6 mb-1 text-white/60" />
                          <span className="text-[10px] font-bold leading-tight">{bookFormTitle || 'Título da Obra'}</span>
                          <span className="text-[8px] text-emerald-200 mt-1">Capa com Gradiente</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-300/80 mt-1.5">Prévia da Capa</span>
                  </div>

                  {/* Upload and URL controls */}
                  <div className="sm:col-span-2 space-y-2.5">
                    
                    {/* Option 1: File Upload */}
                    <div>
                      <span className="text-[11px] text-emerald-200 block mb-1 font-semibold">
                        Opção 1: Enviar foto/imagem do seu dispositivo (PC ou Celular)
                      </span>
                      <input
                        type="file"
                        ref={addModalFileInputRef}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageFileSelect(file, (dataUrl) => setBookFormCoverImage(dataUrl));
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => addModalFileInputRef.current?.click()}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 border border-emerald-600/60 cursor-pointer transition-colors text-xs"
                      >
                        <Upload className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Escolher Arquivo de Imagem da Capa</span>
                      </button>
                    </div>

                    {/* Option 2: Image URL */}
                    <div>
                      <span className="text-[11px] text-emerald-200 block mb-1 font-semibold">
                        Opção 2: Ou colar link (URL) direto da imagem
                      </span>
                      <input
                        type="url"
                        value={bookFormCoverImage}
                        onChange={(e) => setBookFormCoverImage(e.target.value)}
                        placeholder="https://exemplo.com/capa-do-livro.jpg"
                        className="w-full bg-emerald-950/80 text-white px-3 py-2 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs"
                      />
                    </div>

                    {/* Option 3: Presets */}
                    <div>
                      <span className="text-[10px] text-emerald-300/80 block mb-1">
                        Capas Sugeridas Rápidas:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_BOOK_COVERS.slice(0, 4).map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setBookFormCoverImage(p.url)}
                            className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 text-[10px] cursor-pointer"
                          >
                            {p.label.split('&')[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              </div>

              {/* Title & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-200 font-semibold mb-1">
                    Título da Obra <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bookFormTitle}
                    onChange={(e) => setBookFormTitle(e.target.value)}
                    placeholder="Ex: Dom Casmurro"
                    className="w-full bg-emerald-900/70 text-white px-3 py-2 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-emerald-200 font-semibold mb-1">
                    Autor(a) da Obra <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bookFormAuthor}
                    onChange={(e) => setBookFormAuthor(e.target.value)}
                    placeholder="Ex: Machado de Assis"
                    className="w-full bg-emerald-900/70 text-white px-3 py-2 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs"
                  />
                </div>
              </div>

              {/* Category & Shelf Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-200 font-semibold mb-1">
                    Categoria Escolar
                  </label>
                  <select
                    value={bookFormCategory}
                    onChange={(e) => setBookFormCategory(e.target.value)}
                    className="w-full bg-emerald-900/70 text-white px-3 py-2 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs"
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
                  <label className="block text-emerald-200 font-semibold mb-1">
                    Localização Física na Biblioteca
                  </label>
                  <input
                    type="text"
                    value={bookFormShelfLocation}
                    onChange={(e) => setBookFormShelfLocation(e.target.value)}
                    placeholder="Ex: Estante 02 · Prateleira B"
                    className="w-full bg-emerald-900/70 text-white px-3 py-2 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs"
                  />
                </div>
              </div>

              {/* Copies, Year, Pages */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-emerald-200 font-semibold mb-1">
                    Total de Exemplares
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={bookFormTotalCopies}
                    onChange={(e) => setBookFormTotalCopies(Number(e.target.value))}
                    className="w-full bg-emerald-900/70 text-white px-3 py-2 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-emerald-200 font-semibold mb-1">
                    Ano Publicação
                  </label>
                  <input
                    type="number"
                    value={bookFormYear}
                    onChange={(e) => setBookFormYear(Number(e.target.value))}
                    className="w-full bg-emerald-900/70 text-white px-3 py-2 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-emerald-200 font-semibold mb-1">
                    Nº Páginas
                  </label>
                  <input
                    type="number"
                    value={bookFormPages}
                    onChange={(e) => setBookFormPages(Number(e.target.value))}
                    className="w-full bg-emerald-900/70 text-white px-3 py-2 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Publisher & ISBN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-200 font-semibold mb-1">
                    Editora / Coleção
                  </label>
                  <input
                    type="text"
                    value={bookFormPublisher}
                    onChange={(e) => setBookFormPublisher(e.target.value)}
                    placeholder="Ex: Editora Record / Acervo SEDUC"
                    className="w-full bg-emerald-900/70 text-white px-3 py-2 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-emerald-200 font-semibold mb-1">
                    ISBN
                  </label>
                  <input
                    type="text"
                    value={bookFormIsbn}
                    onChange={(e) => setBookFormIsbn(e.target.value)}
                    placeholder="Ex: 978-85-359-1484-9"
                    className="w-full bg-emerald-900/70 text-white px-3 py-2 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <label className="block text-emerald-200 font-semibold mb-1">
                  Sinopse / Resumo Pedagógico da Obra
                </label>
                <textarea
                  rows={3}
                  value={bookFormSynopsis}
                  onChange={(e) => setBookFormSynopsis(e.target.value)}
                  placeholder="Descreva brevemente o enredo, tema ou importância pedagógica do livro para os estudantes..."
                  className="w-full bg-emerald-900/70 text-white p-2.5 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs resize-none"
                />
              </div>

              {/* Badge & Recommended Grade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-200 font-semibold mb-1">
                    Destaque / Selo (Opcional)
                  </label>
                  <input
                    type="text"
                    value={bookFormBadge}
                    onChange={(e) => setBookFormBadge(e.target.value)}
                    placeholder="Ex: Leitura Obrigatória ENEM, Destaque Regional"
                    className="w-full bg-emerald-900/70 text-white px-3 py-2 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-emerald-200 font-semibold mb-1">
                    Série / Turma Recomendada
                  </label>
                  <input
                    type="text"
                    value={bookFormRecommendedGrade}
                    onChange={(e) => setBookFormRecommendedGrade(e.target.value)}
                    placeholder="Ex: 1º ao 3º Ano do Ensino Médio"
                    className="w-full bg-emerald-900/70 text-white px-3 py-2 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-emerald-200 font-semibold mb-1">
                  Tags / Palavras-chave (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={bookFormTags}
                  onChange={(e) => setBookFormTags(e.target.value)}
                  placeholder="Ex: ENEM, Literatura, Realismo, Nordeste"
                  className="w-full bg-emerald-900/70 text-white px-3 py-2 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs"
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddBookModal(false);
                    setBookToEdit(null);
                  }}
                  className="w-1/3 py-2.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-900 text-emerald-200 font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{bookToEdit ? 'Salvar Alterações' : 'Confirmar e Inserir no Catálogo'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL: ADICIONAR OU ALTERAR CAPA DE UM LIVRO ESPECÍFICO */}
      {bookForCoverChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-emerald-950 border border-emerald-700/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            
            <button
              onClick={() => {
                setBookForCoverChange(null);
                setCoverUrlInput('');
                setCoverPreview('');
              }}
              className="absolute right-4 top-4 text-emerald-400 hover:text-white p-1 rounded-lg bg-emerald-900/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200 text-[10px] font-bold uppercase">
                <ImageIcon className="w-3 h-3 text-emerald-400" />
                Gerenciador de Capas
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                Adicionar ou Alterar Capa
              </h3>
              <p className="text-xs text-emerald-300/80">
                Obra: <strong className="text-white">{bookForCoverChange.title}</strong> · {bookForCoverChange.author}
              </p>
            </div>

            {/* Current vs New Preview */}
            <div className="flex items-center justify-center py-2">
              <div className="w-32 h-44 rounded-xl overflow-hidden border-2 border-emerald-500/70 bg-emerald-900 shadow-xl relative">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Prévia da nova capa"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-r ${bookForCoverChange.coverGradient} flex flex-col items-center justify-center p-3 text-center text-white`}>
                    <ImageIcon className="w-8 h-8 mb-2 opacity-60" />
                    <span className="text-xs font-bold leading-tight">{bookForCoverChange.title}</span>
                    <span className="text-[9px] text-emerald-200 mt-1">Sem imagem (Gradiente)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* Upload from device */}
              <div>
                <label className="block text-emerald-200 font-semibold mb-1">
                  1. Carregar arquivo de foto do seu computador ou celular:
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageFileSelect(file, (dataUrl) => {
                        setCoverPreview(dataUrl);
                        setCoverUrlInput('');
                      });
                    }
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 border border-emerald-600/60 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4 text-emerald-300" />
                  <span>Selecionar Imagem do Dispositivo...</span>
                </button>
              </div>

              {/* Direct image link */}
              <div>
                <label className="block text-emerald-200 font-semibold mb-1">
                  2. Ou colar o link direto (URL) da imagem:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={coverUrlInput}
                    onChange={(e) => {
                      setCoverUrlInput(e.target.value);
                      setCoverPreview(e.target.value);
                    }}
                    placeholder="https://exemplo.com/foto-capa.jpg"
                    className="flex-1 bg-emerald-900/80 text-white px-3 py-2 rounded-xl border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs"
                  />
                  {coverUrlInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setCoverUrlInput('');
                        setCoverPreview('');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-900 text-emerald-300 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Presets library */}
              <div>
                <label className="block text-emerald-300/90 font-medium text-[11px] mb-1">
                  3. Ou escolher uma capa sugerida da biblioteca:
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {PRESET_BOOK_COVERS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setCoverPreview(preset.url);
                        setCoverUrlInput(preset.url);
                      }}
                      className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-800 flex items-center gap-2 text-left cursor-pointer transition-colors"
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-7 h-9 object-cover rounded shrink-0"
                      />
                      <span className="truncate text-[10px] text-emerald-200">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-emerald-800/60">
              {coverPreview ? (
                <button
                  type="button"
                  onClick={() => {
                    setCoverPreview('');
                    setCoverUrlInput('');
                  }}
                  className="text-xs text-rose-300 hover:text-rose-200 underline cursor-pointer"
                >
                  Remover Imagem
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setBookForCoverChange(null);
                    setCoverUrlInput('');
                    setCoverPreview('');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleSaveCover}
                  className="px-5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Capa</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: CONFIRMAR REMOÇÃO DE LIVRO DO CATÁLOGO */}
      {bookToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-emerald-950 border border-rose-700/80 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            
            <button
              onClick={() => setBookToDelete(null)}
              className="absolute right-4 top-4 text-emerald-400 hover:text-white p-1 rounded-lg bg-emerald-900/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 mb-1">
                <Trash2 className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Remover Livro do Catálogo?
              </h3>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                Você está prestes a remover o livro <strong className="text-white">&ldquo;{bookToDelete.title}&rdquo;</strong> do acervo escolar da biblioteca.
              </p>
            </div>

            <div className="bg-emerald-900/50 p-3.5 rounded-2xl border border-emerald-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-emerald-400/80">Autor:</span>
                <span className="font-semibold text-white">{bookToDelete.author}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400/80">Categoria:</span>
                <span className="text-emerald-200">{bookToDelete.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400/80">Exemplares cadastrados:</span>
                <span className="font-bold text-amber-300">{bookToDelete.totalCopies} unidades</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400/80">Localização:</span>
                <span className="text-emerald-300 truncate max-w-[200px]">{bookToDelete.shelfLocation}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBookToDelete(null)}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmDeleteBook}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sim, Remover Livro</span>
              </button>
            </div>

          </div>
        </div>
      )}

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

            {/* Book Cover Header */}
            {selectedBookForDetails.coverImage ? (
              <div className="relative rounded-2xl overflow-hidden h-60 w-full bg-emerald-950 border border-white/10 shadow-lg">
                <img
                  src={selectedBookForDetails.coverImage}
                  alt={`Capa do livro ${selectedBookForDetails.title}`}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold text-emerald-950 bg-emerald-300 px-2.5 py-0.5 rounded-full shadow">
                    {selectedBookForDetails.category}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-xl font-bold text-white drop-shadow-md">
                    {selectedBookForDetails.title}
                  </h3>
                  <p className="text-xs text-emerald-200 font-medium drop-shadow-xs">
                    {selectedBookForDetails.author}
                  </p>
                </div>
              </div>
            ) : (
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
            )}

            {/* Management Quick Options within Details Modal */}
            {isManagementMode && (
              <div className="p-2.5 bg-amber-500/10 border border-amber-400/30 rounded-xl flex items-center justify-between text-xs">
                <span className="text-amber-200 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  Opções de Gestão:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const book = selectedBookForDetails;
                      setSelectedBookForDetails(null);
                      handleOpenCoverModal(book);
                    }}
                    className="px-2 py-1 rounded bg-emerald-900 text-emerald-300 hover:text-white font-medium cursor-pointer"
                  >
                    Alterar Capa
                  </button>
                  <button
                    onClick={() => {
                      const book = selectedBookForDetails;
                      setSelectedBookForDetails(null);
                      setBookToDelete(book);
                    }}
                    className="px-2 py-1 rounded bg-rose-950 text-rose-300 hover:text-rose-200 font-medium cursor-pointer"
                  >
                    Remover Livro
                  </button>
                </div>
              </div>
            )}

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
              <div className="flex items-center gap-3">
                {selectedBookForReservation.coverImage && (
                  <img
                    src={selectedBookForReservation.coverImage}
                    alt={selectedBookForReservation.title}
                    className="w-10 h-14 object-cover rounded-lg shadow"
                  />
                )}
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedBookForReservation.title}</h4>
                  <p className="text-xs text-emerald-300 font-medium">{selectedBookForReservation.author}</p>
                  <p className="text-[11px] text-emerald-400/80 mt-0.5">{selectedBookForReservation.shelfLocation}</p>
                </div>
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
