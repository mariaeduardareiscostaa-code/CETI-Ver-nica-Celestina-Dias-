export interface ClassScheduleItem {
  id: string;
  timeSlot: string; // Ex: '07:30 - 08:30'
  slotNumber: number; // 1 to 8
  subject: string;
  teacher: string;
  room: string;
  category: 'linguagens' | 'matematica' | 'natureza' | 'humanas' | 'diversificada' | 'rotina';
}

export interface DaySchedule {
  dayName: 'Segunda-feira' | 'Terça-feira' | 'Quarta-feira' | 'Quinta-feira' | 'Sexta-feira';
  dayShort: 'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex';
  items: ClassScheduleItem[];
}

export interface SchoolClass {
  id: string;
  name: string;
  shortName: string;
  grade: string;
  shift: string;
  roomNumber: string;
  advisorTeacher: string;
  schedule: Record<string, ClassScheduleItem[]>; // 'segunda', 'terca', etc.
}

export interface DailyRoutineSlot {
  time: string;
  title: string;
  type: 'aula' | 'refeicao' | 'acolhimento' | 'encerramento';
  description: string;
}

export const DAILY_ROUTINE: DailyRoutineSlot[] = [
  {
    time: '07:30',
    title: 'Entrada dos Estudantes',
    type: 'acolhimento',
    description: 'Abertura dos portões, recepção dos estudantes e início das atividades escolares.',
  },
  {
    time: '07:30 - 08:30',
    title: '1ª Aula',
    type: 'aula',
    description: 'Primeiro tempo pedagógico matutino.',
  },
  {
    time: '08:30 - 09:30',
    title: '2ª Aula',
    type: 'aula',
    description: 'Segundo tempo pedagógico.',
  },
  {
    time: '09:30 - 09:50',
    title: 'Intervalo & Lanche da Manhã',
    type: 'refeicao',
    description: 'Pausa para recreação e lanche matutino nutritivo (20 min).',
  },
  {
    time: '09:50 - 10:50',
    title: '3ª Aula',
    type: 'aula',
    description: 'Terceiro tempo pedagógico.',
  },
  {
    time: '10:50 - 11:50',
    title: '4ª Aula',
    type: 'aula',
    description: 'Quarto tempo pedagógico antes do almoço.',
  },
  {
    time: '11:50 - 12:50',
    title: 'Almoço Escolar & Descanso Orientado',
    type: 'refeicao',
    description: 'Almoço quente completo no refeitório climatizado e intervalo de descanso e convivência (1h).',
  },
  {
    time: '12:50 - 13:50',
    title: '5ª Aula',
    type: 'aula',
    description: 'Início do bloco pedagógico vespertino.',
  },
  {
    time: '13:50 - 14:50',
    title: '6ª Aula',
    type: 'aula',
    description: 'Sexto tempo pedagógico.',
  },
  {
    time: '14:50 - 15:10',
    title: 'Intervalo & Lanche da Tarde',
    type: 'refeicao',
    description: 'Pausa para hidratação e lanche da tarde (20 min).',
  },
  {
    time: '15:10 - 16:10',
    title: '7ª Aula',
    type: 'aula',
    description: 'Sétimo tempo pedagógico.',
  },
  {
    time: '16:10 - 17:10',
    title: '8ª Aula',
    type: 'aula',
    description: 'Oitavo tempo pedagógico.',
  },
  {
    time: '17:10',
    title: 'Término das Atividades & Transporte Escolar',
    type: 'encerramento',
    description: 'Encerramento das atividades letivas diárias e embarque no transporte escolar.',
  },
];

