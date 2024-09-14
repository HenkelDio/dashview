import { defineStore } from 'pinia'

export const useFilterStore = defineStore('filters', {
  state: () => ({
    typeModel: '',
    processModel: '',
    departmentModel: '',
    responsibleModel: '',
  }),
  actions: {
    setTypeModel(value: string) {
      this.typeModel = value
    },
    setProcessModel(value: string) {
      this.processModel = value
    },
    setDepartmentModel(value: string) {
      this.departmentModel = value
    },
    setResponsibleModel(value: string) {
      this.responsibleModel = value
    }
  }
})
