import type IPromise from '@/interfaces/Axios/IPromise';
import type IForm from '@/pages/Grade/Interfaces/IForm';
import type IList from '@/pages/Grade/Interfaces/IList';
import { defineStore } from 'pinia';


export const useCrudGradeStore = defineStore('useCrudGradeStore', {
  state: () => ({
    loading: {
      form: false,
      table: false,
    },
    form: {
      id: null,
      company_id: null,
      type_education_id: null,
      name: null,
      subjects: [],
    } as IForm,
    gradeData: {} as IForm,
    grades: [] as Array<IList>,
    totalData: 0 as number,
    totalPage: 0 as number,
    currentPage: 1 as number,
    lastPage: 0 as number,
    typeEducations: [] as Array<object>,
  }),
  getters: {
  },
  actions: {
    clearForm() {
      this.form = <IForm>{
        id: null,
        company_id: null,
        type_education_id: null,
        name: null,
        subjects: [],

      }
    },


    async fetchAll(filter: object): Promise<void> {
      this.loading.table = true
      const { data, response, error, isFetching } = await useApi("/grade-list").post(filter)
      this.loading.table = false

      if (response.value?.ok && data.value) {
        this.grades = data.value.grades
        this.totalData = data.value.totalData
        this.totalPage = data.value.totalPage
        this.currentPage = data.value.currentPage
        this.lastPage = data.value.lastPage
      }
    },

    async fetchDataForm(id: number | undefined, action: string = "create"): Promise<void> {
      this.loading.form = true
      const url = id ? `/grade-dataForm/${action}/${id}` : `/grade-dataForm/${action}`
      const { data, response, error, isFetching } = await useApi(url).get()
      this.loading.form = false

      if (response.value?.ok && data.value) {
        this.typeEducations = data.value.typeEducations
      }
      if (response.value?.ok && data.value.form) {
        this.form = data.value.form
      }
    },


    async fetchSave(): Promise<IPromise> {


      this.loading.form = true
      const { data, response, error, isFetching } = await useApi("/grade-create").post(this.form)
      this.loading.form = false

      if (response.value?.ok && data.value) {
        this.form = data.value.data
      }

      return data.value
    },

    async fetchDelete(id: number): Promise<void> {
      this.loading.table = true
      const { isFetching } = await useApi("/grade-delete/" + id).delete()
      this.loading.table = false
    },

    async changeState(obj: object): Promise<IPromise> {
      this.loading.table = true
      const { data, response, isFetching } = await useApi("/grade-changeState").post(obj)
      this.loading.table = false

      if (response.value?.ok && data.value) {
        this.form = data.value.data
      }
      return data.value
    },

  },
})
