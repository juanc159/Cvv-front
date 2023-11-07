import type IPromise from '@/interfaces/Axios/IPromise';
import type IForm from '@/pages/Subject/Interfaces/IForm';
import type IList from '@/pages/Subject/Interfaces/IList';
import { defineStore } from 'pinia';


export const useCrudSubjectStore = defineStore('useCrudSubjectStore', {
  state: () => ({
    loading: {
      form: false,
      table: false,
    },
    form: {
      id: null,
      name: null,
      code: null,
    } as IForm,
    subjectData: {} as IForm,
    subjects: [] as Array<IList>,
    totalData: 0 as number,
    totalPage: 0 as number,
    currentPage: 1 as number,
    lastPage: 0 as number,
  }),
  getters: {
  },
  actions: {
    clearForm() {
      this.form = <IForm>{
        id: null,
        name: null,
        code: null,
      }
    },


    async fetchAll(filter: object): Promise<void> {
      this.loading.table = true
      const { data, response, error, isFetching } = await useApi("/subject-list").post(filter)
      this.loading.table = isFetching.value

      if (response.value?.ok && data.value) {
        this.subjects = data.value.subjects
        this.totalData = data.value.totalData
        this.totalPage = data.value.totalPage
        this.currentPage = data.value.currentPage
        this.lastPage = data.value.lastPage
      }
    },

    async fetchDataForm(id: number | undefined, action: string = "create"): Promise<void> {
      this.loading.form = true
      const url = id ? `/subject-dataForm/${action}/${id}` : `/subject-dataForm/${action}`
      const { data, response, error, isFetching } = await useApi(url).get()
      this.loading.form = isFetching.value

      if (response.value?.ok && data.value) {
        this.form = data.value.form
      }
    },


    async fetchSave(): Promise<IPromise> {

      const formData = new FormData()
      for (const key in this.form)
        formData.append(key, this.form[key])

      this.loading.form = true
      const { data, response, error, isFetching } = await useApi("/subject-create").post(formData)
      this.loading.form = isFetching.value

      if (response.value?.ok && data.value) {
        this.form = data.value.data
      }

      return data.value
    },

    async fetchDelete(id: number): Promise<void> {
      this.loading.table = true
      const { isFetching } = await useApi("/subject-delete/" + id).delete()
      this.loading.table = isFetching.value
    },

    async changeState(obj: object): Promise<IPromise> {
      this.loading.table = true
      const { data, response, isFetching } = await useApi("/subject-changeState").post(obj)
      this.loading.table = isFetching.value

      if (response.value?.ok && data.value) {
        this.form = data.value.data
      }
      return data.value
    },

  },
})
