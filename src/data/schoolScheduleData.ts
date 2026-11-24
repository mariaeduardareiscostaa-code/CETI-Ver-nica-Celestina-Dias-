export interface ClassScheduleItem {
  id: string;
  slotNumber: number;
  timeSlot: string;
  subject: string;
  teacher: string;
  room: string;
  category: 'linguagens' | 'matematica' | 'natureza' | 'humanas' | 'diversificada';
}

export interface SchoolClass {
  id: string;
  name: string;
  shortName: string;
  advisorTeacher: string;
  roomNumber: string;
  shift: string;
  schedule: Record<string, ClassScheduleItem[]>;
}

export interface DailyRoutineItem {
  time: string;
  title: string;
  description: string;
  type: 'acolhimento' | 'aula' | 'refeicao' | 'encerramento';
}

export interface SchoolRuleGuide {
  highlight: string;
  title: string;
  items: string[];
}

export interface SchoolStaffMember {
  role: string;
  name: string;
  department: string;
  description: string;
  contact?: string;
}

const SLOT_TIMES: Record<number, string> = {
  1: '07:30 - 08:30',
  2: '08:30 - 09:30',
  3: '09:50 - 10:50',
  4: '10:50 - 11:50',
  5: '12:50 - 13:50',
  6: '13:50 - 14:50',
  7: '15:10 - 16:10',
  8: '16:10 - 17:10',
};

function makeDaySchedule(
  classId: string,
  dayKey: string,
  defaultRoom: string,
  entries: [number, string, string, ClassScheduleItem['category'], string?][]
): ClassScheduleItem[] {
  return entries.map(([slotNumber, subject, teacher, category, customRoom]) => ({
    id: `${classId}-${dayKey}-${slotNumber}`,
    slotNumber,
    timeSlot: SLOT_TIMES[slotNumber] || '',
    subject,
    teacher,
    room: customRoom || defaultRoom,
    category,
  }));
}

