import { ref, watch } from 'vue'

export function useSelect(fun, arrayData, countLinks, filterDta) {
  const searchQuery = ref<string>("")
  const dataNueva = ref<Array<object>>([])
  const page = ref<number>(1)
  const totalLinks = ref<number>(1)
  const filterInterno = ref<object>({})



  const prev = async () => {
    page.value--
    if (page.value <= 1) page.value = 1
    await search()
  }

  const next = async () => {
    page.value++


    if (page.value > totalLinks.value) {
      page.value = totalLinks.value
    }
    await search()
  }

  const search = async () => {
    let filter = {
      page: page.value,
      searchQuery: searchQuery.value
    }
    for (const key in filterDta) {
      filter[key] = filterDta[key]
    }
    for (const key in filterInterno.value) {
      filter[key] = filterInterno[key]
    }

    await fun(filter)

  }

  let timeoutId = null;

  watch(searchQuery, async (newQuestion, oldQuestion) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }


    page.value = 1
    let filter = {
      page: page.value,
      searchQuery: newQuestion
    }
    for (const key in filterDta) {
      filter[key] = filterDta[key]
    }
    for (const key in filterInterno.value) {
      filter[key] = filterInterno[key]
    }



    timeoutId = setTimeout(async () => {
      // Lógica para llamar a tu API aquí
      console.log('Ejecutando búsqueda: ');
      await fun(filter)
    }, 300); // Puedes ajustar el tiempo de espera según tus necesidades



    dataNueva.value = [];
    dataNueva.value.push(...arrayData.value)
    totalLinks.value = countLinks.value
  })

  return {
    searchQuery,
    dataNueva,
    page,
    filterInterno,
    next, prev, search, totalLinks
  }
}
