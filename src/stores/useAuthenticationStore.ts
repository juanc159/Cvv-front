import { defineStore } from 'pinia'

import { useToast } from '@/composables/useToast'
import type IAuth from '@/interfaces/Authentication/IAuth'
import type ILogin from '@/interfaces/Authentication/ILogin'
import type IPromise from '@/interfaces/Axios/IPromise'

const toast = useToast()

export const useAuthenticationStore = defineStore('useAuthenticationStore', {
  state: () => ({
    isAuthenticate: false as boolean,
    token: '' as string,
    user: {} as IAuth,
    menu: [],
    permissions: [],
    company: {} as object,
    loading: false
  }),
  persist: true,
  getters: {
    getMenuData: state => {
      /** **  Filtrar menu USUARIOS Y ROLES ***********/
      return state.menu
    },
  },
  actions: {
    async logout(): Promise<void> {
      this.$reset()
    },
    async login(formulario: ILogin): Promise<IPromise> {
      this.loading = true
      const { data, response, error, isFetching } = await useApi("/login").post(formulario)
      this.loading = isFetching.value

      if (response.value?.ok && data.value) {
        this.isAuthenticate = true
        this.user = data.value.user
        this.menu = data.value.menu
        this.permissions = data.value.permissions
        this.token = data.value.token
        useCookie('accessToken').value = this.token
      }

      return data.value

    },

  },
})
