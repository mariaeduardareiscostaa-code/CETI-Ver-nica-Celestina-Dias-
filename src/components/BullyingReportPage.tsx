import React, { useState } from 'react';
import { 
  ShieldAlert, 
  UserCheck, 
  Lock, 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  HeartHandshake, 
  AlertTriangle, 
  LifeBuoy, 
  Copy, 
  Check, 
  GraduationCap,
  MessageCircleWarning,
  User,
  Users,
  Phone,
  School,
  FileCheck
} from 'lucide-react';

interface BullyingReportPageProps {
  onBackToHome: () => void;
}

export default function BullyingReportPage({ onBackToHome }: BullyingReportPageProps) {
  // Identificação da Vítima (Obrigatória para a gestão)
  const [victimName, setVictimName] = useState('');
  const [victimGrade, setVictimGrade] = useState('');
  const [victimShift, setVictimShift] = useState('Tempo Integral');
  const [victimMatricula, setVictimMatricula] = useState('');

  // Identificação do Denunciante
  const [reporterRole, setReporterRole] = useState<'vitima' | 'colega' | 'professor' | 'responsavel' | 'outro'>('vitima');
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [sameAsVictim, setSameAsVictim] = useState(true);

  // Envolvidos / Agressores
  const [aggressorNames, setAggressorNames] = useState('');
  const [aggressorGrade, setAggressorGrade] = useState('');

  // Detalhes da Agressão
  const [reportType, setReportType] = useState('');
  const [location, setLocation] = useState('');
  const [frequency, setFrequency] = useState('');
  const [incidentDate, setIncidentDate] = useState('esta_semana');
  const [description, setDescription] = useState('');
  const [supportDesired, setSupportDesired] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [protocolCode, setProtocolCode] = useState<string | null>(null);
  const [submittedVictimName, setSubmittedVictimName] = useState('');
  const [copied, setCopied] = useState(false);

  const supportOptions = [
    'Conversa confidencial imediata da coordenação com a vítima',
    'Apoio psicopedagógico e acolhimento emocional escolar',
    'Convocação reservada da família dos envolvidos pela direção',
    'Aplicação das medidas disciplinares do regimento escolar do CETI',
    'Aumento de supervisão e ronda de inspetores no local indicado',
    'Mediação pacífica na turma sem expor a vítima aos agressores'
  ];

  // Auto-sync reporter name when reporter is the victim
  const handleRoleChange = (role: 'vitima' | 'colega' | 'professor' | 'responsavel' | 'outro') => {
    setReporterRole(role);
    if (role === 'vitima') {
      setSameAsVictim(true);
      if (victimName) setReporterName(victimName);
    } else {
      setSameAsVictim(false);
      setReporterName('');
    }
  };

  const handleVictimNameChange = (val: string) => {
    setVictimName(val);
    if (sameAsVictim || reporterRole === 'vitima') {
      setReporterName(val);
    }
  };

  const handleToggleSupport = (option: string) => {
    if (supportDesired.includes(option)) {
      setSupportDesired(supportDesired.filter(item => item !== option));
    } else {
      setSupportDesired([...supportDesired, option]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const effectiveReporterName = reporterRole === 'vitima' ? victimName : reporterName;

    setTimeout(() => {
      const randomCode = 'VCD-DEN-' + Math.floor(100000 + Math.random() * 900000);
      setProtocolCode(randomCode);
      setSubmittedVictimName(victimName);
      setIsSubmitting(false);

      // Save report with identified victim in localStorage for school management
      try {
        const existing = JSON.parse(localStorage.getItem('vcd_bullying_reports') || '[]');
        existing.unshift({
          id: randomCode,
          victimName: victimName.trim(),
          victimGrade: victimGrade.trim(),
          victimShift,
          victimMatricula: victimMatricula.trim() || undefined,
          reporterRole,
          reporterName: effectiveReporterName.trim(),
          reporterContact: reporterContact.trim(),
          aggressorNames: aggressorNames.trim() || 'Não informados',
          aggressorGrade: aggressorGrade.trim() || undefined,
          type: reportType,
          location,
          frequency,
          incidentDate,
          description: description.trim(),
          supportDesired,
          date: new Date().toISOString(),
          status: 'Pendente',
          internalNotes: 'Denúncia registrada com vítima identificada. Aguardando triagem da coordenação.'
        });
        localStorage.setItem('vcd_bullying_reports', JSON.stringify(existing));
      } catch {
        // Fallback gracefully
      }
    }, 1000);
  };

  const handleReset = () => {
    setVictimName('');
    setVictimGrade('');
    setVictimShift('Tempo Integral');
    setVictimMatricula('');
    setReporterRole('vitima');
    setReporterName('');
    setReporterContact('');
    setSameAsVictim(true);
    setAggressorNames('');
    setAggressorGrade('');
    setReportType('');
    setLocation('');
    setFrequency('');
    setIncidentDate('esta_semana');
    setDescription('');
    setSupportDesired([]);
    setProtocolCode(null);
    setSubmittedVictimName('');
    setCopied(false);
  };

  const handleCopyProtocol = () => {
    if (protocolCode) {
      navigator.clipboard.writeText(protocolCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="bg-emerald-950 text-white border-b border-emerald-900 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-900 rounded-lg text-emerald-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg block leading-tight">Canal de Denúncia & Acolhimento à Vítima</span>
              <span className="text-xs text-emerald-300/80 hidden sm:block">CETI Verônica Celestina Dias · Identificação Segura para Ação da Gestão</span>
            </div>
          </div>

          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 hover:text-white transition-colors border border-emerald-800 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Portal Principal</span>
          </button>
        </div>
      </header>

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-900 text-white py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-800/90 border border-emerald-700 text-emerald-300 text-xs font-semibold tracking-wide">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Identificação Obrigatória da Vítima · Ação Rápida da Gestão</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Acolhimento Direto e Proteção à Vítima. <br className="hidden sm:inline" />
            <span className="text-emerald-300">A escola age para proteger você.</span>
          </h1>

          <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Para que a direção e a coordenação pedagógica possam intervir diretamente, acolher a vítima e aplicar as medidas de proteção cabíveis, <strong className="text-white">a denúncia agora requer a identificação da vítima que está sofrendo o bullying</strong>, assegurando total sigilo institucional perante os demais alunos.
          </p>

          {/* 3 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left">
            <div className="bg-emerald-950/70 p-4 rounded-xl border border-emerald-800/80">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm mb-1">
                <UserCheck className="w-4 h-4" />
                <span>Vítima Identificada</span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                A gestão sabe exatamente quem precisa de apoio imediato e acompanhamento pedagógico.
              </p>
            </div>

            <div className="bg-emerald-950/70 p-4 rounded-xl border border-emerald-800/80">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm mb-1">
                <Lock className="w-4 h-4" />
                <span>Sigilo Institucional</span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Os dados são restritos à Direção e Coordenação. Os agressores não sabem quem fez o relato.
              </p>
            </div>

            <div className="bg-emerald-950/70 p-4 rounded-xl border border-emerald-800/80">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm mb-1">
                <HeartHandshake className="w-4 h-4" />
                <span>Intervenção Rápida</span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                A escola pode chamar os responsáveis, prestar apoio psicossocial e cessar a intimidação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-grow w-full space-y-10">
        
        {/* Success Protocol View */}
        {protocolCode ? (
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-emerald-200 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                Denúncia Registrada na Gestão Escolar
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-950">
                Relato Enviado com Sucesso!
              </h2>
              <p className="text-stone-600 max-w-lg mx-auto text-sm sm:text-base">
                A identificação da vítima <strong className="text-emerald-900 font-bold">{submittedVictimName}</strong> foi registrada no painel da direção e coordenação do CETI Verônica Celestina Dias. Nossa equipe iniciará as providências com total discrição e acolhimento.
              </p>
            </div>

            {/* Protocol Display */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 max-w-md mx-auto">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
                Número do Protocolo da Ocorrência
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-2xl font-bold text-emerald-950 tracking-wider">
                  {protocolCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyProtocol}
                  className="p-1.5 text-emerald-800 hover:text-emerald-950 hover:bg-emerald-200/70 rounded-md transition-colors cursor-pointer"
                  title="Copiar protocolo"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-emerald-700 mt-2">
                Guarde este código para acompanhar o caso junto à coordenação pedagógica da escola.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl border border-emerald-300 text-emerald-800 font-semibold hover:bg-emerald-50 transition-colors text-sm cursor-pointer"
              >
                Registrar Outra Ocorrência
              </button>
              <button
                type="button"
                onClick={onBackToHome}
                className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold transition-colors text-sm cursor-pointer shadow-sm"
              >
                Voltar à Página Principal
              </button>
            </div>
          </div>
        ) : (
          /* Form for Identifying Victim and Reporting */
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200 space-y-8">
            <div className="border-b border-stone-200 pb-5">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
                <FileCheck className="w-4 h-4" />
                <span>Formulário de Identificação da Vítima & Relato Escolar</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 flex items-center gap-2">
                <MessageCircleWarning className="w-7 h-7 text-emerald-700 shrink-0" />
                <span>Registro de Bullying com Identificação</span>
              </h2>
              <p className="text-stone-600 text-sm mt-1 leading-relaxed">
                Preencha os dados abaixo. As informações da vítima e do relato serão enviadas diretamente para a tela de gestão da coordenação pedagógica e direção do CETI Verônica Celestina Dias.
              </p>
            </div>

            {/* SECTION 1: IDENTIFICAÇÃO DA VÍTIMA */}
            <div className="bg-emerald-50/50 p-5 sm:p-6 rounded-2xl border border-emerald-200 space-y-5">
              <div className="flex items-center gap-2 text-emerald-950">
                <UserCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-base sm:text-lg">1. Identificação da Vítima de Bullying (Obrigatório)</h3>
              </div>
              <p className="text-xs text-emerald-800/90 leading-relaxed">
                Informe quem está sofrendo as agressões para que a direção possa chamar a vítima com discrição e prestar o devido acolhimento pedagógico.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="victimName" className="block text-sm font-semibold text-stone-800">
                    Nome Completo do(a) Aluno(a) Vítima *
                  </label>
                  <input
                    type="text"
                    id="victimName"
                    required
                    value={victimName}
                    onChange={(e) => handleVictimNameChange(e.target.value)}
                    placeholder="Ex: Lucas Gabriel da Silva Mendonça"
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-stone-900 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="victimGrade" className="block text-sm font-semibold text-stone-800">
                    Turma / Ano Escolar da Vítima *
                  </label>
                  <select
                    id="victimGrade"
                    required
                    value={victimGrade}
                    onChange={(e) => setVictimGrade(e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-stone-900 text-sm cursor-pointer"
                  >
                    <option value="">Selecione a turma...</option>
                    <option value="1º Ano A - Ensino Médio Integral">1º Ano A - Ensino Médio Integral</option>
                    <option value="1º Ano B - Ensino Médio Integral">1º Ano B - Ensino Médio Integral</option>
                    <option value="2º Ano A - Ensino Médio Integral">2º Ano A - Ensino Médio Integral</option>
                    <option value="2º Ano B - Ensino Médio Integral">2º Ano B - Ensino Médio Integral</option>
                    <option value="3º Ano A - Ensino Médio Integral">3º Ano A - Ensino Médio Integral</option>
                    <option value="3º Ano B - Ensino Médio Integral">3º Ano B - Ensino Médio Integral</option>
                    <option value="Outra Turma / Ensino Fundamental">Outra Turma / Ensino Fundamental</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="victimShift" className="block text-sm font-semibold text-stone-800">
                    Turno da Vítima *
                  </label>
                  <select
                    id="victimShift"
                    value={victimShift}
                    onChange={(e) => setVictimShift(e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-stone-900 text-sm cursor-pointer"
                  >
                    <option value="Tempo Integral">Tempo Integral (7h30 às 16h40)</option>
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="victimMatricula" className="block text-sm font-semibold text-stone-800">
                    Matrícula Escolar da Vítima <span className="text-stone-400 font-normal">(Opcional se souber)</span>
                  </label>
                  <input
                    type="text"
                    id="victimMatricula"
                    value={victimMatricula}
                    onChange={(e) => setVictimMatricula(e.target.value)}
                    placeholder="Ex: 2025-VCD-0891 (opcional)"
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-stone-900 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: QUEM ESTÁ RELATANDO */}
            <div className="bg-stone-50 p-5 sm:p-6 rounded-2xl border border-stone-200 space-y-4">
              <div className="flex items-center gap-2 text-stone-900">
                <User className="w-5 h-5 text-emerald-800" />
                <h3 className="font-bold text-base sm:text-lg">2. Quem está registrando esta denúncia? *</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {[
                  { id: 'vitima', label: 'Eu sou a própria vítima', desc: 'Estou sofrendo o bullying' },
                  { id: 'colega', label: 'Colega de turma / amigo', desc: 'Presenciei a agressão' },
                  { id: 'responsavel', label: 'Pai, Mãe ou Responsável', desc: 'Família do aluno' },
                  { id: 'professor', label: 'Professor(a) / Servidor', desc: 'Equipe da escola' },
                  { id: 'outro', label: 'Outro membro da escola', desc: 'Comunidade escolar' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleRoleChange(item.id as any)}
                    className={`p-3 text-left rounded-xl border text-sm transition-all cursor-pointer ${
                      reporterRole === item.id
                        ? 'bg-emerald-100/70 border-emerald-600 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="block font-bold">{item.label}</span>
                    <span className="text-xs text-stone-500 font-normal">{item.desc}</span>
                  </button>
                ))}
              </div>

              {/* Informações de contato de quem relata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label htmlFor="reporterName" className="block text-sm font-semibold text-stone-800">
                    Nome de quem está registrando *
                  </label>
                  <input
                    type="text"
                    id="reporterName"
                    required
                    value={reporterRole === 'vitima' ? victimName : reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    disabled={reporterRole === 'vitima'}
                    placeholder={reporterRole === 'vitima' ? 'Mesmo nome da vítima preenchido acima' : 'Seu nome completo'}
                    className={`w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-stone-900 text-sm ${
                      reporterRole === 'vitima' ? 'bg-stone-100 text-stone-600 cursor-not-allowed' : 'bg-white'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reporterContact" className="block text-sm font-semibold text-stone-800">
                    Telefone / WhatsApp para contato da gestão *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      id="reporterContact"
                      required
                      value={reporterContact}
                      onChange={(e) => setReporterContact(e.target.value)}
                      placeholder="Ex: (89) 99400-0000 ou seu e-mail"
                      className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-stone-900 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: QUEM SÃO OS AGRESSORES */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-stone-900">
                <Users className="w-5 h-5 text-emerald-800" />
                <h3 className="font-bold text-base sm:text-lg">3. Quem está praticando o bullying? (Identificação dos Agressores)</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="aggressorNames" className="block text-sm font-semibold text-stone-800">
                    Nome(s) ou apelido(s) dos agressores: *
                  </label>
                  <input
                    type="text"
                    id="aggressorNames"
                    required
                    value={aggressorNames}
                    onChange={(e) => setAggressorNames(e.target.value)}
                    placeholder="Ex: João Silva e Pedro (se souber os nomes)"
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-stone-900 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="aggressorGrade" className="block text-sm font-semibold text-stone-800">
                    Turma dos agressores (se souber):
                  </label>
                  <input
                    type="text"
                    id="aggressorGrade"
                    value={aggressorGrade}
                    onChange={(e) => setAggressorGrade(e.target.value)}
                    placeholder="Ex: 2º Ano B ou Mesma turma da vítima"
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-stone-900 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: TIPO, LOCAL E FREQUÊNCIA */}
            <div className="space-y-4">
              <h3 className="font-bold text-base sm:text-lg text-stone-900">4. Informações sobre a Agressão</h3>

              <div className="space-y-2">
                <label htmlFor="reportType" className="block text-sm font-semibold text-stone-800">
                  Qual tipo de agressão ou bullying está ocorrendo? *
                </label>
                <select
                  id="reportType"
                  required
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-stone-900 text-sm cursor-pointer"
                >
                  <option value="">Selecione o tipo principal...</option>
                  <option value="verbal">Bullying Verbal (xingamentos, apelidos humilhantes, difamação, zombarias)</option>
                  <option value="fisico">Bullying Físico (empurrões, socos, tapas, beliscões, agressão corporal)</option>
                  <option value="psicologico">Bullying Psicológico / Exclusão (isolamento forçado, perseguição, chantagens)</option>
                  <option value="cyber">Cyberbullying (ofensas no WhatsApp, figurinhas constrangedoras, redes sociais)</option>
                  <option value="patrimonial">Dano ao Patrimônio (rasgar cadernos, esconder mochilas, furto de lanche/material)</option>
                  <option value="ameaca">Ameaças e Intimidação física ou verbal direta</option>
                  <option value="outro">Outro tipo de constrangimento ou assédio moral</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="location" className="block text-sm font-semibold text-stone-800">
                    Onde costuma acontecer? *
                  </label>
                  <select
                    id="location"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-stone-900 text-sm cursor-pointer"
                  >
                    <option value="">Selecione o local...</option>
                    <option value="sala">Dentro da sala de aula</option>
                    <option value="patio">No pátio / recreio</option>
                    <option value="banheiro">Nos banheiros</option>
                    <option value="quadra">Na quadra poliesportiva</option>
                    <option value="portao">No portão / entrada ou saída</option>
                    <option value="transporte">No transporte escolar / caminho</option>
                    <option value="internet">Pela internet / WhatsApp / Instagram</option>
                    <option value="outro">Em outro local da escola</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="frequency" className="block text-sm font-semibold text-stone-800">
                    Frequência da agressão: *
                  </label>
                  <select
                    id="frequency"
                    required
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-stone-900 text-sm cursor-pointer"
                  >
                    <option value="">Selecione a frequência...</option>
                    <option value="diaria">Todos os dias / quase diariamente</option>
                    <option value="semanal">Semanalmente</option>
                    <option value="recente">Começou recentemente (esta semana)</option>
                    <option value="pontual">Fato grave pontual/específico</option>
                    <option value="antigo">Já dura há meses</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="incidentDate" className="block text-sm font-semibold text-stone-800">
                    Quando ocorreu pela última vez? *
                  </label>
                  <select
                    id="incidentDate"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-stone-900 text-sm cursor-pointer"
                  >
                    <option value="hoje">Hoje mesmo</option>
                    <option value="ontem">Ontem</option>
                    <option value="esta_semana">Esta semana</option>
                    <option value="semana_passada">Na semana passada</option>
                    <option value="mes_passado">Há mais de um mês</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 5: RELATO DETALHADO */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-semibold text-stone-800">
                5. Conte com detalhes o que está acontecendo: *
              </label>
              <p className="text-xs text-stone-500">
                Descreva episódios ocorridos, falas, agressões e o impacto que isso está trazendo no dia a dia da vítima na escola.
              </p>
              <textarea
                id="description"
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Os alunos zombam da vítima quando ela vai ao quadro, escondem o material e ameaçam no intervalo. A vítima está com receio de assistir às aulas e com medo..."
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-stone-900 text-sm leading-relaxed resize-y"
              ></textarea>
            </div>

            {/* SECTION 6: APOIO DESEJADO */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-stone-800">
                6. De que forma a gestão escolar pode agir para proteger e acolher a vítima? (Marque as opções prioritárias)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {supportOptions.map((option, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer text-xs sm:text-sm transition-colors ${
                      supportDesired.includes(option)
                        ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950 font-medium'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={supportDesired.includes(option)}
                      onChange={() => handleToggleSupport(option)}
                      className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-600 h-4 w-4 border-stone-300"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-stone-600">
                <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Dados enviados com sigilo profissional diretamente à gestão da escola.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Registrando ocorrência...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Denúncia com Vítima Identificada</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Educational & National Support Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 space-y-4">
            <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Compromisso da Gestão do CETI VCD</span>
            </h3>
            <ul className="text-sm text-stone-600 space-y-2.5 list-disc list-inside leading-relaxed">
              <li><strong>Acolhimento da Vítima:</strong> A coordenação agenda uma escuta empática e cuidadosa com a vítima.</li>
              <li><strong>Proteção sem Constrangimento:</strong> A escola não expõe a vítima diante da turma ou dos agressores.</li>
              <li><strong>Convocação Familiar:</strong> Os responsáveis legais são convocados individualmente para alinhamento.</li>
              <li><strong>Lei Antibullying (Lei 13.185/15):</strong> A escola cumpre o protocolo nacional de combate à violência sistemática.</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200 space-y-4">
            <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-emerald-700" />
              <span>Canais Nacionais de Emergência & Apoio</span>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-stone-900 block">Disque 100</span>
                  <span className="text-xs text-stone-500">Direitos Humanos e Proteção da Criança e Adolescente</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs">Ligue 100</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-stone-900 block">CVV - Centro de Valorização da Vida</span>
                  <span className="text-xs text-stone-500">Apoio emocional e acolhimento 24h</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs">Ligue 188</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-stone-900 block">Conselho Tutelar de Campo Alegre do Fidalgo</span>
                  <span className="text-xs text-stone-500">Plantão e Proteção à Infância e Juventude local</span>
                </div>
                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg font-bold text-xs">Plantão</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Subsite Footer */}
      <footer className="bg-emerald-950 text-emerald-200/90 py-8 border-t border-emerald-900 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-emerald-400" />
            <span className="font-bold text-white text-sm">CETI Verônica Celestina Dias</span>
          </div>
          <div className="text-center sm:text-right">
            <p>Canal Oficial de Acolhimento e Prevenção ao Bullying Escolar.</p>
            <p className="text-emerald-400/60 mt-0.5">R. Marino Caetano, Campo Alegre do Fidalgo - PI · +55 89 9410-7024</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