export const SCHOOL_CLASSES: SchoolClass[] = [
  {
    id: '1a',
    name: '1º Ano A · Téc. Administração-A',
    shortName: '1º Ano A (Adm)',
    advisorTeacher: 'Profª. Iolanda',
    roomNumber: 'Sala 01',
    shift: 'Tempo Integral (07:30 às 17:10)',
    schedule: {
      segunda: makeDaySchedule('1a', 'segunda', 'Sala 01', [
        [1, 'Inglês', 'Elayne', 'linguagens'],
        [2, 'I.A', 'Djalma', 'diversificada'],
        [3, 'Português', 'Naiara', 'linguagens'],
        [4, 'Português', 'Naiara', 'linguagens'],
        [5, 'Biologia', 'Dhones', 'natureza'],
        [6, 'Eco. Mer.', 'Iolanda', 'diversificada'],
        [7, 'Ética', 'Iolanda', 'diversificada'],
        [8, 'Matemática', 'Edite', 'matematica'],
      ]),
      terca: makeDaySchedule('1a', 'terca', 'Sala 01', [
        [1, 'Com. Emp.', 'Iolanda', 'diversificada'],
        [2, 'Física', 'Valdivino', 'natureza'],
        [3, 'Química', 'Avelar', 'natureza'],
        [4, 'Física', 'Valdivino', 'natureza'],
        [5, 'Biologia', 'Dhones', 'natureza'],
        [6, 'Matemática', 'Edite', 'matematica'],
        [7, 'Ed. Financeira', 'Iolanda', 'diversificada'],
        [8, 'Com. Emp.', 'Iolanda', 'diversificada'],
      ]),
      quarta: makeDaySchedule('1a', 'quarta', 'Sala 01', [
        [1, 'Per. Apro. Rec. Apre. Matem.', 'Edite', 'matematica'],
        [2, 'História', 'Lília', 'humanas'],
        [3, 'Arte', 'Lília', 'linguagens'],
        [4, 'Inglês', 'Elayne', 'linguagens'],
        [5, 'E. Cul. Club', 'Betânia', 'diversificada'],
        [6, 'Fund. Gest. P', 'Iolanda', 'diversificada'],
        [7, 'Fund. Gest. P', 'Iolanda', 'diversificada'],
        [8, 'Eco. Mer.', 'Iolanda', 'diversificada'],
      ]),
      quinta: makeDaySchedule('1a', 'quinta', 'Sala 01', [
        [1, 'Química', 'Avelar', 'natureza'],
        [2, 'Matemática', 'Edite', 'matematica'],
        [3, 'Sociologia', 'Clarisvaldo', 'humanas'],
        [4, 'Geografia', 'Valdenir', 'humanas'],
        [5, 'Projeto de Vida', 'Ricardo', 'diversificada'],
        [6, 'TE. INF', 'Iolanda', 'diversificada', 'Lab. Informática'],
        [7, 'Fund. Adm.', 'Iolanda', 'diversificada'],
        [8, 'Fund. Adm.', 'Iolanda', 'diversificada'],
      ]),
      sexta: makeDaySchedule('1a', 'sexta', 'Sala 01', [
        [1, 'L. P. Rec. Apr.', 'Naiara', 'linguagens'],
        [2, 'Leit. Int. TXT', 'Naiara', 'linguagens'],
        [3, 'Ed. Física', 'Sileide', 'linguagens', 'Quadra / Pátio'],
        [4, 'Geografia', 'Valdenir', 'humanas'],
        [5, 'Esp. Cul. Club', 'Betânia', 'diversificada'],
        [6, 'História', 'Lília', 'humanas'],
        [7, 'Filosofia', 'Lília', 'humanas'],
        [8, 'Espanhol', 'Elayne', 'linguagens'],
      ]),
    },
  },
  {
    id: '1b',
    name: '1º Ano B · Téc. Administração-B',
    shortName: '1º Ano B (Adm)',
    advisorTeacher: 'Ricardo (Específica)',
    roomNumber: 'Sala 02',
    shift: 'Tempo Integral (07:30 às 17:10)',
    schedule: {
      segunda: makeDaySchedule('1b', 'segunda', 'Sala 02', [
        [1, 'Português', 'Naiara', 'linguagens'],
        [2, 'Inglês', 'Elayne', 'linguagens'],
        [3, 'Biologia', 'Dhones', 'natureza'],
        [4, 'Per.Apr.Rec.Apre.Matemo', 'Edite', 'matematica'],
        [5, 'Filosofia', 'Lília', 'humanas'],
        [6, 'Matemática', 'Edite', 'matematica'],
        [7, 'Biologia', 'Dhones', 'natureza'],
        [8, 'Educação Financeira', 'Iolanda', 'diversificada'],
      ]),
      terca: makeDaySchedule('1b', 'terca', 'Sala 02', [
        [1, 'Português', 'Naiara', 'linguagens'],
        [2, 'Leit.Pro.Txt', 'Naiara', 'linguagens'],
        [3, 'L.A', 'Djalma', 'diversificada'],
        [4, 'Fund.Gest.P', 'Ricardo', 'diversificada'],
        [5, 'Matemática', 'Edite', 'matematica'],
        [6, 'Fund.Gest.P', 'Ricardo', 'diversificada'],
        [7, 'Ed. Física', 'Sileide', 'linguagens', 'Quadra / Pátio'],
        [8, 'Química', 'Avelar', 'natureza'],
      ]),
      quarta: makeDaySchedule('1b', 'quarta', 'Sala 02', [
        [1, 'História', 'Lília', 'humanas'],
        [2, 'Fund.Adm', 'Ricardo', 'diversificada'],
        [3, 'Fund.Adm', 'Ricardo', 'diversificada'],
        [4, 'História', 'Lília', 'humanas'],
        [5, 'Ep.Cul.Club 1', 'Lília', 'diversificada'],
        [6, 'Ep.Cul.Club 2', 'Ricardo', 'diversificada'],
        [7, 'Arte', 'Lília', 'linguagens'],
        [8, 'Ec.Merc', 'Ricardo', 'diversificada'],
      ]),
      quinta: makeDaySchedule('1b', 'quinta', 'Sala 02', [
        [1, 'Sociologia', 'Clarisvaldo', 'humanas'],
        [2, 'Projeto de Vida', 'Ricardo', 'diversificada'],
        [3, 'Tec.Inf', 'Ricardo', 'diversificada', 'Lab. Informática'],
        [4, 'Inglês', 'Elayne', 'linguagens'],
        [5, 'Geografia', 'Valdenir', 'humanas'],
        [6, 'Geografia', 'Valdenir', 'humanas'],
        [7, 'Matemática', 'Edite', 'matematica'],
        [8, 'Física', 'Valdivino', 'natureza'],
      ]),
      sexta: makeDaySchedule('1b', 'sexta', 'Sala 02', [
        [1, 'Química', 'Avelar', 'natureza'],
        [2, 'Ética Profissional', 'Ricardo', 'diversificada'],
        [3, 'L.Port.R.Ap', 'Naiara', 'linguagens'],
        [4, 'Espanhol', 'Elayne', 'linguagens'],
        [5, 'Esporte Club Let', 'Lília', 'diversificada'],
        [6, 'Com.Emp', 'Ricardo', 'diversificada'],
        [7, 'Física', 'Valdivino', 'natureza'],
        [8, 'Com.Emp', 'Ricardo', 'diversificada'],
      ]),
    },
  },
  {
    id: '2a',
    name: '2º Ano A · Téc. Administração',
    shortName: '2º Ano A (Adm)',
    advisorTeacher: 'Profª. Naiara',
    roomNumber: 'Sala 03',
    shift: 'Tempo Integral (07:30 às 17:10)',
    schedule: {
      segunda: makeDaySchedule('2a', 'segunda', 'Sala 03', [
        [1, 'Português', 'Naiara', 'linguagens'],
        [2, 'Português', 'Naiara', 'linguagens'],
        [3, 'Matemática', 'Edite', 'matematica'],
        [4, 'Matemática', 'Edite', 'matematica'],
        [5, 'História', 'Lília', 'humanas'],
        [6, 'Geografia', 'Valdenir', 'humanas'],
        [7, 'Gestão Financeira', 'Iolanda', 'diversificada'],
        [8, 'Gestão Financeira', 'Iolanda', 'diversificada'],
      ]),
      terca: makeDaySchedule('2a', 'terca', 'Sala 03', [
        [1, 'Biologia', 'Dhones', 'natureza'],
        [2, 'Química', 'Avelar', 'natureza'],
        [3, 'Física', 'Valdivino', 'natureza'],
        [4, 'Inglês', 'Elayne', 'linguagens'],
        [5, 'Empreendedorismo', 'Ricardo', 'diversificada'],
        [6, 'Empreendedorismo', 'Ricardo', 'diversificada'],
        [7, 'Sociologia', 'Clarisvaldo', 'humanas'],
        [8, 'Filosofia', 'Lília', 'humanas'],
      ]),
      quarta: makeDaySchedule('2a', 'quarta', 'Sala 03', [
        [1, 'Matemática', 'Edite', 'matematica'],
        [2, 'Física', 'Valdivino', 'natureza'],
        [3, 'Português', 'Naiara', 'linguagens'],
        [4, 'Redação ENEM', 'Naiara', 'linguagens'],
        [5, 'Contabilidade Básica', 'Iolanda', 'diversificada'],
        [6, 'Contabilidade Básica', 'Iolanda', 'diversificada'],
        [7, 'Arte', 'Lília', 'linguagens'],
        [8, 'Projeto de Vida', 'Ricardo', 'diversificada'],
      ]),
      quinta: makeDaySchedule('2a', 'quinta', 'Sala 03', [
        [1, 'Geografia', 'Valdenir', 'humanas'],
        [2, 'História', 'Lília', 'humanas'],
        [3, 'Biologia', 'Dhones', 'natureza'],
        [4, 'Química', 'Avelar', 'natureza'],
        [5, 'Recursos Humanos', 'Ricardo', 'diversificada'],
        [6, 'Recursos Humanos', 'Ricardo', 'diversificada'],
        [7, 'Espanhol', 'Elayne', 'linguagens'],
        [8, 'Estudo Orientado', 'Naiara', 'diversificada'],
      ]),
      sexta: makeDaySchedule('2a', 'sexta', 'Sala 03', [
        [1, 'Ed. Física', 'Sileide', 'linguagens', 'Quadra / Pátio'],
        [2, 'Inglês', 'Elayne', 'linguagens'],
        [3, 'Logística Empresarial', 'Iolanda', 'diversificada'],
        [4, 'Logística Empresarial', 'Iolanda', 'diversificada'],
        [5, 'Clube Juvenil', 'Betânia', 'diversificada'],
        [6, 'Matemática', 'Edite', 'matematica'],
        [7, 'Química', 'Avelar', 'natureza'],
        [8, 'Tutoria Escolar', 'Naiara', 'diversificada'],
      ]),
    },
  },
  {
    id: '3a',
    name: '3º Ano A · Téc. Desenvolvimento de Sistemas',
    shortName: '3º Ano A (DS)',
    advisorTeacher: 'Prof. Djalma',
    roomNumber: 'Lab. Informática / Sala 04',
    shift: 'Tempo Integral (07:30 às 17:10)',
    schedule: {
      segunda: makeDaySchedule('3a', 'segunda', 'Sala 04', [
        [1, 'Português & Redação', 'Naiara', 'linguagens'],
        [2, 'Português & Redação', 'Naiara', 'linguagens'],
        [3, 'Matemática ENEM', 'Edite', 'matematica'],
        [4, 'Matemática ENEM', 'Edite', 'matematica'],
        [5, 'Programação Web', 'Djalma', 'diversificada', 'Lab. Informática'],
        [6, 'Programação Web', 'Djalma', 'diversificada', 'Lab. Informática'],
        [7, 'Banco de Dados', 'Djalma', 'diversificada', 'Lab. Informática'],
        [8, 'Banco de Dados', 'Djalma', 'diversificada', 'Lab. Informática'],
      ]),
      terca: makeDaySchedule('3a', 'terca', 'Sala 04', [
        [1, 'Física', 'Valdivino', 'natureza'],
        [2, 'Química', 'Avelar', 'natureza'],
        [3, 'Biologia', 'Dhones', 'natureza'],
        [4, 'Inglês Técnico', 'Elayne', 'linguagens'],
        [5, 'Engenharia de Software', 'Djalma', 'diversificada', 'Lab. Informática'],
        [6, 'Engenharia de Software', 'Djalma', 'diversificada', 'Lab. Informática'],
        [7, 'História', 'Lília', 'humanas'],
        [8, 'Geografia', 'Valdenir', 'humanas'],
      ]),
      quarta: makeDaySchedule('3a', 'quarta', 'Sala 04', [
        [1, 'Matemática', 'Edite', 'matematica'],
        [2, 'Português', 'Naiara', 'linguagens'],
        [3, 'Sociologia', 'Clarisvaldo', 'humanas'],
        [4, 'Filosofia', 'Lília', 'humanas'],
        [5, 'Desenv. Mobile / TCC', 'Djalma', 'diversificada', 'Lab. Informática'],
        [6, 'Desenv. Mobile / TCC', 'Djalma', 'diversificada', 'Lab. Informática'],
        [7, 'Física', 'Valdivino', 'natureza'],
        [8, 'Projeto de Vida', 'Ricardo', 'diversificada'],
      ]),
      quinta: makeDaySchedule('3a', 'quinta', 'Sala 04', [
        [1, 'Biologia', 'Dhones', 'natureza'],
        [2, 'Química', 'Avelar', 'natureza'],
        [3, 'História', 'Lília', 'humanas'],
        [4, 'Geografia', 'Valdenir', 'humanas'],
        [5, 'Redes & Segurança', 'Djalma', 'diversificada', 'Lab. Informática'],
        [6, 'Redes & Segurança', 'Djalma', 'diversificada', 'Lab. Informática'],
        [7, 'Espanhol', 'Elayne', 'linguagens'],
        [8, 'Revisão ENEM', 'Edite', 'matematica'],
      ]),
      sexta: makeDaySchedule('3a', 'sexta', 'Sala 04', [
        [1, 'Ed. Física', 'Sileide', 'linguagens', 'Quadra / Pátio'],
        [2, 'Arte', 'Lília', 'linguagens'],
        [3, 'Projeto Integrador (TCC)', 'Djalma', 'diversificada', 'Lab. Informática'],
        [4, 'Projeto Integrador (TCC)', 'Djalma', 'diversificada', 'Lab. Informática'],
        [5, 'Redação Nota 1000', 'Naiara', 'linguagens'],
        [6, 'Matemática', 'Edite', 'matematica'],
        [7, 'Clube Juvenil', 'Betânia', 'diversificada'],
        [8, 'Tutoria & Orientação', 'Djalma', 'diversificada'],
      ]),
    },
  },
  {
    id: '3b',
    name: '3º Ano B · Téc. Controle Ambiental',
    shortName: '3º Ano B (Amb)',
    advisorTeacher: 'Prof. Dhones',
    roomNumber: 'Sala 05',
    shift: 'Tempo Integral (07:30 às 17:10)',
    schedule: {
      segunda: makeDaySchedule('3b', 'segunda', 'Sala 05', [
        [1, 'Biologia Ambiental', 'Dhones', 'natureza'],
        [2, 'Biologia Ambiental', 'Dhones', 'natureza'],
        [3, 'Química Analítica', 'Avelar', 'natureza'],
        [4, 'Português & Redação', 'Naiara', 'linguagens'],
        [5, 'Matemática ENEM', 'Edite', 'matematica'],
        [6, 'Matemática ENEM', 'Edite', 'matematica'],
        [7, 'Gestão de Resíduos', 'Dhones', 'diversificada'],
        [8, 'Gestão de Resíduos', 'Dhones', 'diversificada'],
      ]),
      terca: makeDaySchedule('3b', 'terca', 'Sala 05', [
        [1, 'Geografia Ambiental', 'Valdenir', 'humanas'],
        [2, 'História', 'Lília', 'humanas'],
        [3, 'Física', 'Valdivino', 'natureza'],
        [4, 'Português', 'Naiara', 'linguagens'],
        [5, 'Tratamento de Águas', 'Avelar', 'diversificada', 'Lab. Ciências'],
        [6, 'Tratamento de Águas', 'Avelar', 'diversificada', 'Lab. Ciências'],
        [7, 'Inglês', 'Elayne', 'linguagens'],
        [8, 'Projeto de Vida', 'Ricardo', 'diversificada'],
      ]),
      quarta: makeDaySchedule('3b', 'quarta', 'Sala 05', [
        [1, 'Química', 'Avelar', 'natureza'],
        [2, 'Biologia', 'Dhones', 'natureza'],
        [3, 'Matemática', 'Edite', 'matematica'],
        [4, 'Sociologia', 'Clarisvaldo', 'humanas'],
        [5, 'Monitoramento Ambiental', 'Dhones', 'diversificada'],
        [6, 'Monitoramento Ambiental', 'Dhones', 'diversificada'],
        [7, 'Filosofia', 'Lília', 'humanas'],
        [8, 'Arte', 'Lília', 'linguagens'],
      ]),
      quinta: makeDaySchedule('3b', 'quinta', 'Sala 05', [
        [1, 'Português', 'Naiara', 'linguagens'],
        [2, 'Redação ENEM', 'Naiara', 'linguagens'],
        [3, 'Física', 'Valdivino', 'natureza'],
        [4, 'Espanhol', 'Elayne', 'linguagens'],
        [5, 'Legislação Ambiental', 'Valdenir', 'diversificada'],
        [6, 'Legislação Ambiental', 'Valdenir', 'diversificada'],
        [7, 'Geografia', 'Valdenir', 'humanas'],
        [8, 'História', 'Lília', 'humanas'],
      ]),
      sexta: makeDaySchedule('3b', 'sexta', 'Sala 05', [
        [1, 'Ed. Física', 'Sileide', 'linguagens', 'Quadra / Pátio'],
        [2, 'Matemática', 'Edite', 'matematica'],
        [3, 'Educação Ambiental (TCC)', 'Dhones', 'diversificada'],
        [4, 'Educação Ambiental (TCC)', 'Dhones', 'diversificada'],
        [5, 'Clube Juvenil', 'Betânia', 'diversificada'],
        [6, 'Revisão ENEM Natureza', 'Dhones', 'natureza'],
        [7, 'Revisão ENEM Humanas', 'Clarisvaldo', 'humanas'],
        [8, 'Tutoria & Orientação', 'Dhones', 'diversificada'],
      ]),
    },
  },
];

