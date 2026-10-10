import React from 'react';

export default function Hero() {
  return (
    <section id="inicio" className="relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-900 text-white pt-24 pb-32 flex items-center justify-center text-center px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" id="patternId" width="100%" height="100%">
            <defs>
                <pattern id="a" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="scale(2) rotate(0)">
                    <rect x="0" y="0" width="100%" height="100%" fill="none" />
                    <path d="M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5" strokeWidth="1" stroke="none" fill="currentColor"/>
                </pattern>
            </defs>
            <rect width="800%" height="800%" transform="translate(0,0)" fill="url(#a)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Centro de Ensino em Tempo Integral <br className="hidden md:block"/>
          <span className="text-emerald-300">Verônica Celestina Dias</span>
        </h1>
        <p className="text-lg md:text-2xl text-emerald-100 max-w-2xl mx-auto">
          Educação de qualidade, compromisso com o futuro e desenvolvimento integral dos nossos alunos.
        </p>
        <div className="pt-6">
          <a
            href="#contato"
            className="inline-block bg-emerald-400 text-emerald-950 font-bold px-8 py-3 rounded-full hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-950/20"
          >
            Fale com a Gestão
          </a>
        </div>
      </div>
    </section>
  );
}
