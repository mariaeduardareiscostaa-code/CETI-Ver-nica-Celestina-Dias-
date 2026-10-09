import React, { useState } from 'react';
import { Phone, Mail, MessageSquare, Send } from 'lucide-react';

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
    <section id="contato" className="py-20 bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl">Fale com a Gestão</h2>
          <div className="mt-2 h-1 w-20 bg-yellow-400 mx-auto rounded"></div>
          <p className="mt-4 text-xl text-blue-200">
            Estamos sempre abertos para ouvir alunos, pais e a comunidade.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Details */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-blue-800 p-8 rounded-2xl">
              <h3 className="text-xl font-semibold mb-6 border-b border-blue-700 pb-4">Canais de Atendimento</h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-700 rounded-full">
                    <Phone className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-blue-200 text-sm">Telefone da Secretaria</p>
                    <p className="font-semibold">(00) 0000-0000</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-700 rounded-full">
                    <Mail className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-blue-200 text-sm">E-mail Institucional</p>
                    <p className="font-semibold break-all">gestao.vcd@educacao.gov.br</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-700 rounded-full">
                    <MessageSquare className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-blue-200 text-sm">WhatsApp da Gestão</p>
                    <p className="font-semibold">(00) 90000-0000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl text-gray-900 shadow-xl">
              <h3 className="text-2xl font-bold text-blue-900 mb-6">Envie sua Mensagem</h3>
              
              {isSent ? (
                <div className="bg-green-100 text-green-800 p-4 rounded-lg flex items-center mb-6">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Como podemos ajudar?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center justify-center space-x-2"
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
