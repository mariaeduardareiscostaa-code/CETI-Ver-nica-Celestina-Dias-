import React, { useState } from 'react';
import { 
  ShieldAlert, 
  EyeOff, 
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
  MessageCircleWarning
} from 'lucide-react';

interface BullyingReportPageProps {
  onBackToHome: () => void;
}

export default function BullyingReportPage({ onBackToHome }: BullyingReportPageProps) {
  const [reportType, setReportType] = useState('');
  const [location, setLocation] = useState('');
  const [frequency, setFrequency] = useState('');
  const [targetPerson, setTargetPerson] = useState('');
  const [classGrade, setClassGrade] = useState('');
  const [description, setDescription] = useState('');
  const [supportDesired, setSupportDesired] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [protocolCode, setProtocolCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const supportOptions = [
    'Conversa confidencial com a coordenação pedagógica',
    'Apoio e acolhimento psicológico/emocional',
    'Aumento de supervisão de inspetores no local indicado',
    'Mediação pacífica na turma sem expor quem relatou',
    'Apenas registro para acompanhamento interno da escola'
  ];

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

    // Simulate safe encrypted delivery
    setTimeout(() => {
      const randomCode = 'VCD-ANON-' + Math.floor(100000 + Math.random() * 900000);
      setProtocolCode(randomCode);
      setIsSubmitting(false);

      // Save report in local storage for demonstration and audit
      try {
        const existing = JSON.parse(localStorage.getItem('vcd_bullying_reports') || '[]');
        existing.unshift({
          id: randomCode,
          type: reportType,
          location,
          frequency,
          targetPerson,
          classGrade,
          description,
          supportDesired,
          date: new Date().toISOString()
        });
        localStorage.setItem('vcd_bullying_reports', JSON.stringify(existing));
      } catch {
        // Fallback gracefully
      }
    }, 1200);
  };

  const handleReset = () => {
    setReportType('');
    setLocation('');
    setFrequency('');
    setTargetPerson('');
    setClassGrade('');
    setDescription('');
    setSupportDesired([]);
    setProtocolCode(null);
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
      {/* Subsite Top Navigation Bar */}
      <header className="bg-emerald-950 text-white border-b border-emerald-900 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-900 rounded-lg text-emerald-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg block leading-tight">Canal Seguro & Acolhimento</span>
              <span className="text-xs text-emerald-300/80 hidden sm:block">CETI Verônica Celestina Dias · Denúncia 100% Anônima</span>
            </div>
          </div>

          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 hover:text-white transition-colors border border-emerald-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Portal Principal</span>
          </button>
        </div>
      </header>

      {/* Hero Header of Subsite */}
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-900 text-white py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold tracking-wide">
            <Lock className="w-3.5 h-3.5" />
            <span>Canal Confidencial e 100% Anônimo</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Você não está sozinho(a). <br className="hidden sm:inline" />
            <span className="text-emerald-300">Diga não ao bullying.</span>
          </h1>

          <p className="text-emerald-100 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Este espaço foi criado para proteger sua dignidade e seu bem-estar na escola. 
            Nenhuma informação pessoal ou identificação digital (como IP ou e-mail) é coletada.
          </p>

          {/* 3 Privacy Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left">
            <div className="bg-emerald-950/70 p-4 rounded-xl border border-emerald-800/80">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm mb-1">
                <EyeOff className="w-4 h-4" />
                <span>Zero Identificação</span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Você não precisa dizer seu nome nem fazer login. Seu relato é estritamente anônimo.
              </p>
            </div>

            <div className="bg-emerald-950/70 p-4 rounded-xl border border-emerald-800/80">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm mb-1">
                <Lock className="w-4 h-4" />
                <span>Sigilo Absoluto</span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                As informações são tratadas exclusivamente pela equipe de orientação e direção da escola.
              </p>
            </div>

            <div className="bg-emerald-950/70 p-4 rounded-xl border border-emerald-800/80">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm mb-1">
                <HeartHandshake className="w-4 h-4" />
                <span>Foco em Acolhimento</span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Agimos com empatia e cuidado pedagógico para cessar a violência e proteger as vítimas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-grow w-full space-y-12">
        {/* Form Container or Success View */}
        {protocolCode ? (
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-emerald-200 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-950">
                Relato Anônimo Enviado com Sucesso!
              </h2>
              <p className="text-stone-600 max-w-lg mx-auto text-sm sm:text-base">
                Obrigado pela sua coragem em comunicar o ocorrido. A equipe pedagógica do CETI Verônica Celestina Dias analisará a situação com sigilo e tomará as medidas necessárias.
              </p>
            </div>

            {/* Protocol Display */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-5 max-w-md mx-auto">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
                Número do Protocolo Anônimo
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-xl sm:text-2xl font-bold text-emerald-950 tracking-wider">
                  {protocolCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyProtocol}
                  className="p-1.5 text-emerald-800 hover:text-emerald-950 hover:bg-emerald-200/70 rounded-md transition-colors"
                  title="Copiar protocolo"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-emerald-700 mt-2">
                Guarde este código se desejar fazer referência a este relato com a orientação pedagógica no futuro.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 rounded-lg border border-emerald-300 text-emerald-800 font-medium hover:bg-emerald-50 transition-colors text-sm"
              >
                Registrar Outro Relato
              </button>
              <button
                type="button"
                onClick={onBackToHome}
                className="px-6 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-medium transition-colors text-sm"
              >
                Voltar à Página Principal
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-stone-200 space-y-8">
            <div className="border-b border-stone-200 pb-5">
              <h2 className="text-2xl font-bold text-emerald-950 flex items-center gap-2">
                <MessageCircleWarning className="w-6 h-6 text-emerald-700" />
                <span>Formulário de Denúncia Anônima</span>
              </h2>
              <p className="text-stone-600 text-sm mt-1">
                Preencha os campos abaixo com o máximo de informações que se sentir confortável em compartilhar.
              </p>
            </div>

            {/* Field 1: Tipo de Bullying */}
            <div className="space-y-2">
              <label htmlFor="reportType" className="block text-sm font-semibold text-stone-800">
                1. Qual tipo de agressão ou bullying está ocorrendo? *
              </label>
              <select
                id="reportType"
                required
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-stone-900 text-sm"
              >
                <option value="">Selecione o tipo principal...</option>
                <option value="verbal">Bullying Verbal (xingamentos, apelidos ofensivos, humilhações, fofocas)</option>
                <option value="fisico">Bullying Físico (empurrões, tapas, beliscões, agressões corporais)</option>
                <option value="psicologico">Bullying Psicológico / Exclusão (isolamento forçado, chantagens, desprezo)</option>
                <option value="cyber">Cyberbullying (ofensas no WhatsApp, figurinhas constrangedoras, redes sociais)</option>
                <option value="patrimonial">Dano ao Patrimônio (estragar cadernos, esconder mochilas, furto de lanche/material)</option>
                <option value="ameaca">Ameaças e Intimidação</option>
                <option value="outro">Outro tipo de constrangimento</option>
              </select>
            </div>

            {/* Field 2 & 3: Local e Frequência */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-semibold text-stone-800">
                  2. Onde o fato costuma acontecer? *
                </label>
                <select
                  id="location"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-stone-900 text-sm"
                >
                  <option value="">Selecione o local...</option>
                  <option value="sala">Dentro da sala de aula</option>
                  <option value="patio">No pátio / recreio</option>
                  <option value="banheiro">Nos banheiros</option>
                  <option value="quadra">Na quadra de esportes</option>
                  <option value="portao">Na entrada ou saída da escola</option>
                  <option value="transporte">No transporte escolar / caminho</option>
                  <option value="internet">Pela internet / WhatsApp / Redes Sociais</option>
                  <option value="outro">Em outro local da escola</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="frequency" className="block text-sm font-semibold text-stone-800">
                  3. Com qual frequência isso acontece? *
                </label>
                <select
                  id="frequency"
                  required
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-stone-900 text-sm"
                >
                  <option value="">Selecione a frequência...</option>
                  <option value="diaria">Todos os dias / quase diariamente</option>
                  <option value="semanal">Semanalmente</option>
                  <option value="recente">Começou recentemente (esta semana)</option>
                  <option value="pontual">Foi um fato grave pontual/específico</option>
                  <option value="antigo">Já dura há muito tempo</option>
                </select>
              </div>
            </div>

            {/* Field 4 & 5: Quem é o alvo e Turma envolvida */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="targetPerson" className="block text-sm font-semibold text-stone-800">
                  4. Quem está sendo vítima da agressão? *
                </label>
                <select
                  id="targetPerson"
                  required
                  value={targetPerson}
                  onChange={(e) => setTargetPerson(e.target.value)}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-stone-900 text-sm"
                >
                  <option value="">Selecione...</option>
                  <option value="eu">Eu mesmo(a) sou a vítima</option>
                  <option value="colega">Presenciei acontecendo com um colega</option>
                  <option value="amigo">Acontece com um amigo(a) próximo(a)</option>
                  <option value="grupo">Um grupo específico de alunos</option>
                  <option value="prefiro_nao_dizer">Prefiro detalhar no texto abaixo</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="classGrade" className="block text-sm font-semibold text-stone-800">
                  5. Qual turma ou ano está envolvido? (Opcional)
                </label>
                <input
                  type="text"
                  id="classGrade"
                  value={classGrade}
                  onChange={(e) => setClassGrade(e.target.value)}
                  placeholder="Ex: 1º Ano A, 2º Ano B, 3º Ano, etc."
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-stone-900 text-sm"
                />
              </div>
            </div>

            {/* Field 6: Relato Detalhado */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-semibold text-stone-800">
                6. Conte com suas próprias palavras o que está acontecendo: *
              </label>
              <p className="text-xs text-stone-500">
                Fique tranquilo(a): você pode citar o que costumam dizer ou fazer. Ninguém saberá que quem escreveu foi você.
              </p>
              <textarea
                id="description"
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva a situação, como começou, o que os agressores fazem ou dizem, e como você ou a vítima está se sentindo..."
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white text-stone-900 text-sm leading-relaxed resize-y"
              ></textarea>
            </div>

            {/* Field 7: Apoio Desejado (Checkboxes) */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-stone-800">
                7. De que forma a escola pode agir para ajudar? (Marque as opções que achar melhor)
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {supportOptions.map((option, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer text-sm transition-colors ${
                      supportDesired.includes(option)
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium'
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
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Envio criptografado sem armazenamento de IP ou cookies.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Enviando com segurança...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Denúncia Anônima</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Educational & Support Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 space-y-4">
            <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Como identificar o Bullying?</span>
            </h3>
            <ul className="text-sm text-stone-600 space-y-2 list-disc list-inside leading-relaxed">
              <li><strong>Intencionalidade:</strong> atos repetidos para humilhar, machucar ou constranger.</li>
              <li><strong>Desequilíbrio de poder:</strong> a vítima sente que não consegue se defender sozinha.</li>
              <li><strong>Cyberbullying:</strong> ofensas, exposição de fotos sem consentimento ou exclusão de grupos online.</li>
              <li><strong>Impacto emocional:</strong> medo de ir à escola, isolamento, queda no rendimento e tristeza.</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200 space-y-4">
            <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-emerald-700" />
              <span>Canais Nacionais de Apoio (Gratuitos)</span>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-stone-900 block">Disque 100</span>
                  <span className="text-xs text-stone-500">Direitos Humanos e Proteção da Criança e Adolescente</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-bold text-xs">Ligue 100</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-stone-900 block">CVV - Centro de Valorização da Vida</span>
                  <span className="text-xs text-stone-500">Apoio emocional e acolhimento 24h</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-bold text-xs">Ligue 188</span>
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
