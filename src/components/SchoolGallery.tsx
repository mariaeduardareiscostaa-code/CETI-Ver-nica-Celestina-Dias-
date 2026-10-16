import React, { useState } from 'react';
import { Sparkles, MapPin, Users, ZoomIn, X, CheckCircle2 } from 'lucide-react';
import fachadaImg from '../assets/images/ceti_fachada_frente_1792175517797.jpg';
import patioImg from '../assets/images/ceti_patio_convivencia_1792175517664.jpg';

interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  alt: string;
  description: string;
  highlights: string[];
}

export default function SchoolGallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'fachada',
      title: 'Fachada Institucional & Entrada Principal',
      subtitle: 'Entrada oficial na R. Marino Caetano - Campo Alegre do Fidalgo - PI',
      category: 'Estrutura & Acesso',
      image: fachadaImg,
      alt: 'Fachada oficial do Centro Estadual de Tempo Integral Verônica Celestina Dias com identificação SEDUC Piauí e rampa de acessibilidade',
      description:
        'Acesso principal do CETI Verônica Celestina Dias, contando com pórtico oficial da SEDUC-PI, portaria segura, muros estilizados e rampa com acessibilidade universal para acolher todos os estudantes e a comunidade escolar.',
      highlights: [
        'Rampa de acessibilidade com piso tátil e corrimão',
        'Identificação oficial da Secretaria de Estado da Educação (SEDUC-PI)',
        'Localização central e segura em Campo Alegre do Fidalgo',
      ],
    },
    {
      id: 'patio',
      title: 'Pátio Central & Área de Convivência',
      subtitle: 'Espaço de integração, refeições e estudos dos alunos em Tempo Integral',
      category: 'Vida Escolar & Vivência',
      image: patioImg,
      alt: 'Pátio interno coberto e arborizado do CETI Verônica Celestina Dias com estudantes em uniforme estudando em grupos',
      description:
        'Amplo pátio coberto e arborizado com jardins internos, mesas de estudos compartilhados, corredores arejados e circulação livre. Um ambiente vivo onde os alunos realizam atividades pedagógicas, compartilham momentos e vivenciam a rotina da educação em tempo integral.',
      highlights: [
        'Ambiente coberto com ventilação natural e arborização',
        'Mesas coletivas para estudos em equipe e convivência',
        'Espaço monitorado propício ao desenvolvimento pedagógico',
      ],
    },
  ];

  return (
    <section id="estrutura" className="py-20 bg-stone-50/70 border-t border-b border-emerald-950/10 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Nossa Estrutura & Espaço Físico</span>
          </div>
          <h2 className="text-3xl font-extrabold text-emerald-950 sm:text-4xl tracking-tight">
            Conheça o CETI Verônica Celestina Dias
          </h2>
          <div className="mt-2 h-1.5 w-24 bg-emerald-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Registros reais do nosso ambiente escolar: estrutura planejada para o aprendizado de excelência,
            segurança, acessibilidade e bem-estar em tempo integral.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-emerald-900/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image Container with Zoom Trigger */}
              <div
                className="relative h-72 sm:h-96 overflow-hidden bg-stone-100 cursor-pointer"
                onClick={() => setSelectedImage(item)}
                title="Clique para ampliar a foto"
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

                <div className="absolute top-4 left-4 bg-emerald-950/85 backdrop-blur-md text-emerald-100 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-md border border-emerald-700/40">
                  {item.id === 'fachada' ? (
                    <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                  ) : (
                    <Users className="w-3.5 h-3.5 text-emerald-300" />
                  )}
                  <span>{item.category}</span>
                </div>

                <div className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-emerald-950 p-2.5 rounded-full shadow-lg backdrop-blur-xs opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all">
                  <ZoomIn className="w-4 h-4" />
                </div>

                <div className="absolute bottom-4 left-4 text-white max-w-[80%]">
                  <span className="text-xs font-medium text-emerald-300 uppercase tracking-wider block">
                    CETI Verônica Celestina Dias
                  </span>
                  <span className="text-sm font-semibold text-white drop-shadow-sm line-clamp-1">
                    {item.title}
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-emerald-950 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700">
                    {item.subtitle}
                  </p>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="pt-4 border-t border-stone-100 space-y-2">
                  {item.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-stone-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedImage(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 group-hover:underline cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Visualizar foto em tela cheia</span>
                  </button>
                  <span className="text-xs text-stone-400 font-medium">Tempo Integral</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Extra notice banner */}
        <div className="mt-12 bg-emerald-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-bold text-emerald-200">
              Orgulho de ser CETI Verônica Celestina Dias
            </h4>
            <p className="text-sm text-emerald-100/90 max-w-2xl">
              Venha conhecer de perto nossa proposta pedagógica em tempo integral e a infraestrutura dedicada ao sucesso dos jovens piauienses.
            </p>
          </div>
          <a
            href="#contato"
            className="shrink-0 px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-sm transition-all shadow-sm active:scale-95 text-center"
          >
            Agendar Visita / Falar com a Direção
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-emerald-950 text-white border-b border-emerald-900">
              <div>
                <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block">
                  {selectedImage.category}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {selectedImage.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 rounded-full hover:bg-emerald-900 text-emerald-200 hover:text-white transition-colors cursor-pointer"
                aria-label="Fechar visualização"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative bg-black flex items-center justify-center overflow-hidden max-h-[60vh]">
              <img
                src={selectedImage.image}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            </div>

            {/* Modal Footer Description */}
            <div className="p-6 bg-stone-50 space-y-3 overflow-y-auto">
              <p className="text-sm text-stone-700 leading-relaxed">
                {selectedImage.description}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-200 text-xs text-stone-600">
                <span className="font-semibold text-emerald-800">Localização:</span>
                <span>R. Marino Caetano, Campo Alegre do Fidalgo - PI</span>
                <span>•</span>
                <span className="font-semibold text-emerald-800">Instituição:</span>
                <span>CETI Verônica Celestina Dias (SEDUC-PI)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
