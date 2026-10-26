export interface Book {
  id: string;
  title: string;
  author: string;
  category: 'Literatura Brasileira' | 'Autores do Piauí e Nordeste' | 'ENEM & Vestibulares' | 'Ciências da Natureza' | 'Filosofia & Sociologia' | 'Ficção Juvenil & Contos' | 'Matemática & Tecnologia' | string;
  isbn: string;
  year: number;
  pages: number;
  publisher: string;
  synopsis: string;
  shelfLocation: string;
  totalCopies: number;
  availableCopies: number;
  coverGradient: string;
  coverImage?: string;
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

export interface PresetCover {
  id: string;
  label: string;
  category: string;
  url: string;
}

export const PRESET_BOOK_COVERS: PresetCover[] = [
  {
    id: 'cov-classico',
    label: 'Literatura Clássica & Obras Primas',
    category: 'Literatura Brasileira',
    url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cov-nordeste',
    label: 'Cultura Piauiense & Sertão Nordestino',
    category: 'Autores do Piauí e Nordeste',
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cov-enem',
    label: 'ENEM, Redação & Cadernos de Estudo',
    category: 'ENEM & Vestibulares',
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cov-ciencias',
    label: 'Ciências da Natureza & Laboratório',
    category: 'Ciências da Natureza',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cov-matematica',
    label: 'Matemática, Robótica & Raciocínio',
    category: 'Matemática & Tecnologia',
    url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cov-filosofia',
    label: 'Filosofia, Pedagogia & Humanidades',
    category: 'Filosofia & Sociologia',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cov-ficcao',
    label: 'Ficção Juvenil, Aventura & Distopia',
    category: 'Ficção Juvenil & Contos',
    url: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cov-poesia',
    label: 'Poesia & Letras Piauienses',
    category: 'Autores do Piauí e Nordeste',
    url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80'
  }
];

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
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
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
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
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
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    badge: 'Naturalismo Brasileiro',
    recommendedGrade: '1º e 2º Ano do Ensino Médio',
    rating: 4.7,
    tags: ['Naturalismo', 'Nordeste', 'História']
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
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e37b73?auto=format&fit=crop&w=600&q=80',
    badge: 'Clássico Fundamental',
    recommendedGrade: '2º e 3º Ano do Ensino Médio',
    rating: 4.9,
    tags: ['Jorge Amado', 'Bahia', 'ENEM', 'Cidadania']
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
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
    badge: 'Último Exemplar Disponível',
    recommendedGrade: '3º Ano do Ensino Médio',
    rating: 4.8,
    tags: ['Clarice Lispector', 'Existencialismo', 'ENEM']
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
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    badge: 'Acervo Local de Campo Alegre',
    recommendedGrade: 'Todos os Alunos',
    rating: 5.0,
    tags: ['Campo Alegre do Fidalgo', 'Cultura Popular', 'Piauí', 'História Oral']
  }
];
