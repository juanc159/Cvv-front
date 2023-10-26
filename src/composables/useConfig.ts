export function useConfig() {
  const parts = "127.0.0.1"
  // const parts = window.location.hostname

  //SERVIDOR PRD
  // const port = 7443
  // const protocol = "https"

  //SERVIDOR LOCAL
  const port = 8000
  const protocol = "http"

  const baseURL = ref(localStorage.getItem('baseUrl') ?? `${protocol}://${parts}:${port}/api`)
  // const baseURL = ref(localStorage.getItem('baseUrl') ?? 'https://house-backend.test/api')
  const baseURLBack = `${parts}://${parts}:${port}`

  const setBaseUrl = (text: string) => {
    baseURL.value = text
  }

  return {
    baseURL,
    baseURLBack,
    setBaseUrl,
  }
}
