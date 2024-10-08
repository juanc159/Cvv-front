import type IPromise from '@/interfaces/Axios/IPromise';
import type IForm from '@/pages/Teacher/Interfaces/IForm';
import type IList from '@/pages/Teacher/Interfaces/IList';
import { defineStore } from 'pinia';


export const useCrudTeacherStore = defineStore('useCrudTeacherStore', {
  state: () => ({
    loading: {
      form: false,
      table: false,
    },
    form: {
      id: null,
      company_id: null,
      type_education_id: null,
      job_position_id: null,
      complementaries: [],
      name: null,
      last_name: null,
      email: null,
      phone: null,
      photo: null,

    } as IForm,
    teacherData: {} as IForm,
    teachers: [] as Array<IList>,
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
        job_position_id: null,
        complementaries: [],
        name: null,
        last_name: null,
        email: null,
        phone: null,
        photo: null,
      }
    },


    async fetchAll(filter: object): Promise<void> {
      this.loading.table = true
      const { data, response, error, isFetching } = await useApi("/teacher-list").post(filter)
      this.loading.table = false

      if (response.value?.ok && data.value) {
        this.teachers = data.value.teachers
        this.totalData = data.value.totalData
        this.totalPage = data.value.totalPage
        this.currentPage = data.value.currentPage
        this.lastPage = data.value.lastPage
      }
    },

    async fetchDataForm(id: number | undefined, action: string = "create"): Promise<void> {
      this.loading.form = true
      const url = id ? `/teacher-dataForm/${action}/${id}` : `/teacher-dataForm/${action}`
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

      formData.delete('complementaries');
      formData.append('complementaries', JSON.stringify(this.form.complementaries))

      // this.loading.form = true
      const { data, response, error, isFetching } = await useApi("/teacher-create").post(formData)
      // this.loading.form = false

      if (response.value?.ok && data.value) {
        this.form = data.value.data
      }

      return data.value
    },

    async fetchDelete(id: number): Promise<void> {
      this.loading.table = true
      const { isFetching } = await useApi("/teacher-delete/" + id).delete()
      this.loading.table = false
    },

    async changeState(obj: object): Promise<IPromise> {
      this.loading.table = true
      const { data, response, isFetching } = await useApi("/teacher-changeState").post(obj)
      this.loading.table = false

      if (response.value?.ok && data.value) {
        this.form = data.value.data
      }
      return data.value
    },

  },
})