export const DAILY_ROUTINE: DailyRoutineItem[] = [
  {
    time: '07:15 - 07:30',
    title: 'Abertura dos Portões & Acolhimento',
    description:
      'Recepção dos estudantes pela equipe gestora e tutores no pátio principal com conferência de fardamento.',
    type: 'acolhimento',
  },
  {
    time: '07:30 - 09:30',
    title: '1ª e 2ª Aulas (Bloco Matutino I)',
    description:
      'Desenvolvimento dos componentes da Base Nacional Comum Curricular e disciplinas técnicas.',
    type: 'aula',
  },
  {
    time: '09:30 - 09:50',
    title: 'Intervalo & Lanche da Manhã',
    description:
      'Alimentação escolar balanceada servida no refeitório climatizado e momento de convivência no pátio.',
    type: 'refeicao',
  },
  {
    time: '09:50 - 11:50',
    title: '3ª e 4ª Aulas (Bloco Matutino II)',
    description: 'Aulas regulares, práticas em laboratório e recomposição da aprendizagem.',
    type: 'aula',
  },
  {
    time: '11:50 - 12:50',
    title: 'Almoço Escolar & Descanso Orientado',
    description:
      'Refeição completa e gratuita preparada na escola, seguida de descanso, leitura na biblioteca ou jogos educativos.',
    type: 'refeicao',
  },
  {
    time: '12:50 - 14:50',
    title: '5ª e 6ª Aulas (Bloco Vespertino I)',
    description:
      'Itinerários formativos, Eletivas, Projeto de Vida, Clubes Juvenis e formação técnica integrada.',
    type: 'aula',
  },
  {
    time: '14:50 - 15:10',
    title: 'Intervalo & Lanche da Tarde',
    description: 'Pausa para hidratação, lanche nutritivo da tarde e organização dos materiais.',
    type: 'refeicao',
  },
  {
    time: '15:10 - 17:10',
    title: '7ª e 8ª Aulas (Bloco Vespertino II)',
    description:
      'Conclusão das atividades pedagógicas, tutoria, estudo orientado e práticas esportivas.',
    type: 'aula',
  },
  {
    time: '17:10',
    title: 'Encerramento & Transporte Escolar',
    description:
      'Saída organizada dos alunos e embarque nas rotas do transporte escolar estadual e municipal.',
    type: 'encerramento',
  },
];

