export interface Indicator {
  description: string;
  type: string;
  process: string;
  perpective: string;
  departament: string;
  responsable: string;
  objective: string;
  formula: string;
  periodicity: string;
  label: string;
  data: number[];
  backgroundColor: string;
}

export interface User {
  name: string;
  email: string;
  document: string;
  departments: IDepartment[];
  role: string;
  token?: string;
  status?: string;
  permissions: {
    firstLogin: boolean;
  };
}

export interface IUserTable {
  name: string;
  email: string;
  document: string;
  departments: string;
  role: string;
  status?: string;
}

export interface IDepartment {
  id: string;
  label: string;
  name: string;
  status: STATUS;
  emailManager: string;
}

export interface IDepartmentCreate {
  id?: string;
  label: string;
  name: string;
  emailManager: string;
}

export type STATUS = 'ACTIVE' | 'INACTIVE';

export interface Column {
  name: string;
  required?: boolean;
  label: string;
  align?: 'left' | 'center' | 'right';
  field: string;
  sortable?: boolean;
}

export interface IPerspective {
  id: string;
  name: string;
  descriptions: string[];
  createdBy: { document: string; name: string };
  createdOn: number;
  status: STATUS;
}

export interface IPerspectiveCreate {
  name: string;
  descriptions: string[];
}

export interface IProcess {
  id: string;
  name: string;
  createdBy: { document: string; name: string };
  createdOn: number;
  status: STATUS;
}

export interface IChart {
  id: string;
  title: string;
  type: string;
  perspective: string;
  process: string;
  department: string;
  responsible: string;
  periodicity: string;
  objective: string;
  formula: string;
  labels: string[];
  year: string;
  createdBy: { document: string; name: string };
  createdOn: number;
  status: STATUS;
  chartData: IChartData[];
  mask: string;
}

export enum EMask {
  CURRENCY,
}

export interface IChartData {
  label: string;
  data: number[];
  backgroundColor: string;
}

export interface IChartCreate {
  title: string;
  type: string;
  perspective: string;
  process: string;
  department: string;
  responsible: string;
  periodicity: string;
  objective: string;
  formula: string;
  labels: string[];
  chartData: IChartData[];
}

export interface IFilterCharts {
  department?: string;
  perspective?: string;
  process?: string;
  responsible?: string;
  year?: string;
}

export interface INPS {
  sentDate: number;
  sentBy: string;
  patientNpsList: PatientNps[];
}

export interface INPSTable {
  sentDate: string;
  sentBy: string;
  patientNpsList: PatientNps[];
}

export interface PatientNps {
  name: string;
  email: string;
}

export interface IForm {
  questions: IQuestion[];
  status: string;
  parameters: IFormParameters;
}

export interface IFormParameters {
  feedbackRequest: boolean;
}

export interface IQuestion {
  index: string;
  title: string;
  inputType: string;
  options: string[];
  answer: string;
  observation: string;
  showObservation: boolean;
}

export interface IAnswer {
  feedbackReturn: boolean;
  timestamp: number;
  questions: IQuestion[];
  patientName: string;
  patientPhone: string;
  dateOfAdmission: number;
  answerType: string;
}

export interface IScoreDepartment {
  detractors: object;
  neutrals: object;
  promoters: object;
}

export interface IChartAnswer {
  type: string;
  question: string;
  dateOfAdmission: number | string;
  timestamp: number | string;
  patientName?: string;
}
