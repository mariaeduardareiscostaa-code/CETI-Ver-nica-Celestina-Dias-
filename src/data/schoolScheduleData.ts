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
        { id: '1a-seg-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'I.A', teacher: 'Prof. Djalma', room: 'Lab. Informática', category: 'diversificada' },
        { id: '1a-seg-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Português', teacher: 'Profª. Naiara', room: 'Sala 01', category: 'linguagens' },
        { id: '1a-seg-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Português', teacher: 'Profª. Naiara', room: 'Sala 01', category: 'linguagens' },
        { id: '1a-seg-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Biologia', teacher: 'Prof. Dhones', room: 'Sala 01', category: 'natureza' },
        { id: '1a-seg-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Eco. Mer.', teacher: 'Profª. Iolanda', room: 'Sala 01', category: 'diversificada' },
        { id: '1a-seg-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Ética', teacher: 'Profª. Iolanda', room: 'Sala 01', category: 'diversificada' },
        { id: '1a-seg-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Matemática', teacher: 'Profª. Edite', room: 'Sala 01', category: 'matematica' },
      ],
      terca: [
        { id: '1a-ter-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Com. Emp.', teacher: 'Profª. Iolanda', room: 'Sala 01', category: 'diversificada' },
        { id: '1a-ter-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Física', teacher: 'Prof. Valdivino', room: 'Sala 01', category: 'natureza' },
        { id: '1a-ter-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Química', teacher: 'Prof. Avelar', room: 'Sala 01', category: 'natureza' },
        { id: '1a-ter-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Física', teacher: 'Prof. Valdivino', room: 'Sala 01', category: 'natureza' },
        { id: '1a-ter-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Biologia', teacher: 'Prof. Dhones', room: 'Sala 01', category: 'natureza' },
        { id: '1a-ter-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Matemática', teacher: 'Profª. Edite', room: 'Sala 01', category: 'matematica' },
        { id: '1a-ter-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Ed. Financeira', teacher: 'Profª. Iolanda', room: 'Sala 01', category: 'diversificada' },
        { id: '1a-ter-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Com. Emp.', teacher: 'Profª. Iolanda', room: 'Sala 01', category: 'diversificada' },
      ],
      quarta: [
        { id: '1a-qua-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Per. Apro. Rec. Apre. Matem.', teacher: 'Profª. Edite', room: 'Sala 01', category: 'matematica' },
        { id: '1a-qua-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'História', teacher: 'Profª. Lília', room: 'Sala 01', category: 'humanas' },
        { id: '1a-qua-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Arte', teacher: 'Profª. Lília', room: 'Sala 01', category: 'linguagens' },
        { id: '1a-qua-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Inglês', teacher: 'Profª. Elayne', room: 'Sala 01', category: 'linguagens' },
        { id: '1a-qua-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'E. Cul. Club', teacher: 'Profª. Betânia', room: 'Sala 01', category: 'diversificada' },
        { id: '1a-qua-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Fund. Gest. P', teacher: 'Profª. Iolanda', room: 'Sala 01', category: 'diversificada' },
        { id: '1a-qua-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Fund. Gest. P', teacher: 'Profª. Iolanda', room: 'Sala 01', category: 'diversificada' },
        { id: '1a-qua-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Eco. Mer.', teacher: 'Profª. Iolanda', room: 'Sala 01', category: 'diversificada' },
      ],
      quinta: [
        { id: '1a-qui-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Química', teacher: 'Prof. Avelar', room: 'Sala 01', category: 'natureza' },
        { id: '1a-qui-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Matemática', teacher: 'Profª. Edite', room: 'Sala 01', category: 'matematica' },
        { id: '1a-qui-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Sociologia', teacher: 'Prof. Clarisvaldo', room: 'Sala 01', category: 'humanas' },
        { id: '1a-qui-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Geografia', teacher: 'Prof. Valdenir', room: 'Sala 01', category: 'humanas' },
        { id: '1a-qui-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Projeto de Vida', teacher: 'Prof. Ricardo', room: 'Sala 01', category: 'diversificada' },
        { id: '1a-qui-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'TE. INF', teacher: 'Profª. Iolanda', room: 'Lab. Informática', category: 'diversificada' },
        { id: '1a-qui-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Fund. Adm.', teacher: 'Profª. Iolanda', room: 'Sala 01', category: 'diversificada' },
        { id: '1a-qui-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Fund. Adm.', teacher: 'Profª. Iolanda', room: 'Sala 01', category: 'diversificada' },
      ],
      sexta: [
        { id: '1a-sex-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'L. P. Rec. Apr.', teacher: 'Profª. Naiara', room: 'Sala 01', category: 'linguagens' },
        { id: '1a-sex-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Leit. Int. TXT', teacher: 'Profª. Naiara', room: 'Sala 01', category: 'linguagens' },
        { id: '1a-sex-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Ed. Física', teacher: 'Profª. Sirleide', room: 'Quadra', category: 'linguagens' },
        { id: '1a-sex-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Geografia', teacher: 'Prof. Valdenir', room: 'Sala 01', category: 'humanas' },
        { id: '1a-sex-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Esp. Cul. Club', teacher: 'Profª. Betânia', room: 'Sala 01', category: 'diversificada' },
        { id: '1a-sex-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'História', teacher: 'Profª. Lília', room: 'Sala 01', category: 'humanas' },
        { id: '1a-sex-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Filosofia', teacher: 'Profª. Lília', room: 'Sala 01', category: 'humanas' },
        { id: '1a-sex-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Espanhol', teacher: 'Profª. Elayne', room: 'Sala 01', category: 'linguagens' },
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
    advisorTeacher: 'Prof. Ricardo (Específica)',
    schedule: {
      segunda: [
        { id: '1b-seg-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Português', teacher: 'Profª. Naiara', room: 'Sala 02', category: 'linguagens' },
        { id: '1b-seg-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Inglês', teacher: 'Profª. Elayne', room: 'Sala 02', category: 'linguagens' },
        { id: '1b-seg-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Biologia', teacher: 'Prof. Dhones', room: 'Sala 02', category: 'natureza' },
        { id: '1b-seg-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Per.Apr.Rec.Apre.Matemo', teacher: 'Profª. Edite', room: 'Sala 02', category: 'matematica' },
        { id: '1b-seg-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Filosofia', teacher: 'Profª. Lília', room: 'Sala 02', category: 'humanas' },
        { id: '1b-seg-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Matemática', teacher: 'Profª. Edite', room: 'Sala 02', category: 'matematica' },
        { id: '1b-seg-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Biologia', teacher: 'Prof. Dhones', room: 'Sala 02', category: 'natureza' },
        { id: '1b-seg-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Educação Financeira', teacher: 'Profª. Iolanda', room: 'Sala 02', category: 'diversificada' },
      ],
      terca: [
        { id: '1b-ter-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Português', teacher: 'Profª. Naiara', room: 'Sala 02', category: 'linguagens' },
        { id: '1b-ter-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Leit.Pro.Txt', teacher: 'Profª. Naiara', room: 'Sala 02', category: 'linguagens' },
        { id: '1b-ter-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'L.A', teacher: 'Prof. Djalma', room: 'Sala 02', category: 'diversificada' },
        { id: '1b-ter-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Fund.Gest.P', teacher: 'Prof. Ricardo', room: 'Sala 02', category: 'diversificada' },
        { id: '1b-ter-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Matemática', teacher: 'Profª. Edite', room: 'Sala 02', category: 'matematica' },
        { id: '1b-ter-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Fund.Gest.P', teacher: 'Prof. Ricardo', room: 'Sala 02', category: 'diversificada' },
        { id: '1b-ter-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Ed. Física', teacher: 'Profª. Sirleide', room: 'Quadra', category: 'linguagens' },
        { id: '1b-ter-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Química', teacher: 'Prof. Avelar', room: 'Sala 02', category: 'natureza' },
      ],
      quarta: [
        { id: '1b-qua-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'História', teacher: 'Profª. Lília', room: 'Sala 02', category: 'humanas' },
        { id: '1b-qua-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Fund.Adm', teacher: 'Prof. Ricardo', room: 'Sala 02', category: 'diversificada' },
        { id: '1b-qua-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Fund.Adm', teacher: 'Prof. Ricardo', room: 'Sala 02', category: 'diversificada' },
        { id: '1b-qua-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'História', teacher: 'Profª. Lília', room: 'Sala 02', category: 'humanas' },
        { id: '1b-qua-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Ep.Cul.Club 1', teacher: 'Profª. Lília', room: 'Sala 02', category: 'diversificada' },
        { id: '1b-qua-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Ep.Cul.Club 2', teacher: 'Prof. Ricardo', room: 'Sala 02', category: 'diversificada' },
        { id: '1b-qua-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Arte', teacher: 'Profª. Lília', room: 'Sala 02', category: 'linguagens' },
        { id: '1b-qua-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Ec.Merc', teacher: 'Prof. Ricardo', room: 'Sala 02', category: 'diversificada' },
      ],
      quinta: [
        { id: '1b-qui-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Sociologia', teacher: 'Prof. Clarisvaldo', room: 'Sala 02', category: 'humanas' },
        { id: '1b-qui-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Projeto de Vida', teacher: 'Prof. Ricardo', room: 'Sala 02', category: 'diversificada' },
        { id: '1b-qui-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Tec.Inf', teacher: 'Prof. Ricardo', room: 'Lab. Informática', category: 'diversificada' },
        { id: '1b-qui-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Inglês', teacher: 'Profª. Elayne', room: 'Sala 02', category: 'linguagens' },
        { id: '1b-qui-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Geografia', teacher: 'Prof. Valdenir', room: 'Sala 02', category: 'humanas' },
        { id: '1b-qui-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Geografia', teacher: 'Prof. Valdenir', room: 'Sala 02', category: 'humanas' },
        { id: '1b-qui-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Matemática', teacher: 'Profª. Edite', room: 'Sala 02', category: 'matematica' },
        { id: '1b-qui-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Física', teacher: 'Prof. Valdivino', room: 'Sala 02', category: 'natureza' },
      ],
      sexta: [
        { id: '1b-sex-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Química', teacher: 'Prof. Avelar', room: 'Sala 02', category: 'natureza' },
        { id: '1b-sex-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Ética Profissional', teacher: 'Prof. Ricardo', room: 'Sala 02', category: 'diversificada' },
        { id: '1b-sex-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'L.Port.R.Ap', teacher: 'Profª. Naiara', room: 'Sala 02', category: 'linguagens' },
        { id: '1b-sex-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Espanhol', teacher: 'Profª. Elayne', room: 'Sala 02', category: 'linguagens' },
        { id: '1b-sex-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Esporte Club Let', teacher: 'Profª. Lília', room: 'Sala 02', category: 'diversificada' },
        { id: '1b-sex-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Com.Emp', teacher: 'Prof. Ricardo', room: 'Sala 02', category: 'diversificada' },
        { id: '1b-sex-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Física', teacher: 'Prof. Valdivino', room: 'Sala 02', category: 'natureza' },
        { id: '1b-sex-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Com.Emp', teacher: 'Prof. Ricardo', room: 'Sala 02', category: 'diversificada' },
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
        { id: '2a-seg-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Biologia', teacher: 'Prof. Dhones', room: 'Sala 03', category: 'natureza' },
        { id: '2a-seg-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Português', teacher: 'Prof. Everaldo', room: 'Sala 03', category: 'linguagens' },
        { id: '2a-seg-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Inglês', teacher: 'Profª. Elayne', room: 'Sala 03', category: 'linguagens' },
        { id: '2a-seg-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Matemática', teacher: 'Prof. Djalma', room: 'Sala 03', category: 'matematica' },
        { id: '2a-seg-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Per.Apr.Ec.Rec.Mat', teacher: 'Profª. Edite', room: 'Sala 03', category: 'matematica' },
        { id: '2a-seg-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'L.A', teacher: 'Prof. Djalma', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-seg-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'História', teacher: 'Profª. Lília', room: 'Sala 03', category: 'humanas' },
        { id: '2a-seg-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Biologia', teacher: 'Prof. Dhones', room: 'Sala 03', category: 'natureza' },
      ],
      terca: [
        { id: '2a-ter-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Específica', teacher: 'Prof. Ricardo', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-ter-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Específica', teacher: 'Prof. Ricardo', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-ter-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Física', teacher: 'Prof. Valdivino', room: 'Sala 03', category: 'natureza' },
        { id: '2a-ter-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Percurso.Espanhol', teacher: 'Profª. Elayne', room: 'Sala 03', category: 'linguagens' },
        { id: '2a-ter-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Leit.Int.Pro.Tex', teacher: 'Prof. Everaldo', room: 'Sala 03', category: 'linguagens' },
        { id: '2a-ter-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Educação Financeira', teacher: 'Profª. Iolanda', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-ter-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Específica', teacher: 'Prof. Ricardo', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-ter-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Química', teacher: 'Prof. Avelar', room: 'Sala 03', category: 'natureza' },
      ],
      quarta: [
        { id: '2a-qua-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Específica', teacher: 'Prof. Ricardo', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-qua-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Português', teacher: 'Prof. Everaldo', room: 'Sala 03', category: 'linguagens' },
        { id: '2a-qua-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Matemática', teacher: 'Prof. Djalma', room: 'Sala 03', category: 'matematica' },
        { id: '2a-qua-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Projeto de Vida', teacher: 'Prof. Ricardo', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-qua-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Específica', teacher: 'Prof. Ricardo', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-qua-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Arte', teacher: 'Profª. Lília', room: 'Sala 03', category: 'linguagens' },
        { id: '2a-qua-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Educação Física', teacher: 'Profª. Sirleide', room: 'Quadra', category: 'linguagens' },
        { id: '2a-qua-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Per.Ap.In.Es.C.L.C.LL.EI', teacher: 'Profª. Betânia', room: 'Sala 03', category: 'diversificada' },
      ],
      quinta: [
        { id: '2a-qui-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Filosofia', teacher: 'Prof. Valdenir', room: 'Sala 03', category: 'humanas' },
        { id: '2a-qui-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Específica', teacher: 'Prof. Clarisvaldo', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-qui-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Per.Ap.Est.L.Inglesa', teacher: 'Profª. Elayne', room: 'Sala 03', category: 'linguagens' },
        { id: '2a-qui-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Específica', teacher: 'Prof. Ricardo', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-qui-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Per.Ap.Est.Mon', teacher: 'Profª. Betânia', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-qui-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Física', teacher: 'Prof. Valdivino', room: 'Sala 03', category: 'natureza' },
        { id: '2a-qui-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Inovação.Ger.', teacher: 'Prof. Ricardo', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-qui-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Per.Ap.Lp.Rec.Ap', teacher: 'Profª. Betânia', room: 'Sala 03', category: 'linguagens' },
      ],
      sexta: [
        { id: '2a-sex-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Específica', teacher: 'Prof. Ricardo', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-sex-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Geografia', teacher: 'Prof. Valdenir', room: 'Sala 03', category: 'humanas' },
        { id: '2a-sex-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Específica', teacher: 'Prof. Ricardo', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-sex-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Química', teacher: 'Prof. Avelar', room: 'Sala 03', category: 'natureza' },
        { id: '2a-sex-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Específica', teacher: 'Prof. Ricardo', room: 'Sala 03', category: 'diversificada' },
        { id: '2a-sex-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Matemática', teacher: 'Prof. Djalma', room: 'Sala 03', category: 'matematica' },
        { id: '2a-sex-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Per.Ap.Es.Cl.Lei', teacher: 'Profª. Betânia', room: 'Sala 03', category: 'linguagens' },
        { id: '2a-sex-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Per.Ap.Lp.Rec.Ap', teacher: 'Profª. Betânia', room: 'Sala 03', category: 'linguagens' },
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
    advisorTeacher: 'Prof. Djalma (Informática & Sistemas)',
    schedule: {
      segunda: [
        { id: '3a-seg-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Orientação', teacher: 'Prof. Djalma', room: 'Sala 05', category: 'diversificada' },
        { id: '3a-seg-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Per. Ap. C. Nat.', teacher: 'Prof. Dhones', room: 'Lab. Ciências', category: 'natureza' },
        { id: '3a-seg-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Português', teacher: 'Prof. Everaldo', room: 'Sala 05', category: 'linguagens' },
        { id: '3a-seg-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Biologia', teacher: 'Prof. Dhones', room: 'Sala 05', category: 'natureza' },
        { id: '3a-seg-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Inglês', teacher: 'Profª. Elaine', room: 'Sala 05', category: 'linguagens' },
        { id: '3a-seg-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Inglês', teacher: 'Profª. Elaine', room: 'Sala 05', category: 'linguagens' },
        { id: '3a-seg-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Proj. Int.', teacher: 'Prof. Djalma', room: 'Lab. Informática', category: 'diversificada' },
        { id: '3a-seg-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'História', teacher: 'Profª. Lilia', room: 'Sala 05', category: 'humanas' },
      ],
      terca: [
        { id: '3a-ter-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Ativ. Int. L.A.', teacher: 'Prof. Djalma', room: 'Sala 05', category: 'diversificada' },
        { id: '3a-ter-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Específica', teacher: 'Prof. Djalma', room: 'Lab. Informática', category: 'diversificada' },
        { id: '3a-ter-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Ativ. Int. Ed. Fís.', teacher: 'Profª. Sileide', room: 'Quadra', category: 'linguagens' },
        { id: '3a-ter-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Português', teacher: 'Prof. Everaldo', room: 'Sala 05', category: 'linguagens' },
        { id: '3a-ter-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Específica', teacher: 'Prof. Djalma', room: 'Lab. Informática', category: 'diversificada' },
        { id: '3a-ter-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Ed. Física', teacher: 'Profª. Sileide', room: 'Quadra', category: 'linguagens' },
        { id: '3a-ter-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Química', teacher: 'Prof. Avelar', room: 'Lab. Ciências', category: 'natureza' },
        { id: '3a-ter-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Per. Ap. Rec. Ap.', teacher: 'Prof. Everaldo', room: 'Sala 05', category: 'linguagens' },
      ],
      quarta: [
        { id: '3a-qua-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Português', teacher: 'Prof. Everaldo', room: 'Sala 05', category: 'linguagens' },
        { id: '3a-qua-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Matemática', teacher: 'Prof. Djalma', room: 'Sala 05', category: 'matematica' },
        { id: '3a-qua-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Per. Ap. Rec. Ap.', teacher: 'Prof. Everaldo', room: 'Sala 05', category: 'linguagens' },
        { id: '3a-qua-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Ativ. Int. Trânsito', teacher: 'Profª. Sileide', room: 'Sala 05', category: 'diversificada' },
        { id: '3a-qua-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Sociologia', teacher: 'Prof. Clarisvaldo', room: 'Sala 05', category: 'humanas' },
        { id: '3a-qua-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Arte', teacher: 'Profª. Sileide', room: 'Sala 05', category: 'linguagens' },
        { id: '3a-qua-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Ativ. Int. Est. Monit.', teacher: 'Profª. Betânia', room: 'Sala 05', category: 'diversificada' },
        { id: '3a-qua-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Específica', teacher: 'Prof. Djalma', room: 'Lab. Informática', category: 'diversificada' },
      ],
      quinta: [
        { id: '3a-qui-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Per. Ap. Rec. Mat.', teacher: 'Profª. Edite', room: 'Sala 05', category: 'matematica' },
        { id: '3a-qui-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Líng. Est. Espanhol', teacher: 'Profª. Elaine', room: 'Sala 05', category: 'linguagens' },
        { id: '3a-qui-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Filosofia', teacher: 'Prof. Valdenir', room: 'Sala 05', category: 'humanas' },
        { id: '3a-qui-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Química', teacher: 'Prof. Avelar', room: 'Lab. Ciências', category: 'natureza' },
        { id: '3a-qui-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Física', teacher: 'Prof. Valdivino', room: 'Sala 05', category: 'natureza' },
        { id: '3a-qui-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'At. Int. Ar. Cul.', teacher: 'Profª. Betânia', room: 'Sala 05', category: 'linguagens' },
        { id: '3a-qui-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Específica', teacher: 'Prof. Djalma', room: 'Lab. Informática', category: 'diversificada' },
        { id: '3a-qui-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Específica', teacher: 'Prof. Djalma', room: 'Lab. Informática', category: 'diversificada' },
      ],
      sexta: [
        { id: '3a-sex-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Geografia', teacher: 'Prof. Valdenir', room: 'Sala 05', category: 'humanas' },
        { id: '3a-sex-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Ativ. Int. Trânsito', teacher: 'Profª. Sileide', room: 'Sala 05', category: 'diversificada' },
        { id: '3a-sex-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Matemática', teacher: 'Prof. Djalma', room: 'Sala 05', category: 'matematica' },
        { id: '3a-sex-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Específica', teacher: 'Prof. Djalma', room: 'Lab. Informática', category: 'diversificada' },
        { id: '3a-sex-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Matemática', teacher: 'Prof. Djalma', room: 'Sala 05', category: 'matematica' },
        { id: '3a-sex-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Física', teacher: 'Prof. Valdivino', room: 'Sala 05', category: 'natureza' },
        { id: '3a-sex-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'TES', teacher: 'Prof. Djalma', room: 'Lab. Informática', category: 'diversificada' },
        { id: '3a-sex-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Proj. Int.', teacher: 'Prof. Djalma', room: 'Lab. Informática', category: 'diversificada' },
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
    advisorTeacher: 'Prof. Clarisvaldo (Téc. Controle Ambiental)',
    schedule: {
      segunda: [
        { id: '3b-seg-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Português', teacher: 'Prof. Everaldo', room: 'Sala 06', category: 'linguagens' },
        { id: '3b-seg-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Específica', teacher: 'Prof. Clarisvaldo', room: 'Sala 06', category: 'diversificada' },
        { id: '3b-seg-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Ativ. IA', teacher: 'Prof. Djalma', room: 'Lab. Informática', category: 'diversificada' },
        { id: '3b-seg-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Português', teacher: 'Prof. Everaldo', room: 'Sala 06', category: 'linguagens' },
        { id: '3b-seg-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Matemática', teacher: 'Prof. Djalma', room: 'Sala 06', category: 'matematica' },
        { id: '3b-seg-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'História', teacher: 'Profª. Lilia', room: 'Sala 06', category: 'humanas' },
        { id: '3b-seg-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Líng. Est. Inglês', teacher: 'Profª. Elaine', room: 'Sala 06', category: 'linguagens' },
        { id: '3b-seg-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Líng. Est. Inglês', teacher: 'Profª. Elaine', room: 'Sala 06', category: 'linguagens' },
      ],
      terca: [
        { id: '3b-ter-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Física', teacher: 'Prof. Valdivino', room: 'Sala 06', category: 'natureza' },
        { id: '3b-ter-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Ativ. Int. Trânsito', teacher: 'Profª. Sileide', room: 'Sala 06', category: 'diversificada' },
        { id: '3b-ter-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Português', teacher: 'Prof. Everaldo', room: 'Sala 06', category: 'linguagens' },
        { id: '3b-ter-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Esporte Ed.', teacher: 'Profª. Sileide', room: 'Quadra', category: 'linguagens' },
        { id: '3b-ter-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Química', teacher: 'Prof. Avelar', room: 'Lab. Ciências', category: 'natureza' },
        { id: '3b-ter-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Biologia', teacher: 'Prof. Dhones', room: 'Sala 06', category: 'natureza' },
        { id: '3b-ter-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Per. Ap. Rec. Ap.', teacher: 'Prof. Everaldo', room: 'Sala 06', category: 'linguagens' },
        { id: '3b-ter-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Per. Ap. C. Nat.', teacher: 'Prof. Dhones', room: 'Lab. Ciências', category: 'natureza' },
      ],
      quarta: [
        { id: '3b-qua-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Específica', teacher: 'Prof. Clarisvaldo', room: 'Sala 06', category: 'diversificada' },
        { id: '3b-qua-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Específica', teacher: 'Prof. Clarisvaldo', room: 'Sala 06', category: 'diversificada' },
        { id: '3b-qua-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Ativ. Int. Trânsito', teacher: 'Profª. Sileide', room: 'Sala 06', category: 'diversificada' },
        { id: '3b-qua-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Per. Ap. Rec. Ap.', teacher: 'Prof. Everaldo', room: 'Sala 06', category: 'linguagens' },
        { id: '3b-qua-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Líng. Est. Espanhol', teacher: 'Profª. Elaine', room: 'Sala 06', category: 'linguagens' },
        { id: '3b-qua-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'At. Int. Monit. H. Estud.', teacher: 'Profª. Betânia', room: 'Sala 06', category: 'diversificada' },
        { id: '3b-qua-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Específica', teacher: 'Prof. Clarisvaldo', room: 'Sala 06', category: 'diversificada' },
        { id: '3b-qua-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Específica', teacher: 'Prof. Clarisvaldo', room: 'Sala 06', category: 'diversificada' },
      ],
      quinta: [
        { id: '3b-qui-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Matemática', teacher: 'Prof. Djalma', room: 'Sala 06', category: 'matematica' },
        { id: '3b-qui-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Geografia', teacher: 'Prof. Valdenir', room: 'Sala 06', category: 'humanas' },
        { id: '3b-qui-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Química', teacher: 'Prof. Avelar', room: 'Lab. Ciências', category: 'natureza' },
        { id: '3b-qui-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Per. Ap. Rec. Mat.', teacher: 'Profª. Edite', room: 'Sala 06', category: 'matematica' },
        { id: '3b-qui-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Arte', teacher: 'Profª. Lilia', room: 'Sala 06', category: 'linguagens' },
        { id: '3b-qui-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Matemática', teacher: 'Prof. Djalma', room: 'Sala 06', category: 'matematica' },
        { id: '3b-qui-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'At. Int. Cult. em Arte', teacher: 'Profª. Betânia', room: 'Sala 06', category: 'linguagens' },
        { id: '3b-qui-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Específica', teacher: 'Prof. Clarisvaldo', room: 'Sala 06', category: 'diversificada' },
      ],
      sexta: [
        { id: '3b-sex-1', timeSlot: '07:30 - 08:30', slotNumber: 1, subject: 'Sociologia', teacher: 'Prof. Clarisvaldo', room: 'Sala 06', category: 'humanas' },
        { id: '3b-sex-2', timeSlot: '08:30 - 09:30', slotNumber: 2, subject: 'Específica', teacher: 'Prof. Clarisvaldo', room: 'Sala 06', category: 'diversificada' },
        { id: '3b-sex-3', timeSlot: '09:50 - 10:50', slotNumber: 3, subject: 'Filosofia', teacher: 'Prof. Valdenir', room: 'Sala 06', category: 'humanas' },
        { id: '3b-sex-4', timeSlot: '10:50 - 11:50', slotNumber: 4, subject: 'Ed. Física', teacher: 'Profª. Sileide', room: 'Quadra', category: 'linguagens' },
        { id: '3b-sex-5', timeSlot: '12:50 - 13:50', slotNumber: 5, subject: 'Específica', teacher: 'Prof. Clarisvaldo', room: 'Sala 06', category: 'diversificada' },
        { id: '3b-sex-6', timeSlot: '13:50 - 14:50', slotNumber: 6, subject: 'Específica', teacher: 'Prof. Clarisvaldo', room: 'Sala 06', category: 'diversificada' },
        { id: '3b-sex-7', timeSlot: '15:10 - 16:10', slotNumber: 7, subject: 'Específica', teacher: 'Prof. Clarisvaldo', room: 'Sala 06', category: 'diversificada' },
        { id: '3b-sex-8', timeSlot: '16:10 - 17:10', slotNumber: 8, subject: 'Física', teacher: 'Prof. Valdivino', room: 'Sala 06', category: 'natureza' },
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
