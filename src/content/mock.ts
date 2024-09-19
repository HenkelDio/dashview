import { Indicator } from 'src/types';

export const indicators: Indicator[] = [
  {
    description: 'ÍNDICE DE TREINAMENTO',
    type: 'ESTRATÉGICO - PESSOAS E INFRAESTRUTURA',
    process: 'GESTÃO DE PESSOAS',
    perpective: 'PESSOAS E INFRAESTRUTURA',
    departament: 'GESTÃO DE PESSOAS',
    responsable: 'GRACIELI',
    objective: 'Mensurar o % do tempo produtivo investido em treinamento.',
    formula: 'Total de Horas de Treinamento / Total de Horas Previstas x100',
    periodicity: 'Mensal',
    label: 'Média',
    data: [1.69, 2.58, 10.87, 1.73, 1.41, 6.85, 3.14, 1.53, 1.69, 0, 0, 0, 0],
    backgroundColor: '#185EC1',
  },
  {
    description: 'ÍNDICE DE TURNOVER',
    type: 'ESTRATÉGICO - PESSOAS E INFRAESTRUTURA',
    process: 'GESTÃO DE PESSOAS',
    perpective: 'PESSOAS E INFRAESTRUTURA',
    departament: 'GESTÃO DE PESSOAS',
    responsable: 'GRACIELI',
    objective: 'Identificar % de rotatividade de pessoas',
    formula: '(admitidos + demitidos)/2 / (Efetivo Inicial + Efetivo Final)/2',
    periodicity: 'Mensal',
    label: 'Média',
    data: [
      14.78, 13.06, 22.34, 8.93, 7.22, 14.43, 19.24, 1.53, 1.69, 0, 0, 0, 0,
    ],
    backgroundColor: '#3C096C',
  },
  {
    description: 'NÚMERO DE PACIENTES CIRÚRGICOS ATENDIDOS MÊS',
    type: 'ESTRATÉGICO - FINANCEIRA',
    process: 'FATURAMENTO',
    perpective: 'PESSOAS E INFRAESTRUTURA',
    departament: 'FINANCEIRA',
    responsable: 'ERICO',
    objective:
      'Mensurar a quantidade de pacientes atendidos no centro cirúrgico por mês',
    formula: 'NÚMERO TOTAL DE PACIENTES ATENDIDOS/ MÊS',
    periodicity: 'Mensal',
    label: 'Pacientes',
    data: [426, 506, 598, 664, 706, 615, 731, 675, 0, 0, 0, 0, 0],
    backgroundColor: '#9D4EDD',
  },
];
