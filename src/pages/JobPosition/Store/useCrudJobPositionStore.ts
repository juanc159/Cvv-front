import type IPromise from '@/interfaces/Axios/IPromise';
import type IForm from '@/pages/JobPosition/Interfaces/IForm';
import { defineStore } from 'pinia';


export const useCrudJobPositionStore = defineStore('useCrudJobPositionStore', {
  state: () => ({
    loading: {
      form: false,
      table: false,
    },
    form: {
      id: null,
      name: null,
    } as IForm,
    jobPositionData: {} as IForm,
  }),
  getters: {
  },
  actions: {
    clearForm() {
      this.form = <IForm>{
        id: null,
        name: null,
      }
    },

    async fetchDataForm(id: number | undefined, action: string = "create"): Promise<void> {
      this.loading.form = true
      const url = id ? `/jobPosition-dataForm/${action}/${id}` : `/jobPosition-dataForm/${action}`
      const { data, response, error, isFetching } = await useApi(url).get()
      this.loading.form = false

      if (response.value?.ok && data.value) {

      }
      if (response.value?.ok && data.value.form) {
        this.form = data.value.form
      }
    },


    async fetchSave(): Promise<IPromise> {

      const formData = new FormData()
      for (const key in this.form)
        formData.append(key, this.form[key])

      this.loading.form = true
      const { data, response, error, isFetching } = await useApi("/jobPosition-create").post(formData)
      this.loading.form = false

      if (response.value?.ok && data.value) {
        this.form = data.value.data
      }

      return data.value
    },

    async fetchDelete(id: number): Promise<void> {
      this.loading.table = true
      const { isFetching } = await useApi("/jobPosition-delete/" + id).delete()
      this.loading.table = false
    },

    async changeState(obj: object): Promise<IPromise> {
      this.loading.table = true
      const { data, response, isFetching } = await useApi("/jobPosition-changeState").post(obj)
      this.loading.table = false

      if (response.value?.ok && data.value) {
        this.form = data.value.data
      }
      return data.value
    },

  },
})