export const SCHOOL_RULES_GUIDE: SchoolRuleGuide[] = [
  {
    highlight: 'Assiduidade & Horário',
    title: 'Pontualidade e Frequência',
    items: [
      'A entrada ocorre até as 07:30, com abertura dos portões às 07:15.',
      'A frequência mínima exigida por lei é de 75% do total da carga horária letiva.',
      'Saídas antecipadas só são autorizadas mediante solicitação presencial ou contato confirmado do responsável.',
    ],
  },
  {
    highlight: 'Identificação',
    title: 'Uso do Fardamento Escolar',
    items: [
      'O uso da farda completa da rede estadual (SEDUC-PI) e calçado adequado é obrigatório diariamente.',
      'Nas aulas práticas de Educação Física e laboratórios, seguir a vestimenta orientada pelo docente.',
      'Manter o crachá ou identificação estudantil acessível para entrada e uso da biblioteca.',
    ],
  },
  {
    highlight: 'Cultura de Paz',
    title: 'Convivência & Uso de Celulares',
    items: [
      'Respeitar colegas, professores, servidores e o patrimônio escolar em todos os ambientes.',
      'O uso de aparelhos celulares em sala é permitido apenas quando solicitado pelo professor para fins pedagógicos.',
      'Qualquer situação de bullying ou discriminação deve ser comunicada imediatamente pelo Canal Oficial ou à coordenação.',
    ],
  },
];

