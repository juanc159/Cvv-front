import { createFetch } from '@vueuse/core';
import { destr } from 'destr';
const { toast } = useToast()

export const useApi = createFetch({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  fetchOptions: {
    headers: {
      "Content-Type": 'application/json',
    },
  },
  options: {
    updateDataOnError: true,
    async onFetchError(ctx) {

      ctx.data = JSON.parse(ctx.data) // Modifies the response data
      if (ctx.data.message) toast("Error", ctx.data.message, "danger")
      return ctx

    },

    refetch: false,
    async beforeFetch({ options }) {
      const accessToken = useCookie('accessToken').value

      if (accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,

        }
      }

      // Añade lógica para verificar si los datos son FormData y establecer el encabezado correspondiente
      if (options.body instanceof FormData) {
        // No establezcas el encabezado Content-Type si son FormData
        delete options.headers['Content-Type'];
      }
      return { options }
    },
    afterFetch(ctx) {
      const { data, response } = ctx

      // Parse data if it's JSON

      let parsedData = null
      try {
        parsedData = destr(data)
      }
      catch (error) {
        console.error(error)
      }

      if (parsedData && parsedData.message) toast("Exito", parsedData.message, "success")

      return { data: parsedData, response }
    },
  },
})
