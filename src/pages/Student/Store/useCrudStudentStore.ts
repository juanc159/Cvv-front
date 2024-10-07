import type IPromise from '@/interfaces/Axios/IPromise';
import { defineStore } from 'pinia';


export const useCrudStudentStore = defineStore('useCrudStudentStore', {
  state: () => ({
    loading: {
      table: false,
    },
  }),
  getters: {
  },
  actions: {

    async fetchResetPassword(id: number | string): Promise<IPromise> {
      this.loading.table = true
      const { data, response, isFetching } = await useApi("/student-resetPassword/" + id).get()
      this.loading.table = false

      return data.value
    },

  },
})
