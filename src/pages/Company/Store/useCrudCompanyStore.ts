import type IPromise from '@/interfaces/Axios/IPromise';
import type IForm from '@/pages/Company/Interfaces/IForm';
import type IList from '@/pages/Company/Interfaces/IList';
import { defineStore } from 'pinia';


export const useCrudCompanyStore = defineStore('useCrudCompanyStore', {
  state: () => ({
    loading: {
      form: false,
      table: false,
    },
    form: {
      id: null,
      name: null,
      slogan: null,
      arrayDetails: []
    } as IForm,
    companyData: {} as IForm,
    companies: [] as Array<IList>,
    totalData: 0 as number,
    totalPage: 0 as number,
    currentPage: 1 as number,
    lastPage: 0 as number,
    typeDetails: [] as Array<{
      value: number,
      title: string,
    }>
  }),
  getters: {
  },
  actions: {
    clearForm() {
      this.form = <IForm>{
        id: null,
        name: null,
        slogan: null,
        arrayDetails: []
      }
    },


    async fetchAll(filter: object): Promise<void> {
      this.loading.table = true
      const { data, response, error, isFetching } = await useApi("/company-list").post(filter)
      this.loading.table = isFetching.value

      if (response.value?.ok && data.value) {
        this.companies = data.value.companies
        this.totalData = data.value.totalData
        this.totalPage = data.value.totalPage
        this.currentPage = data.value.currentPage
        this.lastPage = data.value.lastPage
      }
    },

    async fetchDataForm(id: number | undefined, action: string = "create"): Promise<void> {
      this.loading.form = true
      const url = id ? `/company-dataForm/${action}/${id}` : `/company-dataForm/${action}`
      const { data, response, error, isFetching } = await useApi(url).get()
      this.loading.form = isFetching.value

      if (response.value?.ok && data.value) {
        this.form = data.value.form
        this.typeDetails = data.value.typeDetails
      }
    },


    async fetchSave(): Promise<IPromise> {
      this.loading.form = true
      const { data, response, error, isFetching } = await useApi("/company-create").post(this.form)
      this.loading.form = isFetching.value

      if (response.value?.ok && data.value) {
        this.form = data.value.data
      }

      return data.value
    },

    async fetchDelete(id: number): Promise<void> {
      this.loading.table = true
      const { isFetching } = await useApi("/company-delete/" + id).delete()
      this.loading.table = isFetching.value
    },

    async changeState(obj: object): Promise<IPromise> {
      this.loading.table = true
      const { data, response, isFetching } = await useApi("/company-changeState").post(obj)
      this.loading.table = isFetching.value

      if (response.value?.ok && data.value) {
        this.form = data.value.data
      }
      return data.value
    },

  },
})