export const SCHOOL_CLASSES: SchoolClass[] = [
  // 1ª Série A - Técnico em Administração
  {
    id: '1a',
    name: '1ª Série A - Téc. em Administração',
    shortName: '1ª Série A (Téc. Administração)',
    grade: '1º Ano EM · Curso Técnico em Administração',
    shift: 'Tempo Integral (07:30 às 17:10)',
    roomNumber: 'Sala 01 - Bloco Didático',
    advisorTeacher: 'Profª. Naiara (Língua Portuguesa)',
    schedule: {
      segunda: [
        { id: '1a-seg-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Inglês', teacher: 'Profª. Elayne', room: 'Sala 01', category: 'linguagens' },
        { id: '1a-seg-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Inteligência Artificial (I.A)', teacher: 'Prof. Djalma', room: 'Lab. Informática', category: 'diversificada' },
        { id: '1a-seg-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Português', teacher: 'Profª. Naiara', room: 'Sala 01', category: 'linguagens' },
        { id: '1a-seg-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Português', teacher: 'Profª. Naiara', room: 'Sala 01', category: 'linguagens' },
        { id: '1a-seg-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Biologia', teacher: 'Prof. Dhones', room: 'Lab. Ciências', category: 'natureza' },
        { id: '1a-seg-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Economia & Mercado (Eco. Mer.)', teacher: 'Profª. Iolanda', room: 'Sala 01', category: 'diversificada' },
        { id: '1a-seg-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Ética Profissional (Ética. P)', teacher: 'Profª. Iolanda', room: 'Sala 01', category: 'diversificada' },
        { id: '1a-seg-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Matemática', teacher: 'Profª. Edite', room: 'Sala 01', category: 'matematica' },
      ],
      terca: [
        { id: '1a-ter-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Comunicação Empresarial (Comu. Emp.)', teacher: 'Profª. Iolanda', room: 'Sala 01', category: 'diversificada' },
        { id: '1a-ter-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Física', teacher: 'Prof. Valdivino', room: 'Sala 01', category: 'natureza' },
        { id: '1a-ter-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Química', teacher: 'Prof. Avelar', room: 'Lab. Ciências', category: 'natureza' },
        { id: '1a-ter-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Física', teacher: 'Prof. Valdivino', room: 'Sala 01', category: 'natureza' },
        { id: '1a-ter-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Biologia', teacher: 'Prof. Dhones', room: 'Lab. Ciências', category: 'natureza' },
        { id: '1a-ter-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Matemática', teacher: 'Profª. Edite', room: 'Sala 01', category: 'matematica' },
        { id: '1a-ter-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Educação Financeira (Ed. Financeira)', teacher: 'Profª. Iolanda', room: 'Sala 01', category: 'diversificada' },
        { id: '1a-ter-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Comunicação Empresarial (Comu. Emp.)', teacher: 'Profª. Iolanda', room: 'Sala 01', category: 'diversificada' },
      ],
      quarta: [
        { id: '1a-qua-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Biologia', teacher: 'Prof. Dhones', room: 'Lab. Ciências', category: 'natureza' },
        { id: '1a-qua-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Física', teacher: 'Prof. Daniel Rocha', room: 'Sala 01', category: 'natureza' },
        { id: '1a-qua-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Português & Redação', teacher: 'Profª. Naiara', room: 'Sala 01', category: 'linguagens' },
        { id: '1a-qua-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Geografia do Piauí & Brasil', teacher: 'Profª. Luciana Mendes', room: 'Sala 01', category: 'humanas' },
        { id: '1a-qua-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Téc: Gestão de Documentos & Arquivos', teacher: 'Profª. Iolanda', room: 'Sala 01', category: 'diversificada' },
        { id: '1a-qua-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Téc: Informática Aplicada à Gestão', teacher: 'Prof. Djalma', room: 'Lab. Informática', category: 'diversificada' },
        { id: '1a-qua-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Estudo Orientado I', teacher: 'Profª. Naiara', room: 'Biblioteca', category: 'diversificada' },
        { id: '1a-qua-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Clube de Protagonismo Juvenil', teacher: 'Coord. Pedagógica', room: 'Pátio / Auditório', category: 'diversificada' },
      ],
      quinta: [
        { id: '1a-qui-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Matemática Financeira Básica', teacher: 'Profª. Edite', room: 'Sala 01', category: 'matematica' },
        { id: '1a-qui-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Inglês', teacher: 'Profª. Elayne', room: 'Sala 01', category: 'linguagens' },
        { id: '1a-qui-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Filosofia & Cidadania', teacher: 'Prof. Marcos Silva', room: 'Sala 01', category: 'humanas' },
        { id: '1a-qui-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Sociologia', teacher: 'Prof. Marcos Silva', room: 'Sala 01', category: 'humanas' },
        { id: '1a-qui-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Téc: Rotinas Administrativas', teacher: 'Profª. Iolanda', room: 'Sala 01', category: 'diversificada' },
        { id: '1a-qui-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Téc: Rotinas Administrativas', teacher: 'Profª. Iolanda', room: 'Sala 01', category: 'diversificada' },
        { id: '1a-qui-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Artes & Expressão Cultural', teacher: 'Profª. Mariana Lima', room: 'Sala de Artes', category: 'linguagens' },
        { id: '1a-qui-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Tutoria & Nivelamento', teacher: 'Profª. Naiara', room: 'Sala 01', category: 'diversificada' },
      ],
      sexta: [
        { id: '1a-sex-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Português (Literatura)', teacher: 'Profª. Naiara', room: 'Sala 01', category: 'linguagens' },
        { id: '1a-sex-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Matemática', teacher: 'Profª. Edite', room: 'Sala 01', category: 'matematica' },
        { id: '1a-sex-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Biologia', teacher: 'Prof. Dhones', room: 'Lab. Ciências', category: 'natureza' },
        { id: '1a-sex-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Física', teacher: 'Prof. Daniel Rocha', room: 'Sala 01', category: 'natureza' },
        { id: '1a-sex-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Téc: Empreendedorismo & Inovação', teacher: 'Profª. Iolanda', room: 'Sala 01', category: 'diversificada' },
        { id: '1a-sex-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Téc: Ferramentas de I.A no Trabalho', teacher: 'Prof. Djalma', room: 'Lab. Informática', category: 'diversificada' },
        { id: '1a-sex-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Educação Física', teacher: 'Prof. Rodrigo Matos', room: 'Quadra', category: 'linguagens' },
        { id: '1a-sex-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Assembleia Semanal & Metas', teacher: 'Coordenação', room: 'Pátio', category: 'diversificada' },
      ],
    },
  },

  // 1ª Série B - Técnico em Administração
  {
    id: '1b',
    name: '1ª Série B - Téc. em Administração',
    shortName: '1ª Série B (Téc. Administração)',
    grade: '1º Ano EM · Curso Técnico em Administração',
    shift: 'Tempo Integral (07:30 às 17:10)',
    roomNumber: 'Sala 02 - Bloco Didático',
    advisorTeacher: 'Profª. Iolanda (Administração & Gestão)',
    schedule: {
      segunda: [
        { id: '1b-seg-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Matemática', teacher: 'Profª. Edite', room: 'Sala 02', category: 'matematica' },
        { id: '1b-seg-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Inglês', teacher: 'Profª. Elayne', room: 'Sala 02', category: 'linguagens' },
        { id: '1b-seg-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Economia & Mercado (Eco. Mer.)', teacher: 'Profª. Iolanda', room: 'Sala 02', category: 'diversificada' },
        { id: '1b-seg-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Ética Profissional (Ética. P)', teacher: 'Profª. Iolanda', room: 'Sala 02', category: 'diversificada' },
        { id: '1b-seg-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Português', teacher: 'Profª. Naiara', room: 'Sala 02', category: 'linguagens' },
        { id: '1b-seg-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Português', teacher: 'Profª. Naiara', room: 'Sala 02', category: 'linguagens' },
        { id: '1b-seg-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Biologia', teacher: 'Prof. Dhones', room: 'Lab. Ciências', category: 'natureza' },
        { id: '1b-seg-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Inteligência Artificial (I.A)', teacher: 'Prof. Djalma', room: 'Lab. Informática', category: 'diversificada' },
      ],
      terca: [
        { id: '1b-ter-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Teoria Geral da Administração', teacher: 'Profª. Iolanda', room: 'Sala 02', category: 'diversificada' },
        { id: '1b-ter-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Teoria Geral da Administração', teacher: 'Profª. Iolanda', room: 'Sala 02', category: 'diversificada' },
        { id: '1b-ter-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Matemática', teacher: 'Profª. Edite', room: 'Sala 02', category: 'matematica' },
        { id: '1b-ter-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Português', teacher: 'Profª. Naiara', room: 'Sala 02', category: 'linguagens' },
        { id: '1b-ter-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'História', teacher: 'Prof. Marcos Silva', room: 'Sala 02', category: 'humanas' },
        { id: '1b-ter-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Química Aplicada', teacher: 'Prof. Roberto Mendes', room: 'Lab. Ciências', category: 'natureza' },
        { id: '1b-ter-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Educação Física', teacher: 'Prof. Rodrigo Matos', room: 'Quadra', category: 'linguagens' },
        { id: '1b-ter-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Projeto de Vida', teacher: 'Profª. Aline Costa', room: 'Sala 02', category: 'diversificada' },
      ],
      quarta: [
        { id: '1b-qua-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Téc: Informática Aplicada à Gestão', teacher: 'Prof. Djalma', room: 'Lab. Informática', category: 'diversificada' },
        { id: '1b-qua-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Téc: Gestão de Documentos & Processos', teacher: 'Profª. Iolanda', room: 'Sala 02', category: 'diversificada' },
        { id: '1b-qua-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Física', teacher: 'Prof. Daniel Rocha', room: 'Sala 02', category: 'natureza' },
        { id: '1b-qua-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Biologia', teacher: 'Prof. Dhones', room: 'Lab. Ciências', category: 'natureza' },
        { id: '1b-qua-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Geografia', teacher: 'Profª. Luciana Mendes', room: 'Sala 02', category: 'humanas' },
        { id: '1b-qua-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Português & Redação', teacher: 'Profª. Naiara', room: 'Sala 02', category: 'linguagens' },
        { id: '1b-qua-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Clube de Protagonismo Juvenil', teacher: 'Coord. Pedagógica', room: 'Auditório', category: 'diversificada' },
        { id: '1b-qua-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Estudo Orientado I', teacher: 'Profª. Iolanda', room: 'Biblioteca', category: 'diversificada' },
      ],
      quinta: [
        { id: '1b-qui-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Inglês', teacher: 'Profª. Elayne', room: 'Sala 02', category: 'linguagens' },
        { id: '1b-qui-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Matemática Financeira Básica', teacher: 'Profª. Edite', room: 'Sala 02', category: 'matematica' },
        { id: '1b-qui-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Sociologia', teacher: 'Prof. Marcos Silva', room: 'Sala 02', category: 'humanas' },
        { id: '1b-qui-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Filosofia', teacher: 'Prof. Marcos Silva', room: 'Sala 02', category: 'humanas' },
        { id: '1b-qui-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Téc: Rotinas Administrativas', teacher: 'Profª. Iolanda', room: 'Sala 02', category: 'diversificada' },
        { id: '1b-qui-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Artes', teacher: 'Profª. Mariana Lima', room: 'Sala de Artes', category: 'linguagens' },
        { id: '1b-qui-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Tutoria Coletiva', teacher: 'Profª. Iolanda', room: 'Sala 02', category: 'diversificada' },
        { id: '1b-qui-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Nivelamento de Aprendizagem', teacher: 'Equipe Pedagógica', room: 'Sala 02', category: 'diversificada' },
      ],
      sexta: [
        { id: '1b-sex-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Matemática', teacher: 'Profª. Edite', room: 'Sala 02', category: 'matematica' },
        { id: '1b-sex-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Português', teacher: 'Profª. Naiara', room: 'Sala 02', category: 'linguagens' },
        { id: '1b-sex-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Física', teacher: 'Prof. Daniel Rocha', room: 'Sala 02', category: 'natureza' },
        { id: '1b-sex-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Biologia', teacher: 'Prof. Dhones', room: 'Lab. Ciências', category: 'natureza' },
        { id: '1b-sex-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Téc: Empreendedorismo & Startups', teacher: 'Profª. Iolanda', room: 'Sala 02', category: 'diversificada' },
        { id: '1b-sex-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Téc: I.A Aplicada à Produtividade', teacher: 'Prof. Djalma', room: 'Lab. Informática', category: 'diversificada' },
        { id: '1b-sex-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Educação Física', teacher: 'Prof. Rodrigo Matos', room: 'Quadra', category: 'linguagens' },
        { id: '1b-sex-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Assembleia de Turma', teacher: 'Coordenação', room: 'Pátio', category: 'diversificada' },
      ],
    },
  },

  // 2ª Série A - Técnico em Administração
  {
    id: '2a',
    name: '2ª Série A - Téc. em Administração',
    shortName: '2ª Série A (Téc. Administração)',
    grade: '2º Ano EM · Curso Técnico em Administração',
    shift: 'Tempo Integral (07:30 às 17:10)',
    roomNumber: 'Sala 03 - Bloco Didático',
    advisorTeacher: 'Profª. Edite (Matemática & Gestão Financeira)',
    schedule: {
      segunda: [
        { id: '2a-seg-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Téc: Gestão Financeira & Custos', teacher: 'Profª. Edite', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-seg-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Téc: Gestão Financeira & Custos', teacher: 'Profª. Edite', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-seg-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Língua Portuguesa & Comunicação Empresarial', teacher: 'Profª. Naiara', room: 'Sala 03', category: 'linguagens' },
        { id: '2a-seg-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Matemática II', teacher: 'Profª. Edite', room: 'Sala 03', category: 'matematica' },
        { id: '2a-seg-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Téc: Gestão de Pessoas & Liderança', teacher: 'Profª. Iolanda', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-seg-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Téc: Gestão de Pessoas & Liderança', teacher: 'Profª. Iolanda', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-seg-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Biologia Ambiental & Sustentabilidade', teacher: 'Prof. Dhones', room: 'Lab. Ciências', category: 'natureza' },
        { id: '2a-seg-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Estudo Orientado II', teacher: 'Profª. Edite', room: 'Biblioteca', category: 'diversificada' },
      ],
      terca: [
        { id: '2a-ter-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Téc: Marketing & Comportamento do Consumidor', teacher: 'Profª. Iolanda', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-ter-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Téc: Marketing & Comportamento do Consumidor', teacher: 'Profª. Iolanda', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-ter-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Inglês para Negócios & Relações Internacionais', teacher: 'Profª. Elayne', room: 'Sala 03', category: 'linguagens' },
        { id: '2a-ter-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Geopolítica e Economia Regional', teacher: 'Profª. Luciana Mendes', room: 'Sala 03', category: 'humanas' },
        { id: '2a-ter-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Física Aplicada', teacher: 'Prof. Daniel Rocha', room: 'Sala 03', category: 'natureza' },
        { id: '2a-ter-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Química Geral', teacher: 'Prof. Roberto Mendes', room: 'Lab. Ciências', category: 'natureza' },
        { id: '2a-ter-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Educação Física & Ergonomia Corporativa', teacher: 'Prof. Rodrigo Matos', room: 'Quadra', category: 'linguagens' },
        { id: '2a-ter-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Projeto de Vida II & Plano de Carreira', teacher: 'Profª. Aline Costa', room: 'Sala 03', category: 'diversificada' },
      ],
      quarta: [
        { id: '2a-qua-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Téc: Logística & Cadeia de Suprimentos', teacher: 'Profª. Iolanda', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-qua-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Téc: Logística & Cadeia de Suprimentos', teacher: 'Profª. Iolanda', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-qua-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Português & Produção de Textos Técnicos', teacher: 'Profª. Naiara', room: 'Sala 03', category: 'linguagens' },
        { id: '2a-qua-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'História Contemporânea', teacher: 'Prof. Marcos Silva', room: 'Sala 03', category: 'humanas' },
        { id: '2a-qua-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Matemática II & Estatística Aplicada', teacher: 'Profª. Edite', room: 'Sala 03', category: 'matematica' },
        { id: '2a-qua-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Téc: Inteligência Artificial na Gestão de Negócios', teacher: 'Prof. Djalma', room: 'Lab. Informática', category: 'diversificada' },
        { id: '2a-qua-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Iniciação Científica & Projetos de Extensão', teacher: 'Prof. Dhones', room: 'Biblioteca', category: 'diversificada' },
        { id: '2a-qua-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Estudo Orientado II', teacher: 'Profª. Naiara', room: 'Sala 03', category: 'diversificada' },
      ],
      quinta: [
        { id: '2a-qui-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Matemática II', teacher: 'Profª. Edite', room: 'Sala 03', category: 'matematica' },
        { id: '2a-qui-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Téc: Legislação Empresarial & Trabalhista', teacher: 'Profª. Iolanda', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-qui-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Sociologia do Trabalho', teacher: 'Prof. Marcos Silva', room: 'Sala 03', category: 'humanas' },
        { id: '2a-qui-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Filosofia & Ética Corporativa', teacher: 'Prof. Marcos Silva', room: 'Sala 03', category: 'humanas' },
        { id: '2a-qui-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Biologia Celular', teacher: 'Prof. Dhones', room: 'Lab. Ciências', category: 'natureza' },
        { id: '2a-qui-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Inglês', teacher: 'Profª. Elayne', room: 'Sala 03', category: 'linguagens' },
        { id: '2a-qui-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Mentoria & Plano de Negócios', teacher: 'Profª. Iolanda', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-qui-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Simulado Preparatório ENEM', teacher: 'Equipe Docente', room: 'Sala 03', category: 'diversificada' },
      ],
      sexta: [
        { id: '2a-sex-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Redação para o ENEM Nota 1000', teacher: 'Profª. Naiara', room: 'Sala 03', category: 'linguagens' },
        { id: '2a-sex-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Redação para o ENEM Nota 1000', teacher: 'Profª. Naiara', room: 'Sala 03', category: 'linguagens' },
        { id: '2a-sex-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Matemática Financeira Avançada', teacher: 'Profª. Edite', room: 'Sala 03', category: 'matematica' },
        { id: '2a-sex-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Téc: Software de Gestão (ERP/Planilhas)', teacher: 'Prof. Djalma', room: 'Lab. Informática', category: 'diversificada' },
        { id: '2a-sex-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Téc: Software de Gestão (ERP/Planilhas)', teacher: 'Prof. Djalma', room: 'Lab. Informática', category: 'diversificada' },
        { id: '2a-sex-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Física & Energia', teacher: 'Prof. Daniel Rocha', room: 'Sala 03', category: 'natureza' },
        { id: '2a-sex-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Educação Física', teacher: 'Prof. Rodrigo Matos', room: 'Quadra', category: 'linguagens' },
        { id: '2a-sex-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Feedbacks de Metas & Fechamento', teacher: 'Coordenação', room: 'Sala 03', category: 'diversificada' },
      ],
    },
  },

  // 3ª Série A - Técnico em Desenvolvimento de Sistemas
  {
    id: '3a',
    name: '3ª Série A - Téc. em Desenvolvimento de Sistemas',
    shortName: '3ª Série A (Téc. Desenv. Sistemas)',
    grade: '3º Ano EM · Curso Técnico em Desenvolvimento de Sistemas',
    shift: 'Tempo Integral (07:30 às 17:10)',
    roomNumber: 'Sala 05 - Lab. de Informática & TI',
    advisorTeacher: 'Prof. Daniel Rocha (Informática & Sistemas)',
    schedule: {
      segunda: [
        { id: '3a-seg-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Redação Nota 1000 - ENEM', teacher: 'Profª. Naiara', room: 'Sala 05', category: 'linguagens' },
        { id: '3a-seg-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Redação Nota 1000 - ENEM', teacher: 'Profª. Naiara', room: 'Sala 05', category: 'linguagens' },
        { id: '3a-seg-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Matemática e Suas Tecnologias', teacher: 'Profª. Edite', room: 'Sala 05', category: 'matematica' },
        { id: '3a-seg-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Matemática e Suas Tecnologias', teacher: 'Profª. Edite', room: 'Sala 05', category: 'matematica' },
        { id: '3a-seg-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Física Aplicada à Computação', teacher: 'Prof. Daniel Rocha', room: 'Sala 05', category: 'natureza' },
        { id: '3a-seg-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Téc: Lógica de Programação & Algoritmos', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '3a-seg-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Téc: Lógica de Programação & Algoritmos', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '3a-seg-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Projeto de Vida & Mercado de TI', teacher: 'Profª. Aline Costa', room: 'Sala 05', category: 'diversificada' },
      ],
      terca: [
        { id: '3a-ter-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'História Contemporânea & Mundo do Trabalho', teacher: 'Prof. Marcos Silva', room: 'Sala 05', category: 'humanas' },
        { id: '3a-ter-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Geopolítica e Globalização Digital', teacher: 'Profª. Luciana Mendes', room: 'Sala 05', category: 'humanas' },
        { id: '3a-ter-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Língua Portuguesa & Interpretação Textual', teacher: 'Profª. Naiara', room: 'Sala 05', category: 'linguagens' },
        { id: '3a-ter-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Inglês Técnico Instrumental', teacher: 'Profª. Elayne', room: 'Lab. Idiomas', category: 'linguagens' },
        { id: '3a-ter-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Filosofia & Ética na Inteligência Artificial', teacher: 'Prof. Marcos Silva', room: 'Sala 05', category: 'humanas' },
        { id: '3a-ter-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Téc: Banco de Dados & Modelagem SQL', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '3a-ter-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Téc: Banco de Dados & Modelagem SQL', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '3a-ter-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Educação Física & Ergonomia no Trabalho', teacher: 'Prof. Rodrigo Matos', room: 'Quadra', category: 'linguagens' },
      ],
      quarta: [
        { id: '3a-qua-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Biologia & Sustentabilidade Tecnológica', teacher: 'Prof. Dhones', room: 'Sala 05', category: 'natureza' },
        { id: '3a-qua-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Química dos Materiais & Semicondutores', teacher: 'Prof. Roberto Mendes', room: 'Lab. Ciências', category: 'natureza' },
        { id: '3a-qua-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Téc: Desenvolvimento Web (HTML/CSS/JS/React)', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '3a-qua-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Téc: Desenvolvimento Web (HTML/CSS/JS/React)', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '3a-qua-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Literatura Brasileira e Artes', teacher: 'Profª. Naiara', room: 'Sala 05', category: 'linguagens' },
        { id: '3a-qua-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Laboratório de Redação Nota 1000', teacher: 'Profª. Naiara', room: 'Sala 05', category: 'linguagens' },
        { id: '3a-qua-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Oficina SiSU, Prouni e Carreiras Tecnológicas', teacher: 'Profª. Aline Costa', room: 'Lab. Informática', category: 'diversificada' },
        { id: '3a-qua-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Estudo Orientado III - Plantão de Humanas & TI', teacher: 'Prof. Marcos Silva', room: 'Biblioteca', category: 'diversificada' },
      ],
      quinta: [
        { id: '3a-qui-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Téc: Engenharia de Software & Metodologias Ágeis', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '3a-qui-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Téc: Engenharia de Software & Metodologias Ágeis', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '3a-qui-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Matemática Discreta & Álgebra Linear', teacher: 'Profª. Edite', room: 'Sala 05', category: 'matematica' },
        { id: '3a-qui-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'História Geral & Revoluções Industriais', teacher: 'Prof. Marcos Silva', room: 'Sala 05', category: 'humanas' },
        { id: '3a-qui-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Geografia do Piauí & Polos Tecnológicos', teacher: 'Profª. Luciana Mendes', room: 'Sala 05', category: 'humanas' },
        { id: '3a-qui-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Téc: Redes de Computadores & Cibersegurança', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '3a-qui-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Téc: Redes de Computadores & Cibersegurança', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '3a-qui-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Simulado Rápido de Questões ENEM (TRI)', teacher: 'Equipe de Professores', room: 'Sala 05', category: 'diversificada' },
      ],
      sexta: [
        { id: '3a-sex-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Simulado Geral Oficial - Bloco 1 (Linguagens/Humanas)', teacher: 'Banca Docente CETI', room: 'Sala 05', category: 'diversificada' },
        { id: '3a-sex-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Simulado Geral Oficial - Bloco 1 (Linguagens/Humanas)', teacher: 'Banca Docente CETI', room: 'Sala 05', category: 'diversificada' },
        { id: '3a-sex-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Téc: Projeto Integrador de Sistemas (TCC)', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '3a-sex-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Téc: Projeto Integrador de Sistemas (TCC)', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '3a-sex-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Correção Comentada do Simulado ENEM', teacher: 'Profª. Naiara & Profª. Edite', room: 'Sala 05', category: 'linguagens' },
        { id: '3a-sex-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Correção de Exatas e Natureza', teacher: 'Prof. Daniel & Prof. Dhones', room: 'Sala 05', category: 'natureza' },
        { id: '3a-sex-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Educação Física & Descompressão Esportiva', teacher: 'Prof. Rodrigo Matos', room: 'Quadra', category: 'linguagens' },
        { id: '3a-sex-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Feedbacks de Metas & Planejamento Semanal', teacher: 'Coordenação e Direção', room: 'Sala 05', category: 'diversificada' },
      ],
    },
  },

  // 3ª Série B - Técnico em Controle Ambiental
  {
    id: '3b',
    name: '3ª Série B - Téc. em Controle Ambiental',
    shortName: '3ª Série B (Téc. Controle Ambiental)',
    grade: '3º Ano EM · Curso Técnico em Controle Ambiental',
    shift: 'Tempo Integral (07:30 às 17:10)',
    roomNumber: 'Sala 06 - Lab. de Meio Ambiente & Ciências',
    advisorTeacher: 'Profª. Juliana Rios (Ciências & Gestão Ambiental)',
    schedule: {
      segunda: [
        { id: '3b-seg-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Redação Nota 1000 - ENEM', teacher: 'Profª. Naiara', room: 'Sala 06', category: 'linguagens' },
        { id: '3b-seg-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Redação Nota 1000 - ENEM', teacher: 'Profª. Naiara', room: 'Sala 06', category: 'linguagens' },
        { id: '3b-seg-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Matemática e Suas Tecnologias', teacher: 'Profª. Edite', room: 'Sala 06', category: 'matematica' },
        { id: '3b-seg-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Matemática e Suas Tecnologias', teacher: 'Profª. Edite', room: 'Sala 06', category: 'matematica' },
        { id: '3b-seg-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Biologia Celular e Ecossistemas', teacher: 'Prof. Dhones', room: 'Sala 06', category: 'natureza' },
        { id: '3b-seg-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Téc: Monitoramento da Qualidade das Águas e Efluentes', teacher: 'Profª. Juliana Rios', room: 'Lab. Meio Ambiente', category: 'diversificada' },
        { id: '3b-seg-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Téc: Monitoramento da Qualidade das Águas e Efluentes', teacher: 'Profª. Juliana Rios', room: 'Lab. Meio Ambiente', category: 'diversificada' },
        { id: '3b-seg-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Projeto de Vida & Carreiras Ambientais', teacher: 'Profª. Aline Costa', room: 'Sala 06', category: 'diversificada' },
      ],
      terca: [
        { id: '3b-ter-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'História do Brasil & Questões Agrárias', teacher: 'Prof. Marcos Silva', room: 'Sala 06', category: 'humanas' },
        { id: '3b-ter-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Geografia do Semiárido & Climatologia Piauiense', teacher: 'Profª. Luciana Mendes', room: 'Sala 06', category: 'humanas' },
        { id: '3b-ter-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Língua Portuguesa & Produção Textual', teacher: 'Profª. Naiara', room: 'Sala 06', category: 'linguagens' },
        { id: '3b-ter-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Língua Inglesa Técnica para Sustentabilidade', teacher: 'Profª. Elayne', room: 'Lab. Idiomas', category: 'linguagens' },
        { id: '3b-ter-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Filosofia, Bioética e Meio Ambiente', teacher: 'Prof. Marcos Silva', room: 'Sala 06', category: 'humanas' },
        { id: '3b-ter-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Téc: Gestão e Tratamento de Resíduos Sólidos', teacher: 'Prof. Roberto Mendes', room: 'Lab. Ciências', category: 'diversificada' },
        { id: '3b-ter-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Téc: Gestão e Tratamento de Resíduos Sólidos', teacher: 'Prof. Roberto Mendes', room: 'Lab. Ciências', category: 'diversificada' },
        { id: '3b-ter-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Educação Física & Saúde Comunitária', teacher: 'Prof. Rodrigo Matos', room: 'Quadra', category: 'linguagens' },
      ],
      quarta: [
        { id: '3b-qua-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Téc: Química e Microbiologia Ambiental', teacher: 'Prof. Roberto Mendes', room: 'Lab. Ciências', category: 'diversificada' },
        { id: '3b-qua-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Téc: Química e Microbiologia Ambiental', teacher: 'Prof. Roberto Mendes', room: 'Lab. Ciências', category: 'diversificada' },
        { id: '3b-qua-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Física Térmica & Energias Renováveis (Solar/Eólica)', teacher: 'Prof. Daniel Rocha', room: 'Sala 06', category: 'natureza' },
        { id: '3b-qua-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Física Térmica & Energias Renováveis (Solar/Eólica)', teacher: 'Prof. Daniel Rocha', room: 'Sala 06', category: 'natureza' },
        { id: '3b-qua-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Literatura Brasileira e Paisagens Naturais', teacher: 'Profª. Naiara', room: 'Sala 06', category: 'linguagens' },
        { id: '3b-qua-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Laboratório de Redação: Temas Socioambientais ENEM', teacher: 'Profª. Naiara', room: 'Sala 06', category: 'linguagens' },
        { id: '3b-qua-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Oficina de Carreiras em Engenharia Ambiental & Biologia', teacher: 'Profª. Aline Costa', room: 'Lab. Informática', category: 'diversificada' },
        { id: '3b-qua-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Estudo Orientado III - Plantão de Ciências da Natureza', teacher: 'Prof. Dhones', room: 'Biblioteca', category: 'diversificada' },
      ],
      quinta: [
        { id: '3b-qui-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Téc: Legislação, Normas ISO & Licenciamento Ambiental', teacher: 'Profª. Juliana Rios', room: 'Sala 06', category: 'diversificada' },
        { id: '3b-qui-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Téc: Legislação, Normas ISO & Licenciamento Ambiental', teacher: 'Profª. Juliana Rios', room: 'Sala 06', category: 'diversificada' },
        { id: '3b-qui-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Matemática Financeira e Estatística Amostral', teacher: 'Profª. Edite', room: 'Sala 06', category: 'matematica' },
        { id: '3b-qui-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Sociologia e Impactos da Degradação Ambiental', teacher: 'Prof. Marcos Silva', room: 'Sala 06', category: 'humanas' },
        { id: '3b-qui-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Téc: Recuperação de Áreas Degradadas e Recursos Hídricos', teacher: 'Profª. Juliana Rios', room: 'Lab. Meio Ambiente', category: 'diversificada' },
        { id: '3b-qui-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Téc: Recuperação de Áreas Degradadas e Recursos Hídricos', teacher: 'Profª. Juliana Rios', room: 'Lab. Meio Ambiente', category: 'diversificada' },
        { id: '3b-qui-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Cartografia Digital & Sensoriamento Remoto', teacher: 'Profª. Luciana Mendes', room: 'Lab. Informática', category: 'humanas' },
        { id: '3b-qui-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Simulado Rápido de Questões ENEM (Natureza & Exatas)', teacher: 'Equipe de Professores', room: 'Sala 06', category: 'diversificada' },
      ],
      sexta: [
        { id: '3b-sex-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Simulado Geral Oficial - Bloco 1 (Natureza/Matemática)', teacher: 'Banca Docente CETI', room: 'Sala 06', category: 'diversificada' },
        { id: '3b-sex-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Simulado Geral Oficial - Bloco 1 (Natureza/Matemática)', teacher: 'Banca Docente CETI', room: 'Sala 06', category: 'diversificada' },
        { id: '3b-sex-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Téc: Projeto Integrador de Controle Ambiental (TCC)', teacher: 'Profª. Juliana Rios', room: 'Lab. Meio Ambiente', category: 'diversificada' },
        { id: '3b-sex-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Téc: Projeto Integrador de Controle Ambiental (TCC)', teacher: 'Profª. Juliana Rios', room: 'Lab. Meio Ambiente', category: 'diversificada' },
        { id: '3b-sex-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Correção Comentada do Simulado ENEM', teacher: 'Prof. Dhones & Prof. Roberto', room: 'Sala 06', category: 'natureza' },
        { id: '3b-sex-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Correção de Linguagens e Redação', teacher: 'Profª. Naiara', room: 'Sala 06', category: 'linguagens' },
        { id: '3b-sex-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Educação Física & Descompressão', teacher: 'Prof. Rodrigo Matos', room: 'Quadra', category: 'linguagens' },
        { id: '3b-sex-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Feedbacks de Metas & Planejamento Semanal', teacher: 'Coordenação e Direção', room: 'Sala 06', category: 'diversificada' },
      ],
    },
  },
];

export interface SchoolStaffMember {
  role: string;
  name: string;
  department: string;
  contact?: string;
  description: string;
}

export const SCHOOL_STAFF: SchoolStaffMember[] = [
  {
    role: 'Direção Geral',
    name: 'Gestão Escolar CETI Verônica Celestina Dias',
    department: 'Direção Executiva',
    contact: '+55 89 9410-7024',
    description: 'Responsável pela administração geral, cumprimento das diretrizes da SEDUC-PI, infraestrutura e acolhimento comunitário.',
  },
  {
    role: 'Coordenação Pedagógica',
    name: 'Equipe de Coordenação do Tempo Integral & Cursos Técnicos',
    department: 'Coordenação de Ensino & Cursos Profissionalizantes',
    contact: 'Atendimento via Secretaria',
    description: 'Acompanhamento do rendimento dos estudantes, planejamento de aulas dos professores, cursos técnicos (Administração, Desenv. de Sistemas e Controle Ambiental) e projeto de vida.',
  },
  {
    role: 'Secretaria Escolar',
    name: 'Atendimento ao Público & Documentação',
    department: 'Secretaria e Registros Acadêmicos',
    contact: 'Horário: 08:00 às 16:00',
    description: 'Emissão de declarações, matrículas, histórico escolar, transferências e certidões acadêmicas.',
  },
  {
    role: 'Nutrição & Alimentação Escolar',
    name: 'Equipe do Programa de Alimentação Escolar (PNAE/SEDUC)',
    department: 'Refeitório e Nutrição',
    description: 'Supervisão de 3 refeições diárias balanceadas (lanche da manhã, almoço completo e lanche da tarde).',
  },
  {
    role: 'Biblioteca Digital & Sala de Estudos',
    name: 'Responsável pelo Acervo e Mediação de Leitura',
    department: 'Espaço de Leitura e Cultura',
    description: 'Gestão dos empréstimos de livros físicos e digitais, orientação de pesquisas escolares e apoio ao ENEM.',
  },
];

export interface CalendarEvent {
  period: string;
  title: string;
  badge: string;
  description: string;
  status: 'concluido' | 'vigente' | 'proximo';
}

export const SCHOOL_CALENDAR_2026: CalendarEvent[] = [
  {
    period: '02 a 06 de Fevereiro de 2026',
    title: 'Semana Pedagógica & Acolhida dos Novos Estudantes',
    badge: 'Início do Ano Letivo',
    description: 'Planejamento dos professores, matrícula final e recepção calorosa dos estudantes dos cursos técnicos com acolhida e integração.',
    status: 'concluido',
  },
  {
    period: 'Fevereiro a Abril de 2026',
    title: '1º Bimestre Letivo & Diagnóstico de Aprendizagem',
    badge: '1º Bimestre',
    description: 'Avaliações diagnósticas, implantação das turmas do Tempo Integral Técnico, lançamento dos Clubes de Protagonismo e Plantão Pedagógico.',
    status: 'vigente',
  },
  {
    period: '13 a 17 de Abril de 2026',
    title: 'Semana de Avaliações Bimestrais e Recuperação Contínua',
    badge: 'Provas Bimestrais',
    description: 'Provas objetivas e discursivas da base e técnica, feedback das notas aos alunos e conselho de classe participativo.',
    status: 'proximo',
  },
  {
    period: 'Maio a Junho de 2026',
    title: '2º Bimestre: Feira Cultural & Circuito de Talentos',
    badge: '2º Bimestre',
    description: 'Mostra das tradições piauienses, feira empreendedora do curso de Administração, festival junino escolar e 1º Simulado Preparatório ENEM.',
    status: 'proximo',
  },
  {
    period: 'Julho de 2026',
    title: 'Recesso Escolar de Meio de Ano (Férias Docentes e Discentes)',
    badge: 'Recesso',
    description: 'Descanso escolar regulamentar conforme o calendário oficial da SEDUC Piauí.',
    status: 'proximo',
  },
  {
    period: 'Agosto a Setembro de 2026',
    title: '3º Bimestre: Jogos Interclasses e Jornada de Ciências, TI & Sustentabilidade',
    badge: '3º Bimestre',
    description: 'Competições esportivas nas modalidades futsal, vôlei e atletismo, além de demonstração dos projetos de robótica, controle ambiental e gestão.',
    status: 'proximo',
  },
  {
    period: 'Outubro a Novembro de 2026',
    title: '4º Bimestre: Reta Final ENEM & Maratona de Redação Nota 1000',
    badge: '4º Bimestre / ENEM',
    description: 'Revisões intensivas nos laboratórios, aulões aos sábados, acolhimento socioemocional e aplicação do SAEPI / SAEB.',
    status: 'proximo',
  },
  {
    period: 'Dezembro de 2026',
    title: 'Encerramento do Ano Letivo & Formatura dos Cursos Técnicos',
    badge: 'Formatura',
    description: 'Publicação dos resultados finais no sistema SEDUC, solenidade de formatura das turmas técnicas da 3ª Série e início do período de rematrícula.',
    status: 'proximo',
  },
];

export interface SchoolRuleGuide {
  iconName: string;
  title: string;
  highlight: string;
  items: string[];
}

export const SCHOOL_RULES_GUIDE: SchoolRuleGuide[] = [
  {
    iconName: 'Shirt',
    title: 'Fardamento Escolar Oficial',
    highlight: 'Uso obrigatório diariamente',
    items: [
      'Camisa padrão fornecida pelo Governo do Piauí / SEDUC.',
      'Calça comprida padrão e calçado fechado (tênis) para segurança física em laboratórios técnicos, informática e escadarias.',
      'Uniforme de Educação Física permitido exclusivamente durante os dias e horários de atividades esportivas.',
    ],
  },
  {
    iconName: 'Clock',
    title: 'Horários & Pontualidade',
    highlight: 'Entrada pontual às 07:30 e encerramento às 17:10',
    items: [
      'Entrada dos estudantes pontualmente às 07:30 para o início das aulas.',
      'Aulas iniciam às 07:30 e encerram às 17:10 com pontualidade.',
      'Saídas antecipadas são autorizadas estritamente com presença ou autorização expressa dos pais/responsáveis.',
    ],
  },
  {
    iconName: 'Smartphone',
    title: 'Uso Pedagógico de Celulares & Computadores',
    highlight: 'Foco na aprendizagem técnica e convivência saudável',
    items: [
      'Celulares devem permanecer guardados e em modo silencioso durante as explicações em sala.',
      'Permitido exclusivamente mediante orientação do professor para pesquisas em aula, desenvolvimento nos laboratórios e uso pedagógico.',
      'Nos intervalos e almoço, o convívio comunitário, esportes e biblioteca são amplamente incentivados.',
    ],
  },
  {
    iconName: 'Utensils',
    title: 'Alimentação Escolar Completa',
    highlight: 'Refeições balanceadas e gratuitas ao longo do dia',
    items: [
      'Todos os estudantes têm direito ao cardápio balanceado elaborado por nutricionistas da SEDUC.',
      'São servidos: Lanche da Manhã (09:30), Almoço Completo (11:50) e Lanche da Tarde (14:50).',
      'Restrições alimentares (alergias, diabetes, intolerâncias) devem ser informadas na secretaria escolar.',
    ],
  },
  {
    iconName: 'HeartHandshake',
    title: 'Respeito Mútuo & Anti-Bullying',
    highlight: 'Ambiente seguro e acolhedor para todos',
    items: [
      'Tolerância zero para qualquer manifestação de bullying, preconceito, intimidação ou discriminação.',
      'Canal de denúncia e acolhimento disponível na escola e online para proteção rápida do estudante.',
      'Estímulo contínuo ao diálogo, mediação de conflitos e escuta ativa com a equipe de coordenação.',
    ],
  },
];
