import React, { useState } from 'react';
import { Phone, Mail, MessageSquare, Send, MapPin } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setIsSent(true);
      setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
      setTimeout(() => setIsSent(false), 5000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contato" className="py-20 bg-emerald-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl">Fale com a Gestão</h2>
          <div className="mt-2 h-1 w-20 bg-emerald-400 mx-auto rounded"></div>
          <p className="mt-4 text-xl text-emerald-100">
            Estamos sempre abertos para ouvir alunos, pais e a comunidade.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Details */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-emerald-950/60 border border-emerald-800/80 p-8 rounded-2xl">
              <h3 className="text-xl font-semibold mb-6 border-b border-emerald-800 pb-4">Canais de Atendimento</h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-emerald-800/80 rounded-full flex-shrink-0">
                    <Phone className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-emerald-200/80 text-sm">Telefone da Instituição</p>
                    <a 
                      href="tel:+558994107024"
                      className="font-semibold text-white hover:text-emerald-300 transition-colors"
                    >
                      +55 89 9410-7024
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-emerald-800/80 rounded-full flex-shrink-0">
                    <Mail className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-emerald-200/80 text-sm">E-mail Institucional</p>
                    <p className="font-semibold text-white break-all">gestao.vcd@educacao.gov.br</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-emerald-800/80 rounded-full flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-emerald-200/80 text-sm">WhatsApp da Gestão</p>
                    <a 
                      href="https://wa.me/558994107024" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-semibold text-white hover:text-emerald-300 transition-colors"
                    >
                      +55 89 9410-7024
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 pt-2 border-t border-emerald-800/70">
                  <div className="p-3 bg-emerald-800/80 rounded-full flex-shrink-0">
                    <MapPin className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-emerald-200/80 text-sm">Endereço da Instituição</p>
                    <p className="font-semibold text-white text-sm leading-snug">
                      R. Marino Caetano, Campo Alegre do Fidalgo - PI, 64767-000
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl text-gray-900 shadow-xl border border-emerald-100">
              <h3 className="text-2xl font-bold text-emerald-950 mb-6">Envie sua Mensagem</h3>
              
              {isSent ? (
                <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 p-4 rounded-lg flex items-center mb-6">
                  <p className="font-medium">Sua mensagem foi enviada com sucesso! A gestão responderá em breve.</p>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      required
                      value={formData.nome}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors"
                      placeholder="seu.email@exemplo.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="assunto" className="block text-sm font-medium text-gray-700 mb-1">Assunto / Direcionamento</label>
                  <select
                    id="assunto"
                    name="assunto"
                    required
                    value={formData.assunto}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors"
                  >
                    <option value="">Selecione um assunto...</option>
                    <option value="direcao">Direção Escolar</option>
                    <option value="coordenacao">Coordenação Pedagógica</option>
                    <option value="secretaria">Secretaria (Matrículas, Documentos)</option>
                    <option value="outro">Outros Assuntos</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    rows={4}
                    required
                    value={formData.mensagem}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors resize-none"
                    placeholder="Como podemos ajudar?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-emerald-700 text-white font-medium rounded-lg hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Enviar Mensagem</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
