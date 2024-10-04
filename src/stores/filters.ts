import { defineStore } from 'pinia';

export const useFilterStore = defineStore('filters', {
  state: () => ({
    typeModel: '',
    processModel: '',
    departmentModel: '',
    responsibleModel: '',
    yearModel: '',
  }),
  actions: {
    setTypeModel(value: string) {
      this.typeModel = value;
    },
    setProcessModel(value: string) {
      this.processModel = value;
    },
    setDepartmentModel(value: string) {
      this.departmentModel = value;
    },
    setResponsibleModel(value: string) {
      this.responsibleModel = value;
    },
    setYearModel(value: string) {
      this.yearModel = value;
    },
  },
});
