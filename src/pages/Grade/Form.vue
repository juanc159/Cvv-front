<script lang="ts" setup>
import { useToast } from '@/composables/useToast';
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { router } from '@/plugins/1.router';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import type { VForm } from 'vuetify/components/VForm';

definePage({
  path: "grade-form/:action/:id?",
  name: "Grade-Form",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "grade.list",
  },
});

const authenticationStore = useAuthenticationStore();

const { toast } = useToast()
const errorsBack = ref<IErrorsBack>({});
const disabledFiledsView = ref<boolean>(false);
const route = useRoute()
const formValidation = ref<VForm>()
const loading = reactive({
  form: false,
})

const typeEducations = ref<Array<{
  value: string,
  title: string,
}>>([])

const form = ref({
  id: null as string | null,
  type_education_id: null as string | null,
  name: null as string | null,
  subjects: [] as Array<object>,
  company_id: null as string | null,
});

const clearForm = () => {
  for (const key in form.value) {
    form.value[key] = null
  }
  form.value.subjects = []
}

const fetchDataForm = async () => {

  form.value.id = route.params.id || null

  const url = form.value.id ? `/grade/${form.value.id}/edit` : `/grade/create`

  loading.form = true
  const { data, response } = await useApi<any>(
    createUrl(`${url}`, {
      query: {
        company_id: authenticationStore.company.id
      },
    })
  );


  loading.form = false

  if (response.value?.ok && data.value) {
    typeEducations.value = data.value.typeEducations


    //formulario 
    if (data.value.form) {
      form.value = data.value.form

      const info = JSON.parse(JSON.stringify(form.value))
      await chageTypeEducation(info.type_education_id)
      form.value.subjects = info.subjects
    }
  }
}

const submitForm = async () => {
  const validation = await formValidation.value?.validate()
  if (validation?.valid) {

    form.value.company_id = authenticationStore.company.id;

    const url = form.value.id ? `/grade/update/${form.value.id}` : `/grade/store`

    loading.form = true;
    const { data, response } = await useApi(url).post(form.value);
    loading.form = false;

    if (response.value?.ok && data.value) {

      if (data.value.code == 200) {
        router.push({ name: 'Grade-List' })
      }
    }
    if (data.value.code === 422) errorsBack.value = data.value.errors ?? {};

  }
  else {
    toast('Faltan Campos Por Diligenciar', '', 'danger')
  }
}

if (route.params.action == 'view') disabledFiledsView.value = true

onMounted(async () => {
  clearForm()
  await fetchDataForm()
})


// Computed que verifica si al menos uno de los valores es true
const isLoading = computed(() => {
  return Object.values(loading).some(value => value);
});



const subjects = ref<Array<object>>([])

const chageTypeEducation = async (event: any) => {
  subjects.value = []
  form.value.subjects = []
  if (event) {
    const search = await typeEducations.value.find(ele => ele.value == event)
    subjects.value = search.subjects
  }

}


</script>


<template>
  <div>
    <VCard :disabled="loading.form" :loading="loading.form">
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Formulario grado
        </span>
      </VCardTitle>
      <VCardText>

        <VForm ref="formValidation" @submit.prevent="() => { }" :disabled="disabledFiledsView">
          <VRow>
            <VCol cols="12" sm="3">
              <AppSelect clearable v-model="form.type_education_id" :rules="[requiredValidator]"
                :error-messages="errorsBack.type_education_id" label="Tipo" @input="errorsBacktype_education_id = ''"
                :requiredField="true" :items="typeEducations" @update:model-value="chageTypeEducation($event)">
              </AppSelect>
            </VCol>
            <VCol cols="12" sm="3">
              <AppTextField clearable v-model="form.name" :rules="[requiredValidator]" :error-messages="errorsBack.name"
                label="Nombre" @input="errorsBack.name = ''" :requiredField="true">
              </AppTextField>
            </VCol>

            <VCol cols="12" sm="3">
              <AppSelect clearable v-model="form.subjects" item-value="id" item-title="name" label="Materias" multiple
                :requiredField="true" :items="subjects" :rules="[requiredValidator]">
              </AppSelect>
            </VCol>
          </VRow>

        </VForm>

      </VCardText>

      <VCardText class="d-flex justify-end gap-3 flex-wrap mt-5">
        <BtnBack :disabled="isLoading" :loading="isLoading" />
        <VBtn v-if="!disabledFiledsView" :disabled="isLoading" :loading="isLoading" @click="submitForm()"
          color="primary">
          Guardar
        </VBtn>
      </VCardText>
    </VCard>
  </div>
</template>
