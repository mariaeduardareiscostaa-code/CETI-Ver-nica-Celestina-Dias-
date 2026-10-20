export interface ClassScheduleItem {
  id: string;
  timeSlot: string; // Ex: '07:30 - 08:20'
  slotNumber: number; // 1 to 9, or 0 for acolhimento/intervalo
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
    time: '07:00 - 07:30',
    title: 'Acolhimento & Café da Manhã',
    type: 'acolhimento',
    description: 'Recepção dos alunos, momento de acolhida institucional e café da manhã balanceado.',
  },
  {
    time: '07:30 - 08:20',
    title: '1ª Aula',
    type: 'aula',
    description: 'Primeiro tempo pedagógico matutino.',
  },
  {
    time: '08:20 - 09:10',
    title: '2ª Aula',
    type: 'aula',
    description: 'Segundo tempo pedagógico.',
  },
  {
    time: '09:10 - 10:00',
    title: '3ª Aula',
    type: 'aula',
    description: 'Terceiro tempo pedagógico.',
  },
  {
    time: '10:00 - 10:20',
    title: 'Intervalo & Lanche da Manhã',
    type: 'refeicao',
    description: 'Pausa para recreação e lanche matutino nutritivo preparado pelo PNAE.',
  },
  {
    time: '10:20 - 11:10',
    title: '4ª Aula',
    type: 'aula',
    description: 'Quarto tempo pedagógico.',
  },
  {
    time: '11:10 - 12:00',
    title: '5ª Aula',
    type: 'aula',
    description: 'Quinto tempo pedagógico antes da refeição principal.',
  },
  {
    time: '12:00 - 13:20',
    title: 'Almoço Escolar & Descanso Orientado',
    type: 'refeicao',
    description: 'Refeição quente completa no refeitório climatizado e intervalo de convivência, leitura e repouso.',
  },
  {
    time: '13:20 - 14:10',
    title: '6ª Aula',
    type: 'aula',
    description: 'Início do bloco pedagógico vespertino.',
  },
  {
    time: '14:10 - 15:00',
    title: '7ª Aula',
    type: 'aula',
    description: 'Sétimo tempo pedagógico.',
  },
  {
    time: '15:00 - 15:20',
    title: 'Intervalo & Lanche da Tarde',
    type: 'refeicao',
    description: 'Pausa para hidratação e lanche da tarde.',
  },
  {
    time: '15:20 - 16:10',
    title: '8ª Aula',
    type: 'aula',
    description: 'Oitavo tempo pedagógico.',
  },
  {
    time: '16:10 - 17:00',
    title: '9ª Aula: Estudo Orientado / Eletivas',
    type: 'aula',
    description: 'Oficinas práticas, resolução de exercícios, preparação para ENEM e tutoria.',
  },
  {
    time: '17:00',
    title: 'Encerramento & Transporte Escolar',
    type: 'encerramento',
    description: 'Final das atividades letivas diárias e embarque no transporte escolar.',
  },
];

