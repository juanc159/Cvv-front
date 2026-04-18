import { defineStore } from "pinia";

import type IAuth from "@/interfaces/Authentication/IAuth";
import type ILogin from "@/interfaces/Authentication/ILogin";
import type IPromise from "@/interfaces/Axios/IPromise";

export const useAuthenticationStore = defineStore("useAuthenticationStore", {
  state: () => ({
    isAuthenticate: false as boolean,
    tokenGoogle: "" as string,
    access_token: "" as string,
    user: {} as IAuth,
    company: { id: null } as object,
    menu: [],
    permissions: [],
    loading: false,
    rememberMe: false,
  }),
  persist: true,
  getters: {
    getMenuData: state => {
      if (state.company.id)
        return state.menu.filter(ele => ele.to.name != 'Company-List')
      else return state.menu.filter(ele => ele.to.name == 'Company-List' || ele.to.name == 'Banner-List')
    },


  },
  actions: {
    async logout(): Promise<void> {

      this.$reset();
      useCookie("accessToken").value = null;
    },

    async fetchMe(): Promise<boolean> {
      const token = useCookie("accessToken").value;
      if (!token) return false;

      try {
        const { data, response } = await useAxios("/me").get();

        if (response?.status === 200 && data && (data.code === '200' || data.code === 200)) {
          this.isAuthenticate = true;
          this.user = data.user;
          this.company = data.company;
          this.menu = data.menu;
          this.permissions = data.permissions;
          this.access_token = token;
          return true;
        }

        await this.logout();
        return false;
      } catch {
        await this.logout();
        return false;
      }
    },
    async login(formulario: ILogin): Promise<IPromise> {
      this.loading = true;
      const { data, response } = await useAxios("/login").post(formulario);
      this.loading = false;

      if (response.status == 200 && data) {
        this.isAuthenticate = true;
        this.user = data.user;
        this.company = data.company;
        this.menu = data.menu;
        this.permissions = data.permissions;
        this.access_token = data.access_token;
        useCookie("accessToken").value = this.access_token;
      }

      return data;
    },

    checkAuthentication() {
      // Implementa la lógica para verificar la autenticación
      const isAuthenticated = !!this.access_token; // Ejemplo: verifica si existe un token en localStorage

      return isAuthenticated && this.rememberMe;
    }
  },
});