export const SCHOOL_STAFF: SchoolStaffMember[] = [
  {
    role: 'Direção Escolar',
    name: 'Gestão Geral CETI VCD',
    department: 'Diretoria Administrativa & Pedagógica',
    description:
      'Responsável pela administração geral da unidade escolar, articulação com a SEDUC-PI, GRE e atendimento às famílias.',
    contact: '(89) 99410-7024',
  },
  {
    role: 'Coordenação Pedagógica',
    name: 'Equipe de Coordenação Integral',
    department: 'Acompanhamento Curricular & ENEM',
    description:
      'Organiza a grade horária, planos de aula, simulados preparatórios para o ENEM, tutoria estudantil e plantões pedagógicos.',
  },
  {
    role: 'Coordenação Técnica',
    name: 'Cursos Técnicos Integrados',
    department: 'Administração · Desenv. Sistemas · Controle Ambiental',
    description:
      'Supervisiona projetos integradores, estágios, laboratórios de informática/ciências e oficinas profissionalizantes.',
  },
  {
    role: 'Secretaria Escolar',
    name: 'Atendimento ao Aluno e Família',
    department: 'Matrículas, Históricos & Declarações',
    description:
      'Emissão de declarações escolares, transferências, atualização cadastral e suporte presencial das 08:00 às 16:00.',
    contact: 'Seg–Sex · 08h às 16h',
  },
];

