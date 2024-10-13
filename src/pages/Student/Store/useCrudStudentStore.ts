import type IPromise from '@/interfaces/Axios/IPromise';
import type IForm from '@/pages/Student/Interfaces/IForm';
import type IList from '@/pages/Student/Interfaces/IList';
import { defineStore } from 'pinia';


export const useCrudStudentStore = defineStore('useCrudStudentStore', {
  state: () => ({
    loading: {
      form: false,
      table: false,
    },
    form: {
      id: null,
      company_id: null,
      type_education_id: null,
      grade_id: null,
      section_id: null,
      identity_document: null,
      full_name: null,
      pdf: null,
      photo: null,
    } as IForm,
    studentData: {} as IForm,
    students: [] as Array<IList>,
    totalData: 0 as number,
    totalPage: 0 as number,
    currentPage: 1 as number,
    lastPage: 0 as number,
    jobPositions: [] as Array<object>,
    typeEducations: [] as Array<object>,
    sections: [] as Array<object>,
  }),
  getters: {
  },
  actions: {
    clearForm() {
      this.form = <IForm>{
        id: null,
        company_id: null,
        type_education_id: null,
        grade_id: null,
        section_id: null,
        identity_document: null,
        full_name: null,
        pdf: null,
        photo: null,
      }
    },


    async fetchAll(filter: object): Promise<void> {
      this.loading.table = true
      const { data, response, error, isFetching } = await useApi("/student-list").post(filter)
      this.loading.table = false

      if (response.value?.ok && data.value) {
        this.students = data.value.students
        this.totalData = data.value.totalData
        this.totalPage = data.value.totalPage
        this.currentPage = data.value.currentPage
        this.lastPage = data.value.lastPage
      }
    },

    async fetchDataForm(id: number | undefined, action: string = "create"): Promise<void> {
      this.loading.form = true
      const url = id ? `/student-dataForm/${action}/${id}` : `/student-dataForm/${action}`
      const { data, response, error, isFetching } = await useApi(url).get()
      this.loading.form = false

      if (response.value?.ok && data.value) {
        this.jobPositions = data.value.jobPositions
        this.typeEducations = data.value.typeEducations
        this.sections = data.value.sections
      }
      if (response.value?.ok && data.value.form) {
        this.form = data.value.form
      }
    },


    async fetchSave(): Promise<IPromise> {

      const formData = new FormData()
      for (const key in this.form)
        formData.append(key, this.form[key])

      // this.loading.form = true
      const { data, response, error, isFetching } = await useApi("/student-create").post(formData)
      // this.loading.form = false

      if (response.value?.ok && data.value) {
        // this.form = data.value.data
      }

      return data.value
    },

    async fetchDelete(id: number): Promise<void> {
      this.loading.table = true
      const { isFetching } = await useApi("/student-delete/" + id).delete()
      this.loading.table = false
    },

    async changeState(obj: object): Promise<IPromise> {
      this.loading.table = true
      const { data, response, isFetching } = await useApi("/student-changeState").post(obj)
      this.loading.table = false

      if (response.value?.ok && data.value) {
        this.form = data.value.data
      }
      return data.value
    },

    async fetchResetPassword(id: number | string): Promise<IPromise> {
      this.loading.table = true
      const { data, response } = await useApi("/student-resetPassword/" + id).get()
      this.loading.table = false

      return data.value
    },

  },
})
