import React, { useState } from 'react';
import { Sparkles, ZoomIn, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import fachadaImg from '../assets/images/cetifrente2.jpeg';
import escadaImg from '../assets/images/cetiescada (1).jpeg';
import patioImg from '../assets/images/cetipatio.jpeg';

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
      title: 'Fachada e Entrada Principal',
      subtitle: 'R. Marino Caetano, Campo Alegre do Fidalgo - PI (CEP 64767-000)',
      category: 'Entrada Oficial',
      image: fachadaImg,
      alt: 'Foto real da entrada principal do CETI Verônica Celestina Dias com placa oficial do Governo do Estado do Piauí e rampa acessível',
      description:
        'Foto original da fachada e entrada do Centro Estadual de Tempo Integral Verônica Celestina Dias. A imagem exibe a identificação oficial do Governo do Estado do Piauí / SEDUC com o brasão institucional, o portão de acesso com os estudantes entrando, a rampa de acessibilidade com sinalização para cadeirantes e a escadaria com mensagens de motivação.',
      highlights: [
        'Identificação oficial da Secretaria de Estado da Educação (SEDUC - PI)',
        'Rampa de acessibilidade universal com corrimão e pintura viária',
        'Portão principal seguro com acesso pela Rua Marino Caetano',
      ],
    },
    {
      id: 'escada',
      title: 'Escadaria dos Valores e Sucesso',
      subtitle: 'Mensagem inspiradora gravada no acesso dos alunos ao pátio',
      category: 'Valores & Formação',
      image: escadaImg,
      alt: 'Escadaria motivacional do CETI Verônica Celestina Dias com os valores para o sucesso',
      description:
        'Foto original da escadaria interna que conduz os estudantes ao ambiente pedagógico. Em cada degrau estão gravados os valores e atitudes essenciais: "O que você precisa para o seu sucesso: Caráter, Persistência, Tentar, Sonhar, Força, Humildade, Alegria".',
      highlights: [
        'Princípios humanistas integrados ao cotidiano escolar',
        'Corrimãos metálicos de apoio e segurança para todos os alunos',
        'Conexão direta entre o acesso frontal e o pátio central coberto',
      ],
    },
    {
      id: 'patio',
      title: 'Pátio Central e Área de Convivência',
      subtitle: 'Espaço interno de convivência e estudos dos alunos em Tempo Integral',
      category: 'Convivência dos Estudantes',
      image: patioImg,
      alt: 'Foto real do pátio interno coberto e arborizado do CETI Verônica Celestina Dias com alunos reunidos',
      description:
        'Foto original do amplo pátio coberto e arejado da escola. A imagem retrata os estudantes uniformizados reunidos nas mesas de estudo coletivas e jogos, com plena acessibilidade para cadeirantes, jardim interno arborizado e circulação natural de ar que garante bem-estar.',
      highlights: [
        'Cobertura ampla com circulação natural de ar e ventilação',
        'Mesas e bancos para trabalhos em equipe, leitura e convivência',
        'Espaço inclusivo com plena acessibilidade e árvores nativas',
      ],
    },
  ];

  return (
    <section id="estrutura" className="py-20 bg-emerald-50/20 border-t border-b border-emerald-900/10 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Registros Fotográficos Oficiais</span>
          </div>
          <h2 className="text-3xl font-extrabold text-emerald-950 sm:text-4xl tracking-tight">
            Fotos Reais do CETI Verônica Celestina Dias
          </h2>
          <div className="mt-2 h-1.5 w-24 bg-emerald-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Fotografias autênticas e completas da nossa escola, sem cortes ou modificações, mostrando a entrada oficial, a escadaria motivacional e a rotina dos alunos no pátio.
          </p>
        </div>

        {/* Gallery Cards: Full Aspect, No Cropping, Clean Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-emerald-900/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Container: Full, Uncropped, No Gradients */}
              <div
                className="bg-stone-100 p-2 sm:p-3 cursor-pointer group"
                onClick={() => setSelectedImage(item)}
                title="Clique para ver a foto completa em alta resolução"
              >
                <div className="relative rounded-2xl overflow-hidden bg-stone-200">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-auto block rounded-2xl transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                  
                  {/* Subtle Zoom Hint in corner */}
                  <div className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-emerald-950 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all opacity-90 group-hover:opacity-100">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Ampliar</span>
                  </div>
                </div>
              </div>

              {/* Information Under the Image */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">Foto Real</span>
                  </div>

                  <h3 className="text-xl font-bold text-emerald-950 tracking-tight">
                    {item.title}
                  </h3>
                  
                  <p className="text-xs font-semibold text-emerald-700">
                    {item.subtitle}
                  </p>

                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
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

                <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                  <button
                    onClick={() => setSelectedImage(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 group-hover:underline cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Ver em tela cheia</span>
                  </button>
                  <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>CETI VCD</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Institution Confirmation Footer Banner */}
        <div className="mt-12 bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-bold text-emerald-200">
              Centro Estadual de Tempo Integral Verônica Celestina Dias
            </h4>
            <p className="text-sm text-emerald-100/90 max-w-2xl">
              Instituição pública de ensino sediada em Campo Alegre do Fidalgo - PI, vinculada à Secretaria de Estado da Educação do Piauí (SEDUC-PI).
            </p>
          </div>
          <a
            href="#contato"
            className="shrink-0 px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-sm transition-all shadow-sm active:scale-95 text-center"
          >
            Falar com a Secretaria
          </a>
        </div>
      </div>

      {/* Lightbox Modal: 100% Real, Uncropped, High-Res Image View */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-emerald-950 text-white border-b border-emerald-900">
              <div>
                <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block">
                  Foto Real · {selectedImage.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
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

            {/* Modal Image: Original Aspect Ratio, No Crop, Clean */}
            <div className="bg-stone-900 p-2 sm:p-4 flex items-center justify-center overflow-auto max-h-[68vh]">
              <img
                src={selectedImage.image}
                alt={selectedImage.alt}
                className="max-h-[64vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>

            {/* Modal Footer Description */}
            <div className="p-5 sm:p-6 bg-stone-50 space-y-2 border-t border-stone-200">
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {selectedImage.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-stone-500">
                <span className="font-semibold text-emerald-800">Instituição:</span>
                <span>CETI Verônica Celestina Dias (SEDUC-PI)</span>
                <span>•</span>
                <span className="font-semibold text-emerald-800">Endereço:</span>
                <span>R. Marino Caetano, Campo Alegre do Fidalgo - PI</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
