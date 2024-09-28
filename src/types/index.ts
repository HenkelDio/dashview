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
}

export interface IUserTable {
  name: string;
  email: string;
  document: string;
  departments: string;
  role: string;
}

export interface IDepartment {
  label: string;
  name: string;
}
