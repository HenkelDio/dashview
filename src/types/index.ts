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
    firstLogin: boolean
  }
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
  label: string;
  name: string;
  status: STATUS
}

export interface IDepartmentCreate {
  label: string;
  name: string;
}

export type STATUS = 'ACTIVE' | 'INACTIVE'

export interface Column {
  name: string;
  required?: boolean;
  label: string;
  align?: 'left' | 'center' | 'right';
  field: string;
  sortable?: boolean;
}

export interface IPerspective {
  id: string,
  name: string,
  descriptions: string[],
  createdBy: {document: string, name: string}
  createdOn: number,
  status: STATUS
}

export interface IPerspectiveCreate {
  name: string,
  descriptions: string[]
}

export interface IProcess {
  id: string,
  name: string,
  createdBy: {document: string, name: string}
  createdOn: number,
  status: STATUS
}

export interface IChart {
  id: string,
  title: string
  type: string
  perspective: string
  process: string
  department: string
  responsible: string
  periodicity: string
  objective: string
  formula: string
  labels: string[]
  year: string,
  createdBy: {document: string, name: string}
  createdOn: number,
  status: STATUS,
  chartData: IChartData[]
}

export interface IChartData {
  label: string
  data: number[]
  backgroundColor: string
}

export interface IChartCreate {
  title: string
  type: string
  perspective: string
  process: string
  department: string
  responsible: string
  periodicity: string
  objective: string
  formula: string
  labels: string[]
  chartData: IChartData[]
}

export interface IFilterCharts {
  department?: string,
  perspective?: string,
  process?: string,
  responsible?: string,
  year?: string
}
