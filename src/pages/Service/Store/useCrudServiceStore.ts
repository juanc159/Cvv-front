import type IPromise from '@/interfaces/Axios/IPromise';
import type IForm from '@/pages/Service/Interfaces/IForm';
import type IList from '@/pages/Service/Interfaces/IList';
import { defineStore } from 'pinia';


export const useCrudServiceStore = defineStore('useCrudServiceStore', {
  state: () => ({
    loading: {
      form: false,
      table: false,
    },
    form: {
      id: null,
      company_id: null,
      image: null,
      title: null,
      html: null,
    } as IForm,
    serviceData: {} as IForm,
    services: [] as Array<IList>,
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
        company_id: null,
        image: null,
        title: null,
        html: null,
      }
    },


    async fetchAll(filter: object): Promise<void> {
      this.loading.table = true
      const { data, response, error, isFetching } = await useApi("/service-list").post(filter)
      this.loading.table = isFetching.value

      if (response.value?.ok && data.value) {
        this.services = data.value.services
        this.totalData = data.value.totalData
        this.totalPage = data.value.totalPage
        this.currentPage = data.value.currentPage
        this.lastPage = data.value.lastPage
      }
    },

    async fetchDataForm(id: number | undefined, action: string = "create"): Promise<void> {
      this.loading.form = true
      const url = id ? `/service-dataForm/${action}/${id}` : `/service-dataForm/${action}`
      const { data, response, error, isFetching } = await useApi(url).get()
      this.loading.form = false

      if (response.value?.ok && data.value) {
        this.form = data.value.form
      }
    },


    async fetchSave(): Promise<IPromise> {

      const formData = new FormData()
      for (const key in this.form)
        formData.append(key, this.form[key])

      this.loading.form = true
      const { data, response, error, isFetching } = await useApi("/service-create").post(formData)
      this.loading.form = false

      if (response.value?.ok && data.value) {
        this.form = data.value.data
      }

      return data.value
    },

    async fetchDelete(id: number): Promise<void> {
      this.loading.table = true
      const { isFetching } = await useApi("/service-delete/" + id).delete()
      this.loading.table = isFetching.value
    },

    async changeState(obj: object): Promise<IPromise> {
      this.loading.table = true
      const { data, response, isFetching } = await useApi("/service-changeState").post(obj)
      this.loading.table = isFetching.value

      if (response.value?.ok && data.value) {
        this.form = data.value.data
      }
      return data.value
    },

  },
})
