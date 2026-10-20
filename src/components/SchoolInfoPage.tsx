import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  CalendarDays, 
  MapPin, 
  Phone, 
  Search, 
  Printer, 
  BookOpen, 
  ShieldAlert, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  Info as InfoIcon, 
  Layers, 
  Building2, 
  GraduationCap, 
  Calendar, 
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  Award,
  Coffee,
  Utensils,
  Sun,
  Moon,
  Compass,
  FileText,
  HelpCircle,
  Share2,
  Lock
} from 'lucide-react';
import { 
  SCHOOL_CLASSES, 
  DAILY_ROUTINE, 
  SCHOOL_STAFF, 
  SCHOOL_CALENDAR_2026, 
  SCHOOL_RULES_GUIDE,
  SchoolClass,
  ClassScheduleItem
} from '../data/schoolScheduleData';

import fachadaImg from '../assets/images/cetifrente2.jpeg';
import patioImg from '../assets/images/cetipatio.jpeg';
import escadaImg from '../assets/images/cetiescada (1).jpeg';

interface SchoolInfoPageProps {
  onBackToHome: () => void;
  onOpenLibrary?: () => void;
  onOpenBullyingReport?: () => void;
  onOpenAdminLogin?: () => void;
}

export default function SchoolInfoPage({ 
  onBackToHome, 
  onOpenLibrary, 
  onOpenBullyingReport,
  onOpenAdminLogin 
}: SchoolInfoPageProps) {
  // Navigation tabs within page
  const [activeTab, setActiveTab] = useState<'grade' | 'rotina' | 'geral' | 'calendario' | 'normas' | 'equipe'>('grade');

  // Schedule filtering state
  const [selectedClassId, setSelectedClassId] = useState<string>('1a');
  const [selectedDayKey, setSelectedDayKey] = useState<'todos' | 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta'>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [scheduleViewMode, setScheduleViewMode] = useState<'grade' | 'cards'>('grade');

  // Selected class
  const currentClass: SchoolClass = SCHOOL_CLASSES.find(c => c.id === selectedClassId) || SCHOOL_CLASSES[0];

  // Days list
  const daysList: { key: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta'; label: string; short: string }[] = [
    { key: 'segunda', label: 'Segunda-feira', short: 'Seg' },
    { key: 'terca', label: 'Terça-feira', short: 'Ter' },
    { key: 'quarta', label: 'Quarta-feira', short: 'Qua' },
    { key: 'quinta', label: 'Quinta-feira', short: 'Qui' },
    { key: 'sexta', label: 'Sexta-feira', short: 'Sex' },
  ];

  // Helper for category badge color
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'linguagens':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'matematica':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'natureza':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'humanas':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'diversificada':
        return 'bg-rose-100 text-rose-900 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'linguagens': return 'Linguagens & Códigos';
      case 'matematica': return 'Matemática';
      case 'natureza': return 'Ciências da Natureza';
      case 'humanas': return 'Ciências Humanas';
      case 'diversificada': return 'Itinerários / Integral';
      default: return 'Geral';
    }
  };

  // Filter items for a specific day
  const getFilteredItemsForDay = (dayKey: string) => {
    const rawItems = currentClass.schedule[dayKey] || [];
    return rawItems.filter(item => {
      const matchSearch = searchQuery === '' || 
        item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.room.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategory = categoryFilter === 'todos' || item.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  };

  const handlePrintSchedule = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      
      {/* Top Institutional Header */}
      <header className="bg-emerald-950 text-white border-b border-emerald-900 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            
            {/* Back to Home + School Brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToHome}
                className="inline-flex items-center gap-2 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border border-emerald-700/60 shadow-xs cursor-pointer active:scale-95"
                title="Voltar para a página inicial"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Voltar ao Início</span>
                <span className="sm:hidden">Início</span>
              </button>

              <div className="flex items-center gap-2.5 border-l border-emerald-800/80 pl-3">
                <img 
                  src="/assets/aistudio/branco_transparente_0a853876.png" 
                  alt="Logo CETI Verônica Celestina Dias" 
                  className="h-9 w-9 sm:h-11 sm:w-11 object-contain drop-shadow-sm brightness-110" 
                />
                <div className="leading-tight">
                  <h1 className="font-bold text-sm sm:text-base tracking-tight text-white line-clamp-1">
                    CETI Verônica Celestina Dias
                  </h1>
                  <p className="text-[10px] sm:text-xs text-emerald-300 font-medium hidden sm:block">
                    Informações Institucionais & Grade de Horários 2026
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-2">
              {onOpenLibrary && (
                <button
                  onClick={onOpenLibrary}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-300 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer shadow-xs active:scale-95"
                  title="Ir para a Biblioteca Digital"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-950" />
                  <span>Biblioteca Digital</span>
                </button>
              )}

              {onOpenBullyingReport && (
                <button
                  onClick={onOpenBullyingReport}
                  className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 border border-emerald-600/50 rounded-lg transition-colors cursor-pointer shadow-xs active:scale-95"
                  title="Acessar Canal de Denúncia e Acolhimento"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Canal Bullying</span>
                </button>
              )}

              <button
                onClick={handlePrintSchedule}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:text-white bg-emerald-900 hover:bg-emerald-800 border border-emerald-700/80 rounded-lg transition-colors cursor-pointer shadow-xs active:scale-95"
                title="Imprimir informações ou salvar em PDF"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-300" />
                <span className="hidden sm:inline">Imprimir / Salvar PDF</span>
                <span className="sm:hidden">Imprimir</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="bg-gradient-to-b from-emerald-900 via-emerald-850 to-emerald-950 text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-emerald-800 shadow-inner relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/70 text-emerald-200 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Portal de Informações Oficiais · Ano Letivo 2026</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Informações da Escola & <br className="hidden sm:inline" />
              <span className="text-emerald-300 underline decoration-emerald-500/40 decoration-4">Grade de Horários</span>
            </h2>

            <p className="mt-3 sm:mt-4 text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              Consulte a programação semanal de aulas, horários das refeições e rotina integral, corpo docente, calendário oficial do ano e regras de convivência do <strong>CETI Verônica Celestina Dias</strong>.
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-xs text-emerald-200">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 rounded-lg border border-emerald-700/60">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Horário: 07:00 às 17:00</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 rounded-lg border border-emerald-700/60">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Campo Alegre do Fidalgo - PI</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 rounded-lg border border-emerald-700/60">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <a href="tel:+558994107024" className="hover:underline font-semibold">+55 89 9410-7024</a>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tab Navigation Bar */}
      <section className="bg-white border-b border-stone-200 sticky top-16 sm:top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto py-2.5 no-scrollbar text-xs sm:text-sm">
            <button
              onClick={() => setActiveTab('grade')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'grade'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-stone-600 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Grade de Horários</span>
            </button>

            <button
              onClick={() => setActiveTab('rotina')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'rotina'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-stone-600 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Rotina Diária (7h às 17h)</span>
            </button>

            <button
              onClick={() => setActiveTab('geral')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'geral'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-stone-600 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Sobre a Escola & Estrutura</span>
            </button>

            <button
              onClick={() => setActiveTab('calendario')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'calendario'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-stone-600 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Calendário Letivo 2026</span>
            </button>

            <button
              onClick={() => setActiveTab('normas')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'normas'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-stone-600 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Normas & Convivência</span>
            </button>

            <button
              onClick={() => setActiveTab('equipe')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'equipe'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-stone-600 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Gestão & Equipe</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* ========================================================================= */}
        {/* TAB 1: GRADE DE HORÁRIOS                                                  */}
        {/* ========================================================================= */}
        {activeTab === 'grade' && (
          <div className="space-y-8">
            
            {/* Class Selector & Header Info */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-sm space-y-5">
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                <div>
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
                    <CalendarDays className="w-4 h-4" />
                    <span>Grade Curricular Semanal</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                    {currentClass.name}
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                    {currentClass.shift} · Local: <strong>{currentClass.roomNumber}</strong> · Professor(a) Tutor(a): <strong>{currentClass.advisorTeacher}</strong>
                  </p>
                </div>

                {/* Class selector pills */}
                <div className="flex flex-wrap gap-2">
                  {SCHOOL_CLASSES.map(cls => (
                    <button
                      key={cls.id}
                      onClick={() => setSelectedClassId(cls.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedClassId === cls.id
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      {cls.shortName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filters: Day, Search, Category & View Switcher */}
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                
                {/* Day selector */}
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-xs font-bold text-stone-600 mr-1 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Dia:
                  </span>
                  <button
                    onClick={() => setSelectedDayKey('todos')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedDayKey === 'todos'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    Semana Completa
                  </button>
                  {daysList.map(day => (
                    <button
                      key={day.key}
                      onClick={() => setSelectedDayKey(day.key)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedDayKey === day.key
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      {day.short}
                    </button>
                  ))}
                </div>

                {/* Search & Area Filter */}
                <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
                  <div className="relative flex-1 sm:w-56">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Buscar matéria ou prof..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="py-1.5 px-2.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-700 font-medium"
                  >
                    <option value="todos">Todas as Áreas</option>
                    <option value="linguagens">Linguagens</option>
                    <option value="matematica">Matemática</option>
                    <option value="natureza">Ciências da Natureza</option>
                    <option value="humanas">Ciências Humanas</option>
                    <option value="diversificada">Itinerários / Integral</option>
                  </select>

                  <div className="border-l border-stone-200 pl-2 hidden sm:flex items-center gap-1">
                    <button
                      onClick={() => setScheduleViewMode('grade')}
                      className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        scheduleViewMode === 'grade'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'text-stone-500 hover:bg-stone-100'
                      }`}
                      title="Visualização em Grade / Tabela Semanal"
                    >
                      <Layers className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setScheduleViewMode('cards')}
                      className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        scheduleViewMode === 'cards'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'text-stone-500 hover:bg-stone-100'
                      }`}
                      title="Visualização em Lista / Cards"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Area color code legend */}
              <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2 text-[11px] text-stone-600">
                <span className="font-bold text-stone-700">Áreas de Conhecimento:</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span> Linguagens
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span> Matemática
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span> C. da Natureza
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span> C. Humanas
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span> Itinerários / Tutoria
                </span>
              </div>

            </div>

            {/* Timetable Matrix (Table View) */}
            {scheduleViewMode === 'grade' && (
              <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-emerald-950 text-white text-xs uppercase tracking-wider font-bold">
                        <th className="py-3.5 px-4 w-32 border-b border-emerald-900">Horário / Aula</th>
                        {daysList
                          .filter(d => selectedDayKey === 'todos' || selectedDayKey === d.key)
                          .map(d => (
                            <th key={d.key} className="py-3.5 px-4 border-b border-emerald-900 border-l border-emerald-900/60">
                              <div className="font-bold text-sm text-emerald-100">{d.label}</div>
                              <div className="text-[10px] text-emerald-300 font-normal">Turma: {currentClass.shortName}</div>
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-xs">
                      
                      {/* Acolhimento Row */}
                      <tr className="bg-emerald-50/60 border-y border-emerald-100">
                        <td className="py-2.5 px-4 font-bold text-emerald-950 flex items-center gap-1.5">
                          <Coffee className="w-3.5 h-3.5 text-emerald-700" />
                          <span>07:00 - 07:30</span>
                        </td>
                        <td colSpan={selectedDayKey === 'todos' ? 5 : 1} className="py-2 px-4 text-emerald-900 font-medium border-l border-emerald-100">
                          <div className="flex items-center justify-between">
                            <span>Acolhimento Institucional dos Estudantes & Café da Manhã Completo</span>
                            <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded font-bold">Refeitório & Pátio</span>
                          </div>
                        </td>
                      </tr>

                      {/* Aulas 1 to 3 */}
                      {[1, 2, 3].map(slotNum => {
                        const timeMap: Record<number, string> = {
                          1: '07:30 - 08:20',
                          2: '08:20 - 09:10',
                          3: '09:10 - 10:00',
                        };

                        return (
                          <tr key={slotNum} className="hover:bg-stone-50/80 transition-colors">
                            <td className="py-3 px-4 font-bold text-stone-700 whitespace-nowrap bg-stone-50/50">
                              <div className="text-emerald-900 font-black">{slotNum}ª Aula</div>
                              <div className="text-[10px] text-stone-500 font-normal">{timeMap[slotNum]}</div>
                            </td>
                            {daysList
                              .filter(d => selectedDayKey === 'todos' || selectedDayKey === d.key)
                              .map(d => {
                                const dayItems = getFilteredItemsForDay(d.key);
                                const item = dayItems.find(it => it.slotNumber === slotNum);

                                return (
                                  <td key={d.key} className="py-3 px-4 border-l border-stone-100 align-top">
                                    {item ? (
                                      <div className={`p-2.5 rounded-xl border transition-all ${getCategoryBadgeClass(item.category)}`}>
                                        <div className="font-bold text-xs leading-snug">{item.subject}</div>
                                        <div className="text-[11px] mt-1 font-medium opacity-90">{item.teacher}</div>
                                        <div className="text-[10px] mt-0.5 flex items-center justify-between opacity-80">
                                          <span>{item.room}</span>
                                          <span className="font-semibold text-[9px] uppercase tracking-wider">{getCategoryName(item.category)}</span>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-stone-300 italic text-[11px] p-2">-</div>
                                    )}
                                  </td>
                                );
                              })}
                          </tr>
                        );
                      })}

                      {/* Lanche Matutino Row */}
                      <tr className="bg-amber-50/70 border-y border-amber-200/80">
                        <td className="py-2.5 px-4 font-bold text-amber-950 flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5 text-amber-700" />
                          <span>10:00 - 10:20</span>
                        </td>
                        <td colSpan={selectedDayKey === 'todos' ? 5 : 1} className="py-2 px-4 text-amber-900 font-medium border-l border-amber-100">
                          <div className="flex items-center justify-between">
                            <span>Intervalo / Lanche Saudável da Manhã (PNAE) & Recreação</span>
                            <span className="text-[10px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded font-bold">20 min</span>
                          </div>
                        </td>
                      </tr>

                      {/* Aulas 4 e 5 */}
                      {[4, 5].map(slotNum => {
                        const timeMap: Record<number, string> = {
                          4: '10:20 - 11:10',
                          5: '11:10 - 12:00',
                        };

                        return (
                          <tr key={slotNum} className="hover:bg-stone-50/80 transition-colors">
                            <td className="py-3 px-4 font-bold text-stone-700 whitespace-nowrap bg-stone-50/50">
                              <div className="text-emerald-900 font-black">{slotNum}ª Aula</div>
                              <div className="text-[10px] text-stone-500 font-normal">{timeMap[slotNum]}</div>
                            </td>
                            {daysList
                              .filter(d => selectedDayKey === 'todos' || selectedDayKey === d.key)
                              .map(d => {
                                const dayItems = getFilteredItemsForDay(d.key);
                                const item = dayItems.find(it => it.slotNumber === slotNum);

                                return (
                                  <td key={d.key} className="py-3 px-4 border-l border-stone-100 align-top">
                                    {item ? (
                                      <div className={`p-2.5 rounded-xl border transition-all ${getCategoryBadgeClass(item.category)}`}>
                                        <div className="font-bold text-xs leading-snug">{item.subject}</div>
                                        <div className="text-[11px] mt-1 font-medium opacity-90">{item.teacher}</div>
                                        <div className="text-[10px] mt-0.5 flex items-center justify-between opacity-80">
                                          <span>{item.room}</span>
                                          <span className="font-semibold text-[9px] uppercase tracking-wider">{getCategoryName(item.category)}</span>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-stone-300 italic text-[11px] p-2">-</div>
                                    )}
                                  </td>
                                );
                              })}
                          </tr>
                        );
                      })}

                      {/* Almoço Escolar & Descanso */}
                      <tr className="bg-emerald-900 text-white font-semibold">
                        <td className="py-3 px-4 font-bold flex items-center gap-1.5 text-emerald-200">
                          <Utensils className="w-4 h-4 text-emerald-300" />
                          <span>12:00 - 13:20</span>
                        </td>
                        <td colSpan={selectedDayKey === 'todos' ? 5 : 1} className="py-3 px-4 border-l border-emerald-800">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                            <span className="font-bold text-emerald-100">Almoço Escolar Completo & Intervalo de Descanso Orientado (1h20m)</span>
                            <span className="text-[10px] text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-700/60 w-fit">
                              Refeitório Climatizado · Sala de Jogos e Leitura na Biblioteca
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* Aulas 6 e 7 */}
                      {[6, 7].map(slotNum => {
                        const timeMap: Record<number, string> = {
                          6: '13:20 - 14:10',
                          7: '14:10 - 15:00',
                        };

                        return (
                          <tr key={slotNum} className="hover:bg-stone-50/80 transition-colors">
                            <td className="py-3 px-4 font-bold text-stone-700 whitespace-nowrap bg-stone-50/50">
                              <div className="text-emerald-900 font-black">{slotNum}ª Aula</div>
                              <div className="text-[10px] text-stone-500 font-normal">{timeMap[slotNum]}</div>
                            </td>
                            {daysList
                              .filter(d => selectedDayKey === 'todos' || selectedDayKey === d.key)
                              .map(d => {
                                const dayItems = getFilteredItemsForDay(d.key);
                                const item = dayItems.find(it => it.slotNumber === slotNum);

                                return (
                                  <td key={d.key} className="py-3 px-4 border-l border-stone-100 align-top">
                                    {item ? (
                                      <div className={`p-2.5 rounded-xl border transition-all ${getCategoryBadgeClass(item.category)}`}>
                                        <div className="font-bold text-xs leading-snug">{item.subject}</div>
                                        <div className="text-[11px] mt-1 font-medium opacity-90">{item.teacher}</div>
                                        <div className="text-[10px] mt-0.5 flex items-center justify-between opacity-80">
                                          <span>{item.room}</span>
                                          <span className="font-semibold text-[9px] uppercase tracking-wider">{getCategoryName(item.category)}</span>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-stone-300 italic text-[11px] p-2">-</div>
                                    )}
                                  </td>
                                );
                              })}
                          </tr>
                        );
                      })}

                      {/* Lanche da Tarde */}
                      <tr className="bg-amber-50/70 border-y border-amber-200/80">
                        <td className="py-2.5 px-4 font-bold text-amber-950 flex items-center gap-1.5">
                          <Coffee className="w-3.5 h-3.5 text-amber-700" />
                          <span>15:00 - 15:20</span>
                        </td>
                        <td colSpan={selectedDayKey === 'todos' ? 5 : 1} className="py-2 px-4 text-amber-900 font-medium border-l border-amber-100">
                          <div className="flex items-center justify-between">
                            <span>Intervalo / Lanche Nutritivo da Tarde & Hidratação</span>
                            <span className="text-[10px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded font-bold">20 min</span>
                          </div>
                        </td>
                      </tr>

                      {/* Aulas 8 e 9 */}
                      {[8, 9].map(slotNum => {
                        const timeMap: Record<number, string> = {
                          8: '15:20 - 16:10',
                          9: '16:10 - 17:00',
                        };

                        return (
                          <tr key={slotNum} className="hover:bg-stone-50/80 transition-colors">
                            <td className="py-3 px-4 font-bold text-stone-700 whitespace-nowrap bg-stone-50/50">
                              <div className="text-emerald-900 font-black">{slotNum}ª Aula</div>
                              <div className="text-[10px] text-stone-500 font-normal">{timeMap[slotNum]}</div>
                            </td>
                            {daysList
                              .filter(d => selectedDayKey === 'todos' || selectedDayKey === d.key)
                              .map(d => {
                                const dayItems = getFilteredItemsForDay(d.key);
                                const item = dayItems.find(it => it.slotNumber === slotNum);

                                return (
                                  <td key={d.key} className="py-3 px-4 border-l border-stone-100 align-top">
                                    {item ? (
                                      <div className={`p-2.5 rounded-xl border transition-all ${getCategoryBadgeClass(item.category)}`}>
                                        <div className="font-bold text-xs leading-snug">{item.subject}</div>
                                        <div className="text-[11px] mt-1 font-medium opacity-90">{item.teacher}</div>
                                        <div className="text-[10px] mt-0.5 flex items-center justify-between opacity-80">
                                          <span>{item.room}</span>
                                          <span className="font-semibold text-[9px] uppercase tracking-wider">{getCategoryName(item.category)}</span>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-stone-300 italic text-[11px] p-2">-</div>
                                    )}
                                  </td>
                                );
                              })}
                          </tr>
                        );
                      })}

                      {/* Saída 17:00 */}
                      <tr className="bg-emerald-950 text-emerald-200">
                        <td className="py-2.5 px-4 font-bold flex items-center gap-1.5">
                          <Sun className="w-3.5 h-3.5 text-emerald-400" />
                          <span>17:00</span>
                        </td>
                        <td colSpan={selectedDayKey === 'todos' ? 5 : 1} className="py-2 px-4 border-l border-emerald-900 text-xs">
                          <div className="flex items-center justify-between">
                            <span>Término das Atividades do Tempo Integral & Embarque no Transporte Escolar</span>
                            <span className="text-[10px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded border border-emerald-800">
                              Campo Alegre do Fidalgo - PI
                            </span>
                          </div>
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Daily Cards View */}
            {scheduleViewMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {daysList
                  .filter(d => selectedDayKey === 'todos' || selectedDayKey === d.key)
                  .map(d => {
                    const items = getFilteredItemsForDay(d.key);

                    return (
                      <div key={d.key} className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                          <h4 className="font-black text-lg text-emerald-950 flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-emerald-600" />
                            <span>{d.label}</span>
                          </h4>
                          <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-full">
                            {items.length} Aulas
                          </span>
                        </div>

                        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                          {items.map(item => (
                            <div 
                              key={item.id}
                              className={`p-3 rounded-2xl border text-xs ${getCategoryBadgeClass(item.category)}`}
                            >
                              <div className="flex items-center justify-between font-semibold text-[11px] opacity-80 mb-1">
                                <span>{item.slotNumber}ª Aula · {item.timeSlot}</span>
                                <span>{item.room}</span>
                              </div>
                              <h5 className="font-bold text-sm leading-tight text-stone-900">{item.subject}</h5>
                              <div className="flex items-center justify-between mt-1 text-[11px] font-medium opacity-90">
                                <span>{item.teacher}</span>
                                <span className="text-[9px] uppercase font-bold tracking-wider">{getCategoryName(item.category)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Quick Actions & Download Advice */}
            <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-bold text-emerald-950 text-base">Precisa da grade impressa para colocar no caderno ou na geladeira?</h4>
                <p className="text-stone-600 text-xs sm:text-sm">
                  Utilize o botão de impressão para gerar um PDF oficial diagramado e pronto para os alunos e famílias.
                </p>
              </div>
              <button
                onClick={handlePrintSchedule}
                className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Grade da Turma</span>
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ROTINA DIÁRIA DO TEMPO INTEGRAL                                    */}
        {/* ========================================================================= */}
        {activeTab === 'rotina' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              <div className="max-w-3xl mb-8">
                <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">Metodologia Integral</span>
                <h3 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                  Como Funciona o Dia a Dia no CETI?
                </h3>
                <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
                  No Centro Estadual de Tempo Integral Verônica Celestina Dias, a jornada de <strong>07:00 às 17:00</strong> integra o currículo regular com atividades práticas, estudo orientado, alimentação completa e protagonismo juvenil.
                </p>
              </div>

              {/* Timeline of the Day */}
              <div className="space-y-4">
                {DAILY_ROUTINE.map((slot, index) => {
                  const isMeal = slot.type === 'refeicao';
                  const isAcolhimento = slot.type === 'acolhimento';
                  const isClose = slot.type === 'encerramento';

                  return (
                    <div 
                      key={index}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isMeal
                          ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                          : isAcolhimento
                          ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                          : isClose
                          ? 'bg-emerald-950 text-white border-emerald-900'
                          : 'bg-white border-stone-200 hover:border-emerald-200 text-stone-900'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className={`p-2.5 rounded-xl shrink-0 ${
                          isMeal
                            ? 'bg-amber-200 text-amber-900'
                            : isAcolhimento
                            ? 'bg-emerald-200 text-emerald-900'
                            : isClose
                            ? 'bg-emerald-800 text-emerald-200'
                            : 'bg-stone-100 text-stone-700'
                        }`}>
                          {isMeal ? (
                            <Utensils className="w-5 h-5" />
                          ) : isAcolhimento ? (
                            <Coffee className="w-5 h-5" />
                          ) : isClose ? (
                            <Sun className="w-5 h-5" />
                          ) : (
                            <Clock className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                              isClose ? 'bg-emerald-900 text-emerald-300' : 'bg-stone-200/80 text-stone-800'
                            }`}>
                              {slot.time}
                            </span>
                            <span className="font-bold text-sm sm:text-base">{slot.title}</span>
                          </div>
                          <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                            isClose ? 'text-emerald-200/80' : 'text-stone-600'
                          }`}>
                            {slot.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          isMeal
                            ? 'bg-amber-200 text-amber-900'
                            : isAcolhimento
                            ? 'bg-emerald-200 text-emerald-900'
                            : isClose
                            ? 'bg-emerald-900 text-emerald-200 border border-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {slot.type === 'refeicao' ? 'Alimentação Gratuita' : slot.type === 'acolhimento' ? 'Acolhida' : slot.type === 'encerramento' ? 'Encerramento' : 'Tempo Pedagógico'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SOBRE A ESCOLA & ESTRUTURA                                         */}
        {/* ========================================================================= */}
        {activeTab === 'geral' && (
          <div className="space-y-8">
            
            {/* Overview cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Institutional Overview */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
                <div>
                  <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">Identidade Institucional</span>
                  <h3 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                    Centro Estadual de Tempo Integral Verônica Celestina Dias
                  </h3>
                  <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
                    O <strong>CETI Verônica Celestina Dias</strong> é a principal referência pública estadual de Ensino Médio de Tempo Integral no município de <strong>Campo Alegre do Fidalgo - PI</strong>. 
                  </p>
                  <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
                    Com foco no protagonismo juvenil, o modelo de tempo integral proporciona aos jovens a permanência segura no espaço escolar ao longo de todo o dia, com 4 refeições diárias balanceadas, preparação contínua para o ENEM, laboratórios de ciências e informática, robótica e biblioteca digital ativa.
                  </p>
                </div>

                {/* Key Facts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">Modalidade de Ensino</p>
                    <p className="font-black text-base text-stone-900 mt-0.5">Ensino Médio em Tempo Integral</p>
                    <p className="text-xs text-stone-600 mt-1">1ª, 2ª e 3ª Série com Itinerários Formativos.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">Vínculo Governamental</p>
                    <p className="font-black text-base text-stone-900 mt-0.5">Governo do Estado do Piauí</p>
                    <p className="text-xs text-stone-600 mt-1">Secretaria de Estado da Educação (SEDUC-PI).</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">Alimentação Escolar</p>
                    <p className="font-black text-base text-stone-900 mt-0.5">4 Refeições Diárias</p>
                    <p className="text-xs text-stone-600 mt-1">Café da manhã, lanche matutino, almoço e lanche da tarde.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">Carga Horária Anual</p>
                    <p className="font-black text-base text-stone-900 mt-0.5">1.400+ Horas / Ano</p>
                    <p className="text-xs text-stone-600 mt-1">Tempo ampliado para tutoria, projetos de vida e esportes.</p>
                  </div>
                </div>

                {/* Address & Contacts */}
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>Dados de Localização & Contato Oficial</span>
                  </h4>
                  <div className="text-xs sm:text-sm text-stone-600 space-y-1.5">
                    <p><strong>Endereço:</strong> R. Marino Caetano, Campo Alegre do Fidalgo - PI, CEP: 64767-000</p>
                    <p><strong>Telefone / WhatsApp da Secretaria:</strong> <a href="tel:+558994107024" className="text-emerald-800 font-bold underline hover:text-emerald-950">+55 89 9410-7024</a></p>
                    <p><strong>Horário de Atendimento da Secretaria:</strong> 08:00 às 16:00 (Segunda a Sexta-feira)</p>
                  </div>
                  <div className="pt-2">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=R.+Marino+Caetano,+Campo+Alegre+do+Fidalgo+-+PI,+64767-000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline"
                    >
                      <span>Abrir rota no Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

              </div>

              {/* Real Photos & Spaces */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Real Photo Card 1: Fachada */}
                <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-sm space-y-3">
                  <div className="rounded-2xl overflow-hidden bg-stone-100">
                    <img 
                      src={fachadaImg} 
                      alt="Fachada oficial e entrada do CETI Verônica Celestina Dias" 
                      className="w-full h-56 object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Entrada Principal & Fachada</h4>
                    <p className="text-stone-500 text-xs mt-0.5">Pórtico institucional com rampa acessível e guarita de controle.</p>
                  </div>
                </div>

                {/* Real Photo Card 2: Pátio & Escada */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-3xl p-3 border border-stone-200 shadow-sm space-y-2">
                    <div className="rounded-xl overflow-hidden bg-stone-100">
                      <img 
                        src={patioImg} 
                        alt="Pátio e área interna de convivência do CETI" 
                        className="w-full h-32 object-cover"
                      />
                    </div>
                    <p className="text-[11px] font-bold text-stone-800">Pátio de Convivência</p>
                  </div>

                  <div className="bg-white rounded-3xl p-3 border border-stone-200 shadow-sm space-y-2">
                    <div className="rounded-xl overflow-hidden bg-stone-100">
                      <img 
                        src={escadaImg} 
                        alt="Acesso às salas de aula do piso superior" 
                        className="w-full h-32 object-cover"
                      />
                    </div>
                    <p className="text-[11px] font-bold text-stone-800">Bloco Didático</p>
                  </div>
                </div>

                {/* Facilities List */}
                <div className="bg-emerald-950 text-white rounded-3xl p-6 space-y-4">
                  <h4 className="font-bold text-base text-emerald-200 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-400" />
                    <span>Ambientes & Estrutura Física</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-emerald-100/90">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Salas de aula com carteiras modernas e climatização</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Laboratório de Ciências da Natureza (Biologia, Física e Química)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Laboratório de Informática Conectado com Internet Banda Larga</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Biblioteca Escolar Física e Digital com Acervo Completo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Refeitório Amplo para as 4 refeições diárias</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Quadra Poliesportiva para Educação Física e Campeonatos</span>
                    </li>
                  </ul>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CALENDÁRIO LETIVO 2026                                             */}
        {/* ========================================================================= */}
        {activeTab === 'calendario' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              <div className="max-w-3xl mb-8">
                <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">Cronograma Acadêmico</span>
                <h3 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                  Calendário Escolar Oficial - Ano Letivo 2026
                </h3>
                <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
                  Confira as principais datas de início de bimestres, semanas de avaliações, simulados do ENEM, feiras científicas e recessos escolares homologados pela SEDUC Piauí.
                </p>
              </div>

              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {SCHOOL_CALENDAR_2026.map((event, index) => {
                  const isCurrent = event.status === 'vigente';
                  const isDone = event.status === 'concluido';

                  return (
                    <div 
                      key={index}
                      className={`p-5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-500/20'
                          : isDone
                          ? 'bg-stone-50 border-stone-200 opacity-80'
                          : 'bg-white border-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          isCurrent
                            ? 'bg-emerald-700 text-white'
                            : isDone
                            ? 'bg-stone-200 text-stone-700'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {event.badge}
                        </span>

                        <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          <span>{event.period}</span>
                        </span>
                      </div>

                      <h4 className="font-bold text-base text-stone-900">{event.title}</h4>
                      <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                        <span className="text-stone-500">Status:</span>
                        <span className={`font-bold ${
                          isCurrent ? 'text-emerald-800' : isDone ? 'text-stone-500' : 'text-blue-700'
                        }`}>
                          {isCurrent ? '● Em andamento' : isDone ? '✓ Concluído' : '○ Previsto'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: NORMAS & CONVIVÊNCIA                                                */}
        {/* ========================================================================= */}
        {activeTab === 'normas' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              <div className="max-w-3xl mb-8">
                <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">Regulamento Escolar</span>
                <h3 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                  Guia de Convivência e Orientações às Famílias
                </h3>
                <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
                  Para garantir um ambiente de aprendizado seguro, harmonioso e produtivo, solicitamos aos estudantes e responsáveis a observância das normas institucionais.
                </p>
              </div>

              {/* Rules Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SCHOOL_RULES_GUIDE.map((rule, index) => (
                  <div key={index} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider bg-emerald-100 px-2 py-0.5 rounded">
                        {rule.highlight}
                      </span>
                      <h4 className="font-bold text-base text-stone-900 mt-2">{rule.title}</h4>
                    </div>

                    <ul className="space-y-2 text-xs text-stone-600">
                      {rule.items.map((it, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Direct Link to Bullying Report in Norms Tab */}
              <div className="mt-8 p-6 rounded-3xl bg-emerald-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-bold text-base text-emerald-200">Presenciou ou foi vítima de intimidação ou discriminação?</h4>
                  <p className="text-xs sm:text-sm text-emerald-100/80">
                    O CETI possui um canal oficial dedicado para acolhimento e atuação imediata da direção.
                  </p>
                </div>
                {onOpenBullyingReport && (
                  <button
                    onClick={onOpenBullyingReport}
                    className="inline-flex items-center gap-2 bg-emerald-300 hover:bg-emerald-200 text-emerald-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
                  >
                    <ShieldAlert className="w-4 h-4 text-emerald-950" />
                    <span>Acessar Canal de Bullying</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: GESTÃO & EQUIPE                                                    */}
        {/* ========================================================================= */}
        {activeTab === 'equipe' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              <div className="max-w-3xl mb-8">
                <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">Equipe Escolar</span>
                <h3 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                  Direção, Coordenação e Atendimento
                </h3>
                <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
                  Conheça os setores responsáveis pela gestão pedagógica, administrativa e bem-estar dos nossos alunos no CETI Verônica Celestina Dias.
                </p>
              </div>

              {/* Staff Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {SCHOOL_STAFF.map((member, index) => (
                  <div key={index} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-full">
                        {member.role}
                      </span>
                      {member.contact && (
                        <span className="text-xs font-medium text-stone-600">
                          {member.contact}
                        </span>
                      )}
                    </div>
                    
                    <h4 className="font-bold text-base text-stone-900">{member.name}</h4>
                    <p className="text-xs text-stone-500 font-medium">{member.department}</p>
                    <p className="text-xs text-stone-600 leading-relaxed pt-1">
                      {member.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Contact Callout */}
              <div className="mt-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm">Deseja agendar uma reunião com a coordenação ou direção?</h4>
                  <p className="text-stone-600 text-xs mt-0.5">
                    Entre em contato com a secretaria pelo WhatsApp ou telefone durante o horário comercial.
                  </p>
                </div>
                <a
                  href="tel:+558994107024"
                  className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-xs shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Ligar: (89) 9410-7024</span>
                </a>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-200/90 py-10 border-t border-emerald-900 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div className="flex items-center space-x-2.5">
              <img 
                src="/assets/aistudio/branco_transparente_0a853876.png" 
                alt="Logo CETI Verônica Celestina Dias" 
                className="h-8 w-8 object-contain drop-shadow-sm brightness-110" 
              />
              <span className="font-bold text-lg text-white">CETI Verônica Celestina Dias</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-emerald-300">
              <button onClick={onBackToHome} className="hover:text-white underline cursor-pointer">
                Página Inicial
              </button>
              {onOpenLibrary && (
                <button onClick={onOpenLibrary} className="hover:text-white underline cursor-pointer">
                  Biblioteca Digital
                </button>
              )}
              {onOpenBullyingReport && (
                <button onClick={onOpenBullyingReport} className="hover:text-white underline cursor-pointer">
                  Canal de Denúncia
                </button>
              )}
              {onOpenAdminLogin && (
                <button onClick={onOpenAdminLogin} className="hover:text-white underline cursor-pointer">
                  Área da Gestão
                </button>
              )}
            </div>

            <p className="text-xs text-emerald-400/80">
              R. Marino Caetano · Campo Alegre do Fidalgo - PI
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
