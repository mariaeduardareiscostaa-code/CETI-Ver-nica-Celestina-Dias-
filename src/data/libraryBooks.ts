export interface Book {
  id: string;
  title: string;
  author: string;
  category: 'Literatura Brasileira' | 'Autores do Piauí e Nordeste' | 'ENEM & Vestibulares' | 'Ciências da Natureza' | 'Filosofia & Sociologia' | 'Ficção Juvenil & Contos' | 'Matemática & Tecnologia';
  isbn: string;
  year: number;
  pages: number;
  publisher: string;
  synopsis: string;
  shelfLocation: string;
  totalCopies: number;
  availableCopies: number;
  coverGradient: string;
  badge?: string;
  recommendedGrade: string;
  rating: number;
  tags: string[];
}

export interface BookReservation {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCategory: string;
  shelfLocation: string;
  studentName: string;
  studentMatricula: string;
  studentGrade: string;
  studentContact: string;
  reservationDate: string;
  pickupDeadline: string;
  returnDeadline: string;
  status: 'Pendente para Retirada' | 'Retirado / Emprestado' | 'Devolvido' | 'Cancelado';
  notes?: string;
}

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-01',
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    category: 'Literatura Brasileira',
    isbn: '978-85-359-1484-9',
    year: 1899,
    pages: 256,
    publisher: 'Companhia das Letras / Acervo SEDUC-PI',
    synopsis: 'Um dos maiores clássicos da literatura em língua portuguesa. Narrado em primeira pessoa por Bento Santiago (Dom Casmurro), que relembra sua juventude e seu amor por Capitu, trazendo à tona a eterna dúvida do ciúme e da traição.',
    shelfLocation: 'Estante 01 · Prateleira A (Literatura Clássica)',
    totalCopies: 6,
    availableCopies: 4,
    coverGradient: 'from-amber-700 to-amber-950',
    badge: 'Leitura Obrigatória ENEM',
    recommendedGrade: '1º ao 3º Ano do Ensino Médio',
    rating: 4.9,
    tags: ['Realismo', 'Clássico', 'ENEM', 'Machado de Assis']
  },
  {
    id: 'book-02',
    title: 'Vidas Secas',
    author: 'Graciliano Ramos',
    category: 'Literatura Brasileira',
    isbn: '978-85-01-08133-0',
    year: 1938,
    pages: 176,
    publisher: 'Editora Record',
    synopsis: 'A saga comovente e visceral da família de retirantes sertanejos: Fabiano, Sinhá Vitória, os dois filhos e a cadela Baleia, lutando pela sobrevivência contra a seca implacável do sertão nordestino.',
    shelfLocation: 'Estante 01 · Prateleira B (Modernismo Brasileiro)',
    totalCopies: 5,
    availableCopies: 3,
    coverGradient: 'from-orange-800 to-amber-950',
    badge: 'Destaque Regional',
    recommendedGrade: '2º e 3º Ano do Ensino Médio',
    rating: 4.8,
    tags: ['Sertão', 'Nordeste', 'Modernismo', 'ENEM']
  },
  {
    id: 'book-03',
    title: 'O Mulato',
    author: 'Aluísio Azevedo',
    category: 'Autores do Piauí e Nordeste',
    isbn: '978-85-7232-475-4',
    year: 1881,
    pages: 288,
    publisher: 'Martin Claret',
    synopsis: 'Marco inicial do Naturalismo no Brasil, aborda o racismo e o preconceito da sociedade maranhense e nordestina do século XIX na trajetória de Raimundo, jovem culto que retorna da Europa para descobrir suas origens.',
    shelfLocation: 'Estante 02 · Prateleira C (Literatura Regional & Nordestina)',
    totalCopies: 4,
    availableCopies: 2,
    coverGradient: 'from-stone-700 to-emerald-950',
    badge: 'Naturalismo Brasileiro',
    recommendedGrade: '1º e 2º Ano do Ensino Médio',
    rating: 4.7,
    tags: ['Naturalismo', 'Nordeste', 'História']
  },
  {
    id: 'book-04',
    title: 'Antologia da Poesia Piauiense',
    author: 'H. Dobal, M. Paulo Nunes e Autores Piauienses',
    category: 'Autores do Piauí e Nordeste',
    isbn: '978-85-9854-102-1',
    year: 2018,
    pages: 210,
    publisher: 'Fundação Cultural do Piauí · SEDUC',
    synopsis: 'Coletânea especial reunindo grandes poetas do Piauí, com destaque para a lírica telúrica e moderna de H. Dobal, Fontes Ibiapina e poetas contemporâneos que retratam a paisagem, a gente e a identidade do cerrado e caatinga piauienses.',
    shelfLocation: 'Estante 02 · Prateleira A (Identidade & Cultura do Piauí)',
    totalCopies: 5,
    availableCopies: 5,
    coverGradient: 'from-emerald-700 to-emerald-950',
    badge: 'Patrimônio do Piauí',
    recommendedGrade: 'Todos os Anos',
    rating: 4.9,
    tags: ['Piauí', 'Poesia', 'Cultura Regional', 'SEDUC']
  },
  {
    id: 'book-05',
    title: 'Redação Nota 1000: Técnicas e Repertórios para o ENEM',
    author: 'Profª. Clarice Mendonça & Equipe Pedagógica',
    category: 'ENEM & Vestibulares',
    isbn: '978-85-8429-190-2',
    year: 2024,
    pages: 198,
    publisher: 'Edições Pedagógicas Tempo Integral',
    synopsis: 'Guia completo com modelos de dissertação-argumentativa, propostas de intervenção detalhadas, conectivos e repertórios legitimados em sociologia, filosofia, história e constituição cidadã para garantir nota máxima no ENEM.',
    shelfLocation: 'Estante 03 · Prateleira A (Bancada Preparatória ENEM)',
    totalCopies: 8,
    availableCopies: 6,
    coverGradient: 'from-blue-700 to-indigo-950',
    badge: 'Mais Procurado ENEM',
    recommendedGrade: '3º Ano e Pré-Vestibular',
    rating: 5.0,
    tags: ['ENEM', 'Redação', 'Dissertação', 'Vestibular']
  },
  {
    id: 'book-06',
    title: 'Capitães da Areia',
    author: 'Jorge Amado',
    category: 'Literatura Brasileira',
    isbn: '978-85-359-1406-1',
    year: 1937,
    pages: 280,
    publisher: 'Companhia das Letras',
    synopsis: 'A emocionante história de Pedro Bala, Professor, Sem-Pernas, Gato e Dora, um grupo de jovens desamparados que vivem nas ruas de Salvador, revelando solidariedade, sonhos e a luta pela infância roubada.',
    shelfLocation: 'Estante 01 · Prateleira C (Literatura Moderna)',
    totalCopies: 6,
    availableCopies: 2,
    coverGradient: 'from-yellow-800 to-stone-900',
    badge: 'Clássico Fundamental',
    recommendedGrade: '2º e 3º Ano do Ensino Médio',
    rating: 4.9,
    tags: ['Jorge Amado', 'Bahia', 'ENEM', 'Cidadania']
  },
  {
    id: 'book-07',
    title: 'Pedagogia da Autonomia: Saberes Necessários à Prática Educativa',
    author: 'Paulo Freire',
    category: 'Filosofia & Sociologia',
    isbn: '978-85-7753-163-9',
    year: 1996,
    pages: 144,
    publisher: 'Paz & Terra',
    synopsis: 'Obra indispensável que discute a ética pedagógica, o respeito à dignidade e à autonomia do educando, e a importância do pensamento crítico na construção de uma sociedade democrática e justa.',
    shelfLocation: 'Estante 04 · Prateleira B (Filosofia, Educação e Sociedade)',
    totalCopies: 4,
    availableCopies: 3,
    coverGradient: 'from-teal-800 to-emerald-950',
    badge: 'Referência Cidadã',
    recommendedGrade: 'Ensino Médio e Formação Cidadã',
    rating: 4.9,
    tags: ['Educação', 'Filosofia', 'Paulo Freire', 'Ética']
  },
  {
    id: 'book-08',
    title: 'A Hora da Estrela',
    author: 'Clarice Lispector',
    category: 'Literatura Brasileira',
    isbn: '978-85-325-0814-0',
    year: 1977,
    pages: 96,
    publisher: 'Rocco',
    synopsis: 'A tocante e enigmática trajetória de Macabéa, jovem datilógrafa alagoana órfã e ingênua que tenta a vida na cidade grande, narrada pelo escritor fictício Rodrigo S.M. com reflexões profundas sobre existência e invisibilidade.',
    shelfLocation: 'Estante 01 · Prateleira D (Contos e Novelas Clássicas)',
    totalCopies: 5,
    availableCopies: 1,
    coverGradient: 'from-rose-900 to-purple-950',
    badge: 'Último Exemplar Disponível',
    recommendedGrade: '3º Ano do Ensino Médio',
    rating: 4.8,
    tags: ['Clarice Lispector', 'Existencialismo', 'ENEM']
  },
  {
    id: 'book-09',
    title: 'O Homem que Calculava',
    author: 'Malba Tahan (Júlio César de Mello e Souza)',
    category: 'Matemática & Tecnologia',
    isbn: '978-85-01-06187-5',
    year: 1938,
    pages: 288,
    publisher: 'Editora Record',
    synopsis: 'Aventuras fascinantes do calculista persa Beremiz Samir pelo Oriente Médio, desvendando enigmas matemáticos complexos, problemas de lógica e divisões desafiadoras através da sabedoria e da poesia dos números.',
    shelfLocation: 'Estante 05 · Prateleira A (Matemática Lúdica e Raciocínio)',
    totalCopies: 5,
    availableCopies: 4,
    coverGradient: 'from-cyan-800 to-blue-950',
    badge: 'Matemática Divertida',
    recommendedGrade: '1º, 2º e 3º Anos',
    rating: 4.9,
    tags: ['Matemática', 'Lógica', 'Malba Tahan', 'Aventura']
  },
  {
    id: 'book-10',
    title: 'Física do Cotidiano e Meio Ambiente',
    author: 'Prof. Carlos R. Albuquerque',
    category: 'Ciências da Natureza',
    isbn: '978-85-262-8140-5',
    year: 2022,
    pages: 240,
    publisher: 'Editora Scipione Didáticos',
    synopsis: 'Explicações práticas e contextualizadas sobre fenômenos físicos presentes em nossa vida diária no semiárido, desde energia solar fotovoltaica e termodinâmica até acústica e óptica, com foco nas competências do ENEM.',
    shelfLocation: 'Estante 06 · Prateleira C (Ciências e Tecnologias da Natureza)',
    totalCopies: 4,
    availableCopies: 3,
    coverGradient: 'from-sky-700 to-slate-900',
    badge: 'Ciência & Sustentabilidade',
    recommendedGrade: '1º e 2º Ano do Ensino Médio',
    rating: 4.7,
    tags: ['Física', 'ENEM', 'Sustentabilidade', 'Energia Solar']
  },
  {
    id: 'book-11',
    title: '1984',
    author: 'George Orwell',
    category: 'Ficção Juvenil & Contos',
    isbn: '978-85-359-1484-9',
    year: 1949,
    pages: 416,
    publisher: 'Companhia das Letras',
    synopsis: 'A clássica distopia sobre vigilância totalitária, censura e manipulação da verdade pelo Grande Irmão. Uma reflexão indispensável para jovens sobre liberdade, pensamento crítico e os rumos da sociedade contemporânea.',
    shelfLocation: 'Estante 07 · Prateleira A (Ficção, Distopias e Clássicos Mundiais)',
    totalCopies: 5,
    availableCopies: 2,
    coverGradient: 'from-slate-800 to-zinc-950',
    badge: 'Distopia Mundial',
    recommendedGrade: '2º e 3º Ano do Ensino Médio',
    rating: 4.9,
    tags: ['Distopia', 'Liberdade', 'Filosofia Política']
  },
  {
    id: 'book-12',
    title: 'Lendas, Mitos e Saberes do Sertão Piauiense',
    author: 'Coletivo Memorialista de Campo Alegre e Região',
    category: 'Autores do Piauí e Nordeste',
    isbn: '978-85-9981-220-4',
    year: 2023,
    pages: 180,
    publisher: 'Edição Comunitária Escolar CETI VCD',
    synopsis: 'Resgate de causos, narrativas orais, saberes tradicionais da caatinga e histórias populares contadas pelos anciãos de Campo Alegre do Fidalgo e do sudeste piauiense, organizado por educadores da rede estadual.',
    shelfLocation: 'Estante 02 · Prateleira D (Memória Local & Histórias de Campo Alegre)',
    totalCopies: 6,
    availableCopies: 5,
    coverGradient: 'from-amber-800 to-emerald-950',
    badge: 'Acervo Local de Campo Alegre',
    recommendedGrade: 'Todos os Alunos',
    rating: 5.0,
    tags: ['Campo Alegre do Fidalgo', 'Cultura Popular', 'Piauí', 'História Oral']
  }
];