export const SCHOOL_CLASSES: SchoolClass[] = [
  {
    id: '1a',
    name: '1ª Série A - Ensino Médio Integral',
    shortName: '1ª Série A',
    grade: '1º Ano EM',
    shift: 'Tempo Integral (07:00 às 17:00)',
    roomNumber: 'Sala 01 - Bloco Didático',
    advisorTeacher: 'Profª. Francisca Oliveira (Língua Portuguesa)',
    schedule: {
      segunda: [
        { id: '1', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Língua Portuguesa', teacher: 'Profª. Francisca', room: 'Sala 01', category: 'linguagens' },
        { id: '2', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Língua Portuguesa', teacher: 'Profª. Francisca', room: 'Sala 01', category: 'linguagens' },
        { id: '3', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Matemática I', teacher: 'Prof. Carlos Eduardo', room: 'Sala 01', category: 'matematica' },
        { id: '4', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'Matemática I', teacher: 'Prof. Carlos Eduardo', room: 'Sala 01', category: 'matematica' },
        { id: '5', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'História', teacher: 'Prof. Marcos Silva', room: 'Sala 01', category: 'humanas' },
        { id: '6', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Biologia', teacher: 'Profª. Juliana Rios', room: 'Lab. Ciências', category: 'natureza' },
        { id: '7', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Projeto de Vida', teacher: 'Profª. Aline Costa', room: 'Sala 01', category: 'diversificada' },
        { id: '8', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Educação Física', teacher: 'Prof. Rodrigo Matos', room: 'Quadra', category: 'linguagens' },
        { id: '9', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Estudo Orientado I', teacher: 'Prof. Carlos Eduardo', room: 'Biblioteca', category: 'diversificada' },
      ],
      terca: [
        { id: '10', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Química', teacher: 'Prof. Roberto Mendes', room: 'Lab. Ciências', category: 'natureza' },
        { id: '11', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Química', teacher: 'Prof. Roberto Mendes', room: 'Lab. Ciências', category: 'natureza' },
        { id: '12', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Geografia', teacher: 'Profª. Luciana Mendes', room: 'Sala 01', category: 'humanas' },
        { id: '13', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'Língua Inglesa', teacher: 'Prof. João Paulo', room: 'Sala 01', category: 'linguagens' },
        { id: '14', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Física', teacher: 'Prof. Daniel Rocha', room: 'Sala 01', category: 'natureza' },
        { id: '15', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Filosofia', teacher: 'Prof. Marcos Silva', room: 'Sala 01', category: 'humanas' },
        { id: '16', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Eletiva: Robótica e Sustentabilidade', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '17', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Eletiva: Robótica e Sustentabilidade', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '18', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Clube de Protagonismo', teacher: 'Coord. Pedagógica', room: 'Pátio / Auditório', category: 'diversificada' },
      ],
      quarta: [
        { id: '19', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Matemática I', teacher: 'Prof. Carlos Eduardo', room: 'Sala 01', category: 'matematica' },
        { id: '20', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Língua Portuguesa', teacher: 'Profª. Francisca', room: 'Sala 01', category: 'linguagens' },
        { id: '21', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Redação & Expressão', teacher: 'Profª. Francisca', room: 'Sala 01', category: 'linguagens' },
        { id: '22', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'Biologia Prática', teacher: 'Profª. Juliana Rios', room: 'Lab. Ciências', category: 'natureza' },
        { id: '23', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Sociologia', teacher: 'Prof. Marcos Silva', room: 'Sala 01', category: 'humanas' },
        { id: '24', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Física Experimental', teacher: 'Prof. Daniel Rocha', room: 'Lab. Ciências', category: 'natureza' },
        { id: '25', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Artes & Cultura Piauiense', teacher: 'Profª. Mariana Lima', room: 'Sala de Artes', category: 'linguagens' },
        { id: '26', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Iniciação Científica', teacher: 'Profª. Juliana Rios', room: 'Biblioteca', category: 'diversificada' },
        { id: '27', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Estudo Orientado I', teacher: 'Profª. Francisca', room: 'Sala 01', category: 'diversificada' },
      ],
      quinta: [
        { id: '28', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Física', teacher: 'Prof. Daniel Rocha', room: 'Sala 01', category: 'natureza' },
        { id: '29', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Química', teacher: 'Prof. Roberto Mendes', room: 'Sala 01', category: 'natureza' },
        { id: '30', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Língua Portuguesa', teacher: 'Profª. Francisca', room: 'Sala 01', category: 'linguagens' },
        { id: '31', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'História', teacher: 'Prof. Marcos Silva', room: 'Sala 01', category: 'humanas' },
        { id: '32', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Geografia', teacher: 'Profª. Luciana Mendes', room: 'Sala 01', category: 'humanas' },
        { id: '33', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Educação Financeira', teacher: 'Prof. Carlos Eduardo', room: 'Sala 01', category: 'matematica' },
        { id: '34', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Língua Inglesa', teacher: 'Prof. João Paulo', room: 'Lab. Idiomas', category: 'linguagens' },
        { id: '35', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Projeto de Vida (Prática)', teacher: 'Profª. Aline Costa', room: 'Sala 01', category: 'diversificada' },
        { id: '36', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Nivelamento de Aprendizagem', teacher: 'Equipe Pedagógica', room: 'Sala 01', category: 'diversificada' },
      ],
      sexta: [
        { id: '37', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Matemática I', teacher: 'Prof. Carlos Eduardo', room: 'Sala 01', category: 'matematica' },
        { id: '38', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Matemática I', teacher: 'Prof. Carlos Eduardo', room: 'Sala 01', category: 'matematica' },
        { id: '39', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Biologia', teacher: 'Profª. Juliana Rios', room: 'Sala 01', category: 'natureza' },
        { id: '40', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'Literatura Brasileira', teacher: 'Profª. Francisca', room: 'Biblioteca', category: 'linguagens' },
        { id: '41', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Educação Física', teacher: 'Prof. Rodrigo Matos', room: 'Quadra', category: 'linguagens' },
        { id: '42', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Oficina de Redação Nota 1000', teacher: 'Profª. Francisca', room: 'Sala 01', category: 'linguagens' },
        { id: '43', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Práticas Digitais & Informática', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '44', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Roda de Conversa & Tutoria', teacher: 'Profª. Aline Costa', room: 'Pátio Verde', category: 'diversificada' },
        { id: '45', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Avaliação Semanal de Metas', teacher: 'Coordenação', room: 'Sala 01', category: 'diversificada' },
      ],
    },
  },
  {
    id: '1b',
    name: '1ª Série B - Ensino Médio Integral',
    shortName: '1ª Série B',
    grade: '1º Ano EM',
    shift: 'Tempo Integral (07:00 às 17:00)',
    roomNumber: 'Sala 02 - Bloco Didático',
    advisorTeacher: 'Prof. Carlos Eduardo (Matemática)',
    schedule: {
      segunda: [
        { id: '50', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Matemática I', teacher: 'Prof. Carlos Eduardo', room: 'Sala 02', category: 'matematica' },
        { id: '51', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Matemática I', teacher: 'Prof. Carlos Eduardo', room: 'Sala 02', category: 'matematica' },
        { id: '52', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Língua Portuguesa', teacher: 'Profª. Francisca', room: 'Sala 02', category: 'linguagens' },
        { id: '53', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'História', teacher: 'Prof. Marcos Silva', room: 'Sala 02', category: 'humanas' },
        { id: '54', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Biologia', teacher: 'Profª. Juliana Rios', room: 'Sala 02', category: 'natureza' },
        { id: '55', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Projeto de Vida', teacher: 'Profª. Aline Costa', room: 'Sala 02', category: 'diversificada' },
        { id: '56', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Educação Física', teacher: 'Prof. Rodrigo Matos', room: 'Quadra', category: 'linguagens' },
        { id: '57', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Química', teacher: 'Prof. Roberto Mendes', room: 'Lab. Ciências', category: 'natureza' },
        { id: '58', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Estudo Orientado I', teacher: 'Prof. Carlos Eduardo', room: 'Sala 02', category: 'diversificada' },
      ],
      terca: [
        { id: '60', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Língua Portuguesa', teacher: 'Profª. Francisca', room: 'Sala 02', category: 'linguagens' },
        { id: '61', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Língua Portuguesa', teacher: 'Profª. Francisca', room: 'Sala 02', category: 'linguagens' },
        { id: '62', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Física', teacher: 'Prof. Daniel Rocha', room: 'Sala 02', category: 'natureza' },
        { id: '63', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'Geografia', teacher: 'Profª. Luciana Mendes', room: 'Sala 02', category: 'humanas' },
        { id: '64', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Língua Inglesa', teacher: 'Prof. João Paulo', room: 'Sala 02', category: 'linguagens' },
        { id: '65', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Química Experimental', teacher: 'Prof. Roberto Mendes', room: 'Lab. Ciências', category: 'natureza' },
        { id: '66', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Filosofia', teacher: 'Prof. Marcos Silva', room: 'Sala 02', category: 'humanas' },
        { id: '67', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Eletiva: Comunicação e Mídias', teacher: 'Profª. Francisca', room: 'Lab. Informática', category: 'diversificada' },
        { id: '68', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Clube de Protagonismo', teacher: 'Coord. Pedagógica', room: 'Auditório', category: 'diversificada' },
      ],
      quarta: [
        { id: '70', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Biologia', teacher: 'Profª. Juliana Rios', room: 'Sala 02', category: 'natureza' },
        { id: '71', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Matemática I', teacher: 'Prof. Carlos Eduardo', room: 'Sala 02', category: 'matematica' },
        { id: '72', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Matemática I', teacher: 'Prof. Carlos Eduardo', room: 'Sala 02', category: 'matematica' },
        { id: '73', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'Redação & Expressão', teacher: 'Profª. Francisca', room: 'Sala 02', category: 'linguagens' },
        { id: '74', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Artes', teacher: 'Profª. Mariana Lima', room: 'Sala 02', category: 'linguagens' },
        { id: '75', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'História', teacher: 'Prof. Marcos Silva', room: 'Sala 02', category: 'humanas' },
        { id: '76', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Física', teacher: 'Prof. Daniel Rocha', room: 'Sala 02', category: 'natureza' },
        { id: '77', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Iniciação Científica', teacher: 'Prof. Roberto Mendes', room: 'Biblioteca', category: 'diversificada' },
        { id: '78', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Estudo Orientado I', teacher: 'Prof. Carlos Eduardo', room: 'Sala 02', category: 'diversificada' },
      ],
      quinta: [
        { id: '80', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Geografia', teacher: 'Profª. Luciana Mendes', room: 'Sala 02', category: 'humanas' },
        { id: '81', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Sociologia', teacher: 'Prof. Marcos Silva', room: 'Sala 02', category: 'humanas' },
        { id: '82', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Química', teacher: 'Prof. Roberto Mendes', room: 'Sala 02', category: 'natureza' },
        { id: '83', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'Física', teacher: 'Prof. Daniel Rocha', room: 'Sala 02', category: 'natureza' },
        { id: '84', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Língua Portuguesa', teacher: 'Profª. Francisca', room: 'Sala 02', category: 'linguagens' },
        { id: '85', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Língua Inglesa', teacher: 'Prof. João Paulo', room: 'Sala 02', category: 'linguagens' },
        { id: '86', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Educação Financeira', teacher: 'Prof. Carlos Eduardo', room: 'Sala 02', category: 'matematica' },
        { id: '87', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Projeto de Vida', teacher: 'Profª. Aline Costa', room: 'Sala 02', category: 'diversificada' },
        { id: '88', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Nivelamento de Aprendizagem', teacher: 'Equipe Pedagógica', room: 'Sala 02', category: 'diversificada' },
      ],
      sexta: [
        { id: '90', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Biologia', teacher: 'Profª. Juliana Rios', room: 'Sala 02', category: 'natureza' },
        { id: '91', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Literatura Brasileira', teacher: 'Profª. Francisca', room: 'Sala 02', category: 'linguagens' },
        { id: '92', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Matemática I', teacher: 'Prof. Carlos Eduardo', room: 'Sala 02', category: 'matematica' },
        { id: '93', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'Matemática I', teacher: 'Prof. Carlos Eduardo', room: 'Sala 02', category: 'matematica' },
        { id: '94', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Educação Física', teacher: 'Prof. Rodrigo Matos', room: 'Quadra', category: 'linguagens' },
        { id: '95', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Oficina de Redação Nota 1000', teacher: 'Profª. Francisca', room: 'Sala 02', category: 'linguagens' },
        { id: '96', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Práticas Digitais & Informática', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '97', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Tutoria Coletiva', teacher: 'Profª. Aline Costa', room: 'Sala 02', category: 'diversificada' },
        { id: '98', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Assembleia Estudantil', teacher: 'Coordenação', room: 'Pátio', category: 'diversificada' },
      ],
    },
  },
  {
    id: '2a',
    name: '2ª Série A - Aprofundamento Natureza & Matemática',
    shortName: '2ª Série A',
    grade: '2º Ano EM',
    shift: 'Tempo Integral (07:00 às 17:00)',
    roomNumber: 'Sala 03 - Bloco Didático',
    advisorTeacher: 'Prof. Roberto Mendes (Química)',
    schedule: {
      segunda: [
        { id: '101', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Física Aplicada', teacher: 'Prof. Daniel Rocha', room: 'Sala 03', category: 'natureza' },
        { id: '102', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Física Aplicada', teacher: 'Prof. Daniel Rocha', room: 'Sala 03', category: 'natureza' },
        { id: '103', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Matemática II', teacher: 'Prof. Carlos Eduardo', room: 'Sala 03', category: 'matematica' },
        { id: '104', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'Química Orgânica', teacher: 'Prof. Roberto Mendes', room: 'Lab. Ciências', category: 'natureza' },
        { id: '105', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Língua Portuguesa', teacher: 'Profª. Francisca', room: 'Sala 03', category: 'linguagens' },
        { id: '106', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Genética & Biologia Celular', teacher: 'Profª. Juliana Rios', room: 'Lab. Ciências', category: 'natureza' },
        { id: '107', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'História Contemporânea', teacher: 'Prof. Marcos Silva', room: 'Sala 03', category: 'humanas' },
        { id: '108', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Projeto de Vida II', teacher: 'Profª. Aline Costa', room: 'Sala 03', category: 'diversificada' },
        { id: '109', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Estudo Orientado II', teacher: 'Prof. Roberto Mendes', room: 'Sala 03', category: 'diversificada' },
      ],
      terca: [
        { id: '110', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Matemática II', teacher: 'Prof. Carlos Eduardo', room: 'Sala 03', category: 'matematica' },
        { id: '111', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Matemática II', teacher: 'Prof. Carlos Eduardo', room: 'Sala 03', category: 'matematica' },
        { id: '112', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Língua Inglesa', teacher: 'Prof. João Paulo', room: 'Sala 03', category: 'linguagens' },
        { id: '113', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'Geopolítica', teacher: 'Profª. Luciana Mendes', room: 'Sala 03', category: 'humanas' },
        { id: '114', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Língua Portuguesa', teacher: 'Profª. Francisca', room: 'Sala 03', category: 'linguagens' },
        { id: '115', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Itinerário: Bioquímica Aplicada', teacher: 'Prof. Roberto Mendes', room: 'Lab. Ciências', category: 'natureza' },
        { id: '116', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Itinerário: Bioquímica Aplicada', teacher: 'Prof. Roberto Mendes', room: 'Lab. Ciências', category: 'natureza' },
        { id: '117', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Educação Física', teacher: 'Prof. Rodrigo Matos', room: 'Quadra', category: 'linguagens' },
        { id: '118', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Oficina de Resolução de Problemas', teacher: 'Prof. Carlos Eduardo', room: 'Sala 03', category: 'matematica' },
      ],
      quarta: [
        { id: '120', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Química Orgânica', teacher: 'Prof. Roberto Mendes', room: 'Sala 03', category: 'natureza' },
        { id: '121', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Química Orgânica', teacher: 'Prof. Roberto Mendes', room: 'Sala 03', category: 'natureza' },
        { id: '122', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Biologia', teacher: 'Profª. Juliana Rios', room: 'Sala 03', category: 'natureza' },
        { id: '123', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'Redação para o ENEM', teacher: 'Profª. Francisca', room: 'Sala 03', category: 'linguagens' },
        { id: '124', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Sociologia', teacher: 'Prof. Marcos Silva', room: 'Sala 03', category: 'humanas' },
        { id: '125', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Itinerário: Física Moderna & Astronomia', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'natureza' },
        { id: '126', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Filosofia da Ciência', teacher: 'Prof. Marcos Silva', room: 'Sala 03', category: 'humanas' },
        { id: '127', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Eletiva: Robótica Experimental', teacher: 'Prof. Daniel Rocha', room: 'Lab. Robótica', category: 'diversificada' },
        { id: '128', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Estudo Orientado II', teacher: 'Profª. Juliana Rios', room: 'Biblioteca', category: 'diversificada' },
      ],
      quinta: [
        { id: '130', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Língua Portuguesa', teacher: 'Profª. Francisca', room: 'Sala 03', category: 'linguagens' },
        { id: '131', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Literatura', teacher: 'Profª. Francisca', room: 'Sala 03', category: 'linguagens' },
        { id: '132', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Física', teacher: 'Prof. Daniel Rocha', room: 'Sala 03', category: 'natureza' },
        { id: '133', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'Matemática II', teacher: 'Prof. Carlos Eduardo', room: 'Sala 03', category: 'matematica' },
        { id: '134', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'História', teacher: 'Prof. Marcos Silva', room: 'Sala 03', category: 'humanas' },
        { id: '135', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Geografia do Piauí e Brasil', teacher: 'Profª. Luciana Mendes', room: 'Sala 03', category: 'humanas' },
        { id: '136', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Estatística Aplicada', teacher: 'Prof. Carlos Eduardo', room: 'Lab. Informática', category: 'matematica' },
        { id: '137', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Projeto Científico Integrado', teacher: 'Profª. Juliana Rios', room: 'Lab. Ciências', category: 'diversificada' },
        { id: '138', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Tutoria & Metas Individuais', teacher: 'Prof. Roberto Mendes', room: 'Sala 03', category: 'diversificada' },
      ],
      sexta: [
        { id: '140', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Matemática II', teacher: 'Prof. Carlos Eduardo', room: 'Sala 03', category: 'matematica' },
        { id: '141', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Matemática II', teacher: 'Prof. Carlos Eduardo', room: 'Sala 03', category: 'matematica' },
        { id: '142', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Biologia', teacher: 'Profª. Juliana Rios', room: 'Lab. Ciências', category: 'natureza' },
        { id: '143', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'Educação Física', teacher: 'Prof. Rodrigo Matos', room: 'Quadra', category: 'linguagens' },
        { id: '144', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Língua Inglesa', teacher: 'Prof. João Paulo', room: 'Sala 03', category: 'linguagens' },
        { id: '145', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Laboratório de Redação Nota 1000', teacher: 'Profª. Francisca', room: 'Sala 03', category: 'linguagens' },
        { id: '146', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Simulado de Ciências da Natureza', teacher: 'Prof. Roberto / Prof. Daniel', room: 'Sala 03', category: 'natureza' },
        { id: '147', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Análise de Desempenho e Gabarito', teacher: 'Equipe Pedagógica', room: 'Sala 03', category: 'diversificada' },
        { id: '148', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Acolhimento de Encerramento', teacher: 'Coordenação', room: 'Pátio', category: 'diversificada' },
      ],
    },
  },
  {
    id: '3a',
    name: '3ª Série A - Téc. em Desenvolvimento de Sistemas',
    shortName: '3ª Série A (Téc. Desenv. Sistemas)',
    grade: '3º Ano EM · Curso Técnico em Desenvolvimento de Sistemas',
    shift: 'Tempo Integral (07:00 às 17:00)',
    roomNumber: 'Sala 05 - Lab. de Informática & TI',
    advisorTeacher: 'Prof. Daniel Rocha (Informática & Sistemas)',
    schedule: {
      segunda: [
        { id: '201', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Redação Nota 1000 - ENEM', teacher: 'Profª. Francisca', room: 'Sala 05', category: 'linguagens' },
        { id: '202', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Redação Nota 1000 - ENEM', teacher: 'Profª. Francisca', room: 'Sala 05', category: 'linguagens' },
        { id: '203', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Matemática e Suas Tecnologias', teacher: 'Prof. Carlos Eduardo', room: 'Sala 05', category: 'matematica' },
        { id: '204', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'Matemática e Suas Tecnologias', teacher: 'Prof. Carlos Eduardo', room: 'Sala 05', category: 'matematica' },
        { id: '205', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Física Aplicada à Computação', teacher: 'Prof. Daniel Rocha', room: 'Sala 05', category: 'natureza' },
        { id: '206', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Téc: Lógica de Programação & Algoritmos', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '207', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Téc: Lógica de Programação & Algoritmos', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '208', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Projeto de Vida & Mercado de TI', teacher: 'Profª. Aline Costa', room: 'Sala 05', category: 'diversificada' },
        { id: '209', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Estudo Orientado III - Plantão de Dúvidas', teacher: 'Equipe de Exatas', room: 'Biblioteca', category: 'diversificada' },
      ],
      terca: [
        { id: '210', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'História Contemporânea & Mundo do Trabalho', teacher: 'Prof. Marcos Silva', room: 'Sala 05', category: 'humanas' },
        { id: '211', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Geopolítica e Globalização Digital', teacher: 'Profª. Luciana Mendes', room: 'Sala 05', category: 'humanas' },
        { id: '212', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Língua Portuguesa & Interpretação Textual', teacher: 'Profª. Francisca', room: 'Sala 05', category: 'linguagens' },
        { id: '213', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'Inglês Técnico Instrumental', teacher: 'Prof. João Paulo', room: 'Lab. Idiomas', category: 'linguagens' },
        { id: '214', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Filosofia & Ética na Tecnologia', teacher: 'Prof. Marcos Silva', room: 'Sala 05', category: 'humanas' },
        { id: '215', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Téc: Banco de Dados & Modelagem SQL', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '216', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Téc: Banco de Dados & Modelagem SQL', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '217', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Educação Física & Ergonomia no Trabalho', teacher: 'Prof. Rodrigo Matos', room: 'Quadra', category: 'linguagens' },
        { id: '218', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Clube de Robótica & Programação Avançada', teacher: 'Coordenação de TI', room: 'Lab. Informática', category: 'diversificada' },
      ],
      quarta: [
        { id: '220', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Biologia & Sustentabilidade Tecnológica', teacher: 'Profª. Juliana Rios', room: 'Sala 05', category: 'natureza' },
        { id: '221', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Química Aplicada aos Materiais', teacher: 'Prof. Roberto Mendes', room: 'Lab. Ciências', category: 'natureza' },
        { id: '222', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Téc: Desenvolvimento Web (HTML/CSS/JS)', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '223', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'Téc: Desenvolvimento Web (HTML/CSS/JS)', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '224', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Literatura Brasileira e Artes', teacher: 'Profª. Francisca', room: 'Sala 05', category: 'linguagens' },
        { id: '225', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Laboratório de Redação Nota 1000', teacher: 'Profª. Francisca', room: 'Sala 05', category: 'linguagens' },
        { id: '226', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Laboratório de Redação Nota 1000', teacher: 'Profª. Francisca', room: 'Sala 05', category: 'linguagens' },
        { id: '227', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Oficina SiSU, Prouni e Carreiras Tecnológicas', teacher: 'Profª. Aline Costa', room: 'Lab. Informática', category: 'diversificada' },
        { id: '228', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Estudo Orientado III - Plantão de Humanas & TI', teacher: 'Prof. Marcos Silva', room: 'Biblioteca', category: 'diversificada' },
      ],
      quinta: [
        { id: '230', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Téc: Engenharia de Software & Metodologias Ágeis', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '231', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Téc: Engenharia de Software & Metodologias Ágeis', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '232', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Matemática Discreta & Álgebra Linear', teacher: 'Prof. Carlos Eduardo', room: 'Sala 05', category: 'matematica' },
        { id: '233', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'História Geral & Revoluções Industriais', teacher: 'Prof. Marcos Silva', room: 'Sala 05', category: 'humanas' },
        { id: '234', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Geografia do Piauí & Polos Tecnológicos', teacher: 'Profª. Luciana Mendes', room: 'Sala 05', category: 'humanas' },
        { id: '235', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Téc: Redes de Computadores & Cibersegurança', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '236', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Téc: Redes de Computadores & Cibersegurança', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '237', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Mentoria Vocacional e Portfólio no GitHub', teacher: 'Profª. Aline Costa', room: 'Lab. Informática', category: 'diversificada' },
        { id: '238', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Simulado Rápido de Questões ENEM (TRI)', teacher: 'Equipe de Professores', room: 'Sala 05', category: 'diversificada' },
      ],
      sexta: [
        { id: '240', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Simulado Geral Oficial - Bloco 1 (Linguagens/Humanas)', teacher: 'Banca Docente CETI', room: 'Sala 05', category: 'diversificada' },
        { id: '241', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Simulado Geral Oficial - Bloco 1 (Linguagens/Humanas)', teacher: 'Banca Docente CETI', room: 'Sala 05', category: 'diversificada' },
        { id: '242', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Simulado Geral Oficial - Bloco 1 (Linguagens/Humanas)', teacher: 'Banca Docente CETI', room: 'Sala 05', category: 'diversificada' },
        { id: '243', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'Téc: Projeto Integrador de Sistemas (TCC)', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '244', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Téc: Projeto Integrador de Sistemas (TCC)', teacher: 'Prof. Daniel Rocha', room: 'Lab. Informática', category: 'diversificada' },
        { id: '245', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Correção Comentada do Simulado ENEM', teacher: 'Profª. Francisca & Prof. Carlos', room: 'Sala 05', category: 'linguagens' },
        { id: '246', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Correção de Exatas e Natureza', teacher: 'Prof. Daniel & Prof. Roberto', room: 'Sala 05', category: 'natureza' },
        { id: '247', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Educação Física & Descompressão Esportiva', teacher: 'Prof. Rodrigo Matos', room: 'Quadra', category: 'linguagens' },
        { id: '248', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Feedbacks de Metas & Planejamento Semanal', teacher: 'Coordenação e Direção', room: 'Sala 05', category: 'diversificada' },
      ],
    },
  },
  {
    id: '3b',
    name: '3ª Série B - Téc. em Controle Ambiental',
    shortName: '3ª Série B (Téc. Controle Ambiental)',
    grade: '3º Ano EM · Curso Técnico em Controle Ambiental',
    shift: 'Tempo Integral (07:00 às 17:00)',
    roomNumber: 'Sala 06 - Lab. de Meio Ambiente & Ciências',
    advisorTeacher: 'Profª. Juliana Rios (Ciências & Gestão Ambiental)',
    schedule: {
      segunda: [
        { id: '301', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Redação Nota 1000 - ENEM', teacher: 'Profª. Francisca', room: 'Sala 06', category: 'linguagens' },
        { id: '302', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Redação Nota 1000 - ENEM', teacher: 'Profª. Francisca', room: 'Sala 06', category: 'linguagens' },
        { id: '303', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Matemática e Suas Tecnologias', teacher: 'Prof. Carlos Eduardo', room: 'Sala 06', category: 'matematica' },
        { id: '304', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'Matemática e Suas Tecnologias', teacher: 'Prof. Carlos Eduardo', room: 'Sala 06', category: 'matematica' },
        { id: '305', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Biologia Celular e Ecossistemas', teacher: 'Profª. Juliana Rios', room: 'Sala 06', category: 'natureza' },
        { id: '306', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Téc: Monitoramento da Qualidade das Águas e Efluentes', teacher: 'Profª. Juliana Rios', room: 'Lab. Meio Ambiente', category: 'diversificada' },
        { id: '307', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Téc: Monitoramento da Qualidade das Águas e Efluentes', teacher: 'Profª. Juliana Rios', room: 'Lab. Meio Ambiente', category: 'diversificada' },
        { id: '308', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Projeto de Vida & Carreiras Ambientais', teacher: 'Profª. Aline Costa', room: 'Sala 06', category: 'diversificada' },
        { id: '309', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Estudo Orientado III - Plantão de Dúvidas', teacher: 'Equipe Docente', room: 'Biblioteca', category: 'diversificada' },
      ],
      terca: [
        { id: '310', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'História do Brasil & Questões Agrárias', teacher: 'Prof. Marcos Silva', room: 'Sala 06', category: 'humanas' },
        { id: '311', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Geografia do Semiárido & Climatologia Piauiense', teacher: 'Profª. Luciana Mendes', room: 'Sala 06', category: 'humanas' },
        { id: '312', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Língua Portuguesa & Produção Textual', teacher: 'Profª. Francisca', room: 'Sala 06', category: 'linguagens' },
        { id: '313', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'Língua Inglesa Técnica para Sustentabilidade', teacher: 'Prof. João Paulo', room: 'Lab. Idiomas', category: 'linguagens' },
        { id: '314', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Filosofia, Bioética e Meio Ambiente', teacher: 'Prof. Marcos Silva', room: 'Sala 06', category: 'humanas' },
        { id: '315', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Téc: Gestão e Tratamento de Resíduos Sólidos', teacher: 'Prof. Roberto Mendes', room: 'Lab. Ciências', category: 'diversificada' },
        { id: '316', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Téc: Gestão e Tratamento de Resíduos Sólidos', teacher: 'Prof. Roberto Mendes', room: 'Lab. Ciências', category: 'diversificada' },
        { id: '317', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Educação Física & Saúde Comunitária', teacher: 'Prof. Rodrigo Matos', room: 'Quadra', category: 'linguagens' },
        { id: '318', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Clube de Meio Ambiente & Horta Escolar Sustentável', teacher: 'Coordenação de Meio Ambiente', room: 'Área Externa / Pátio Verde', category: 'diversificada' },
      ],
      quarta: [
        { id: '320', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Téc: Química e Microbiologia Ambiental', teacher: 'Prof. Roberto Mendes', room: 'Lab. Ciências', category: 'diversificada' },
        { id: '321', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Téc: Química e Microbiologia Ambiental', teacher: 'Prof. Roberto Mendes', room: 'Lab. Ciências', category: 'diversificada' },
        { id: '322', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Física Térmica & Energias Renováveis (Solar/Eólica)', teacher: 'Prof. Daniel Rocha', room: 'Sala 06', category: 'natureza' },
        { id: '323', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'Física Térmica & Energias Renováveis (Solar/Eólica)', teacher: 'Prof. Daniel Rocha', room: 'Sala 06', category: 'natureza' },
        { id: '324', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Literatura Brasileira e Paisagens Naturais', teacher: 'Profª. Francisca', room: 'Sala 06', category: 'linguagens' },
        { id: '325', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Laboratório de Redação: Temas Socioambientais ENEM', teacher: 'Profª. Francisca', room: 'Sala 06', category: 'linguagens' },
        { id: '326', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Laboratório de Redação: Temas Socioambientais ENEM', teacher: 'Profª. Francisca', room: 'Sala 06', category: 'linguagens' },
        { id: '327', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Oficina de Carreiras em Engenharia Ambiental & Biologia', teacher: 'Profª. Aline Costa', room: 'Lab. Informática', category: 'diversificada' },
        { id: '328', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Estudo Orientado III - Plantão de Ciências da Natureza', teacher: 'Profª. Juliana Rios', room: 'Biblioteca', category: 'diversificada' },
      ],
      quinta: [
        { id: '330', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Téc: Legislação, Normas ISO & Licenciamento Ambiental', teacher: 'Profª. Juliana Rios', room: 'Sala 06', category: 'diversificada' },
        { id: '331', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Téc: Legislação, Normas ISO & Licenciamento Ambiental', teacher: 'Profª. Juliana Rios', room: 'Sala 06', category: 'diversificada' },
        { id: '332', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Matemática Financeira e Estatística Amostral', teacher: 'Prof. Carlos Eduardo', room: 'Sala 06', category: 'matematica' },
        { id: '333', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'Sociologia e Impactos da Degradação Ambiental', teacher: 'Prof. Marcos Silva', room: 'Sala 06', category: 'humanas' },
        { id: '334', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Téc: Recuperação de Áreas Degradadas e Bacias Hidrográficas', teacher: 'Profª. Juliana Rios', room: 'Lab. Meio Ambiente', category: 'diversificada' },
        { id: '335', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Téc: Recuperação de Áreas Degradadas e Bacias Hidrográficas', teacher: 'Profª. Juliana Rios', room: 'Lab. Meio Ambiente', category: 'diversificada' },
        { id: '336', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Cartografia Digital & Sensoriamento Remoto', teacher: 'Profª. Luciana Mendes', room: 'Lab. Informática', category: 'humanas' },
        { id: '337', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Mentoria Vocacional e Projetos de Extensão Comunitária', teacher: 'Profª. Aline Costa', room: 'Sala 06', category: 'diversificada' },
        { id: '338', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Simulado Rápido de Questões ENEM (Natureza & Exatas)', teacher: 'Equipe de Professores', room: 'Sala 06', category: 'diversificada' },
      ],
      sexta: [
        { id: '340', timeSlot: '07:30 - 08:20', slotNumber: 1, subject: 'Simulado Geral Oficial - Bloco 1 (Natureza/Matemática)', teacher: 'Banca Docente CETI', room: 'Sala 06', category: 'diversificada' },
        { id: '341', timeSlot: '08:20 - 09:10', slotNumber: 2, subject: 'Simulado Geral Oficial - Bloco 1 (Natureza/Matemática)', teacher: 'Banca Docente CETI', room: 'Sala 06', category: 'diversificada' },
        { id: '342', timeSlot: '09:10 - 10:00', slotNumber: 3, subject: 'Simulado Geral Oficial - Bloco 1 (Natureza/Matemática)', teacher: 'Banca Docente CETI', room: 'Sala 06', category: 'diversificada' },
        { id: '343', timeSlot: '10:20 - 11:10', slotNumber: 4, subject: 'Téc: Projeto Integrador de Controle Ambiental (TCC)', teacher: 'Profª. Juliana Rios', room: 'Lab. Meio Ambiente', category: 'diversificada' },
        { id: '344', timeSlot: '11:10 - 12:00', slotNumber: 5, subject: 'Téc: Projeto Integrador de Controle Ambiental (TCC)', teacher: 'Profª. Juliana Rios', room: 'Lab. Meio Ambiente', category: 'diversificada' },
        { id: '345', timeSlot: '13:20 - 14:10', slotNumber: 6, subject: 'Correção Comentada do Simulado ENEM', teacher: 'Profª. Juliana & Prof. Roberto', room: 'Sala 06', category: 'natureza' },
        { id: '346', timeSlot: '14:10 - 15:00', slotNumber: 7, subject: 'Correção de Linguagens e Redação', teacher: 'Profª. Francisca', room: 'Sala 06', category: 'linguagens' },
        { id: '347', timeSlot: '15:20 - 16:10', slotNumber: 8, subject: 'Educação Física & Descompressão', teacher: 'Prof. Rodrigo Matos', room: 'Quadra', category: 'linguagens' },
        { id: '348', timeSlot: '16:10 - 17:00', slotNumber: 9, subject: 'Feedbacks de Metas & Planejamento Semanal', teacher: 'Coordenação e Direção', room: 'Sala 06', category: 'diversificada' },
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
    name: 'Equipe de Coordenação do Tempo Integral',
    department: 'Coordenação de Ensino & Aprendizagem',
    contact: 'Atendimento via Secretaria',
    description: 'Acompanhamento do rendimento dos estudantes, planejamento de aulas dos professores, itinerários e projeto de vida.',
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
    description: 'Supervisão de 4 refeições diárias balanceadas (café da manhã, lanche matutino, almoço completo e lanche vespertino).',
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
    description: 'Planejamento dos professores, matrícula final e recepção calorosa dos estudantes com café da manhã e integração.',
    status: 'concluido',
  },
  {
    period: 'Fevereiro a Abril de 2026',
    title: '1º Bimestre Letivo & Diagnóstico de Aprendizagem',
    badge: '1º Bimestre',
    description: 'Avaliações diagnósticas, implantação das turmas do Tempo Integral, lançamento dos Clubes de Protagonismo e Plantão Pedagógico.',
    status: 'vigente',
  },
  {
    period: '13 a 17 de Abril de 2026',
    title: 'Semana de Avaliações Bimestrais e Recuperação Contínua',
    badge: 'Provas Bimestrais',
    description: 'Provas objetivas e discursivas, feedback das notas aos alunos e conselho de classe participativo.',
    status: 'proximo',
  },
  {
    period: 'Maio a Junho de 2026',
    title: '2º Bimestre: Feira Cultural & Circuito de Talentos',
    badge: '2º Bimestre',
    description: 'Mostra das tradições piauenses, literatura de cordel, festival junino escolar e 1º Simulado Preparatório ENEM.',
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
    title: '3º Bimestre: Jogos Interclasses e Jornada de Ciências & Robótica',
    badge: '3º Bimestre',
    description: 'Competições esportivas nas modalidades futsal, vôlei e atletismo, além de demonstração dos projetos de robótica e sustentabilidade.',
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
    title: 'Encerramento do Ano Letivo & Cerimônia de Formatura',
    badge: 'Formatura',
    description: 'Publicação dos resultados finais no sistema SEDUC, solenidade de formatura da 3ª Série e início do período de rematrícula.',
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
      'Calça comprida padrão e calçado fechado (tênis) para segurança física em laboratórios e escadarias.',
      'Uniforme de Educação Física permitido exclusivamente durante os dias e horários de atividades esportivas.',
    ],
  },
  {
    iconName: 'Clock',
    title: 'Horários & Pontualidade',
    highlight: 'Entrada às 07:00 com tolerância até 07:20',
    items: [
      'Os portões abrem às 06:45 para acolhimento e café da manhã dos estudantes do transporte.',
      'Atrasos eventuais devem ser comunicados previamente pelos responsáveis ou justificados na recepção.',
      'Saídas antecipadas são autorizadas estritamente com presença ou autorização expressa dos pais/responsáveis.',
    ],
  },
  {
    iconName: 'Smartphone',
    title: 'Uso Pedagógico de Celulares',
    highlight: 'Foco na aprendizagem e convivência saudável',
    items: [
      'Celulares devem permanecer guardados e em modo silencioso durante as explicações em sala.',
      'Permitido exclusivamente mediante orientação do professor para pesquisas em aula, quiz e uso pedagógico.',
      'Nos intervalos e almoço, o convívio comunitário, esportes e biblioteca são amplamente incentivados.',
    ],
  },
  {
    iconName: 'Utensils',
    title: 'Alimentação Escolar Completa',
    highlight: '4 refeições diárias de qualidade gratuita',
    items: [
      'Todos os estudantes têm direito ao cardápio balanceado elaborado por nutricionistas da SEDUC.',
      'É servido: Café da Manhã (07:00), Lanche da Manhã (10:00), Almoço Completo (12:00) e Lanche da Tarde (15:00).',
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