export const COMMON_TEACHERS: string[] = [
  'Naiara',
  'Edite',
  'Dhones',
  'Ricardo',
  'Iolanda',
  'Elayne',
  'Lília',
  'Avelar',
  'Valdivino',
  'Valdenir',
  'Clarisvaldo',
  'Djalma',
  'Sileide',
  'Betânia',
];

export const COMMON_ROOMS: string[] = [
  'Sala 01',
  'Sala 02',
  'Sala 03',
  'Sala 04',
  'Sala 05',
  'Lab. Informática',
  'Lab. Ciências',
  'Quadra / Pátio',
  'Biblioteca',
];

const SCHEDULE_STORAGE_KEY = 'vcd_school_classes_v2';

export function getStoredSchoolClasses(): SchoolClass[] {
  try {
    const stored = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Erro ao ler grade de horários salva:', e);
  }
  return SCHOOL_CLASSES;
}

export function saveStoredSchoolClasses(classes: SchoolClass[]): void {
  try {
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(classes));
  } catch (e) {
    console.error('Erro ao salvar grade de horários:', e);
  }
}

export function resetStoredSchoolClasses(): SchoolClass[] {
  try {
    localStorage.removeItem(SCHEDULE_STORAGE_KEY);
  } catch {
    // ignore
  }
  return SCHOOL_CLASSES;
}
