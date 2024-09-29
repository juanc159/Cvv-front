import type IPromise from '@/interfaces/Axios/IPromise';
import type IForm from '@/pages/Banner/Interfaces/IForm';
import type IList from '@/pages/Banner/Interfaces/IList';
import { defineStore } from 'pinia';


export const useCrudBannerStore = defineStore('useCrudBannerStore', {
  state: () => ({
    loading: {
      form: false,
      table: false,
    },
    form: {
      id: null,
      company_id: null,
      path: null,
    } as IForm,
    bannerData: {} as IForm,
    banners: [] as Array<IList>,
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
        path: null,
      }
    },


    async fetchAll(filter: object): Promise<void> {
      this.loading.table = true
      const { data, response, error } = await useApi("/banner-list").post(filter)
      this.loading.table = false

      if (response.value?.ok && data.value) {
        this.banners = data.value.banners
        this.totalData = data.value.totalData
        this.totalPage = data.value.totalPage
        this.currentPage = data.value.currentPage
        this.lastPage = data.value.lastPage
      }
    },

    async fetchDataForm(id: number | undefined, action: string = "create"): Promise<void> {
      this.loading.form = true
      const url = id ? `/banner-dataForm/${action}/${id}` : `/banner-dataForm/${action}`
      const { data, response, error } = await useApi(url).get()
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
      const { data, response, error } = await useApi("/banner-create").post(formData)
      this.loading.form = false

      if (response.value?.ok && data.value) {
        this.form = data.value.data
      }

      return data.value
    },

    async fetchDelete(id: number): Promise<void> {
      this.loading.table = true
      const { isFetching } = await useApi("/banner-delete/" + id).delete()
      this.loading.table = false
    },

    async changeState(obj: object): Promise<IPromise> {
      this.loading.table = true
      const { data, response } = await useApi("/banner-changeState").post(obj)
      this.loading.table = false

      if (response.value?.ok && data.value) {
        this.form = data.value.data
      }
      return data.value
    },

  },
})
