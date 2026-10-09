import React from 'react';
import { Target, Eye, Heart } from 'lucide-react';

export default function Values() {
  const valuesList = [
    {
      title: 'Nossa Missão',
      icon: <Target className="w-10 h-10 text-blue-600 mb-4" />,
      description: 'Oferecer educação em tempo integral de excelência, promovendo o desenvolvimento cognitivo, social e emocional dos estudantes, preparando-os para os desafios da vida e da sociedade.',
    },
    {
      title: 'Nossa Visão',
      icon: <Eye className="w-10 h-10 text-blue-600 mb-4" />,
      description: 'Ser referência estadual em educação pública, reconhecida pela inovação pedagógica, inclusão e pelo sucesso acadêmico e pessoal de nossos alunos.',
    },
    {
      title: 'Nossos Valores',
      icon: <Heart className="w-10 h-10 text-blue-600 mb-4" />,
      description: 'Trabalhamos fundamentados no Respeito, Ética, Responsabilidade, Empatia, Inovação, Sustentabilidade e no Compromisso com o Ensino Público de Qualidade.',
    },
  ];

  return (
    <section id="sobre" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-blue-900 sm:text-4xl">Sobre Nossa Escola</h2>
          <div className="mt-2 h-1 w-20 bg-yellow-400 mx-auto rounded"></div>
          <p className="mt-4 text-xl text-gray-600">
            Conheça os princípios que guiam nossa instituição.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {valuesList.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-blue-50 rounded-full mb-4">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
