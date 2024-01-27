import type IPromise from '@/interfaces/Axios/IPromise';
import { defineStore } from 'pinia';

export const useTenantStore = defineStore('useTenantStore', {
  state: () => ({
    loading: {
      form: false,
      table: false
    },
    tenants: [],
  }),
  getters: {},
  actions: {
    async setHost(text: string): Promise<void> {
      import.meta.env.VITE_API_BASE_URL = 'http://' + text + '.127.0.0.1:8000/api'
      localStorage.setItem('baseUrl', `http://${text}.127.0.0.1:8000/api`)
      window.location.href = 'http://' + text + '.localhost:5173';
      setTimeout(() => {
        window.location.reload()
      }, 1000);
    },
    async setHostLogin(text: string): Promise<void> {
      window.location.href = 'http://' + text + '.localhost:5173';
    },
    async setHostCentral(): Promise<void> {
      const configUse = ref(useConfig())
      import.meta.env.VITE_API_BASE_URL = configUse.value.baseURL
      localStorage.setItem('baseUrl', configUse.value.baseURL)
      window.location.reload()
    },


    async fetchSave(form: object): Promise<IPromise> {
      this.loading.form = true
      const { data, response, error, isFetching } = await useApi("/tenant-store").post(form)
      this.loading.form = false


      if (response.value?.ok && data.value) {
        await $web("/linkstorage", {
          method: "get"
        })
      }


      return data.value


      // const configUse = ref(useConfig())
      // axios.get(configUse.value.baseURLBack + '/linkstorage').then(result => {
      // })




    },

    async fetchList(): Promise<void> {

      this.loading.form = true
      const { data, response, error, isFetching } = await useApi("/tenant-list").post({
        typeData: 'todos',
      })
      this.loading.form = false

      if (response.value?.ok && data.value) {
        this.tenants = data.value.data
      }

      return data.value

    },

  },
})
