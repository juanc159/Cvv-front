<script lang="ts" setup>
import { useToast } from '@/composables/useToast';
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { router } from '@/plugins/1.router';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import type { VForm } from 'vuetify/components/VForm';


definePage({
  path: "student-form/:action/:id?",
  name: "Student-Form",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "student.list",
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
  countries: false,
  states: false,
  cities: false,
})

const typeEducations = ref<Array<{
  value: string,
  title: string,
}>>([])
const sections = ref<Array<{
  value: string,
  title: string,
}>>([])
const typeDocuments = ref<Array<{
  value: string,
  title: string,
}>>([])

const form = ref({
  id: null as string | null,
  type_education_id: null as string | null,
  grade_id: null as string | null,
  section_id: null as string | null,
  identity_document: null as string | null,
  full_name: null as string | null,
  photo: null as string | null | File,
  company_id: null as string | null,
  country_id: null as string | null,
  state_id: null as string | null,
  city_id: null as string | null,
  gender: null as string | null,
  birthday: null as string | null,
  real_entry_date: null as string | null,
  nationalized: null as string | null,
});

const clearForm = () => {
  for (const key in form.value) {
    form.value[key] = null
  }
}

const fetchDataForm = async () => {

  form.value.id = route.params.id || null

  const url = form.value.id ? `/student/${form.value.id}/edit` : `/student/create`

  loading.form = true
  const { response, data } = await useAxios(url).get({
    params: {
      company_id: authenticationStore.company.id
    }
  });
  loading.form = false

  if (response.status == 200 && data) {

    //select infinitos
    select_countries.dataNueva.value = data.countries_arrayInfo
    select_countries.totalLinks.value = data.countries_countLinks

    typeEducations.value = data.typeEducations
    sections.value = data.sections
    typeDocuments.value = data.typeDocuments


    //formulario 
    if (data.form) {
      form.value = data.form
      const formClone = JSON.parse(JSON.stringify(data.form))

      if (data.form.id) {
        if (formClone.country_id && formClone.state_id) {
          await changeCountry(formClone.country_id)
          await changeState(formClone.state_id)
          form.value.country_id = formClone.country_id
          form.value.state_id = formClone.state_id
          form.value.city_id = formClone.city_id
        }

      }
    }
  }
}

const submitForm = async () => {
  const validation = await formValidation.value?.validate()
  if (validation?.valid) {

    form.value.company_id = authenticationStore.company.id;

    const url = form.value.id ? `/student/update/${form.value.id}` : `/student/store`

    const formData = new FormData();
    for (const key in form.value) {
      if (!["arrayDetails", "country_id", "state_id", "city_id", "gender", "birthday"].includes(key)) {
        formData.append(key, form.value[key])
      }
    }
    formData.append("country_id", form.value.country_id.value)
    formData.append("state_id", form.value.state_id)
    formData.append("city_id", form.value.city_id)
    formData.append("gender", form.value.gender)
    formData.append("birthday", form.value.birthday)

    loading.form = true;
    const { data, response } = await useAxios(url).post(formData);
    loading.form = false;

    if (response.status == 200 && data) {

      if (data.code == 200) {
        router.push({ name: 'Student-List' })
      }
    }
    if (data.code === 422) errorsBack.value = data.errors ?? {};

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



// File
const archive = ref(useFileUpload());
const aExtImage = ["jpg", "jpeg", "png"];
archive.value.allowedExtensions = aExtImage;

const addPhoto = (e: Event) => {
  loading.form = true
  archive.value.handleImageSelected(e);
  setTimeout(() => {
    form.value.photo = archive.value.imageFile;
    loading.form = false

  }, 1000);
};

const gradesFilter = computed(() => {
  if (form.value.type_education_id) {
    return typeEducations.value.find(ele => ele.value == form.value.type_education_id).grades
  }
  return []
})


const states = ref<Array<object>>([])
const cities = ref<Array<object>>([])
const countries_arrayInfo = ref<Array<{
  value: string,
  title: string
}>>([])
const countries_countLinks = ref<number>(1)


//SELECT INFINITE COUNTRIES
const selectInfiniteCountries = async (params: object) => {
  loading.countries = true;
  const { data, response } = await useApi("/selectInfiniteCountries").post(params)
  loading.countries = false;
  if (response.value?.ok && data.value) {
    countries_arrayInfo.value = data.value.countries_arrayInfo
    countries_countLinks.value = data.value.countries_countLinks
  }
}

const select_countries = useSelect(
  selectInfiniteCountries,
  countries_arrayInfo,
  countries_countLinks,
  {}
);


//SELECT DEPARTAMENTOS
const changeCountry = async (event: any) => {
  form.value.state_id = null;
  form.value.city_id = null;

  loading.states = true;
  const { data, response } = await useApi(
    `/selectStates/${event.value}`
  ).get();
  loading.states = false;

  if (response.value?.ok && data.value) {
    states.value = data.value.states;
  }
}

//SELECT CIUDADES
const changeState = async (event: Event) => {
  form.value.city_id = null;

  loading.cities = true;
  const { data, response } = await useApi(`/selectCities/${event}`).get();
  loading.cities = false;

  if (response.value?.ok && data.value) {
    cities.value = data.value.cities;
  }
}

const genders = [
  { value: 'M', title: 'Masculino' },
  { value: 'F', title: 'Femenino' },
]


</script>


<template>
  <div>
    <VCard :disabled="loading.form" :loading="loading.form">
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Formulario estudiante
        </span>
      </VCardTitle>
      <VCardText>

        <VForm ref="formValidation" @submit.prevent="() => { }" :disabled="disabledFiledsView">
          <VRow>
            <VCol cols="12" sm="4">
              <AppSelect :items="typeEducations" clearable :requiredField="true" :rules="[requiredValidator]"
                v-model="form.type_education_id" label="Tipo de educación"></AppSelect>
            </VCol>

            <VCol cols="12" sm="4">
              <AppSelect clearable :items="gradesFilter" :requiredField="true" :rules="[requiredValidator]"
                v-model="form.grade_id" label="Grados y niveles">
              </AppSelect>
            </VCol>
            <VCol cols="12" sm="4">
              <AppSelect clearable :items="sections" :requiredField="true" :rules="[requiredValidator]"
                v-model="form.section_id" label="Secciones"></AppSelect>
            </VCol>


            <VCol cols="12" md="3">
              <SelectInfinite :requiredField="true" label="País" returnObject v-model="form.country_id"
                :select="select_countries" @update:model-value="changeCountry($event)"
                :error-messages="errorsBack.country_id" @input="errorsBack.country_id = ''" clearable
                :loading="loading.countries" :rules="[requiredValidator]">
              </SelectInfinite>
            </VCol>

            <VCol cols="12" md="3">
              <AppAutocomplete :loading="loading.states" :requiredField="true" clearable :items="states"
                v-model="form.state_id" label="Estado" @update:model-value="changeState($event)"
                :error-messages="errorsBack.state_id" @input="errorsBack.state_id = ''" :rules="[requiredValidator]">
              </AppAutocomplete>
            </VCol>
            <VCol cols="12" md="4">
              <AppAutocomplete :loading="loading.cities" :requiredField="true" clearable :items="cities"
                v-model="form.city_id" label="Municipio" :error-messages="errorsBack.city_id"
                @input="errorsBack.city_id = ''" :rules="[requiredValidator]">
              </AppAutocomplete>
            </VCol>
            <VCol cols="12" md="2">
              <VCheckbox v-model="form.nationalized" label="Nacionalizado" :true-value="true" :false-value="false">
                <template #label>
                  Nacionalizado: {{ form.nationalized ? 'Sí' : 'No' }}
                </template>
              </VCheckbox>
            </VCol>

            <VCol cols="12" sm="3">
              <AppSelect clearable :items="typeDocuments" :rules="[requiredValidator]" v-model="form.type_document_id"
                label="Tipo de documento"></AppSelect>
            </VCol>

            <VCol cols="12" sm="3">
              <AppTextField clearable v-model="form.identity_document" :rules="[requiredValidator]"
                :error-messages="errorsBack.identity_document" label="Documento"
                @input="errorsBack.identity_document = ''" :requiredField="true">
              </AppTextField>
            </VCol>

            <VCol cols="12" sm="6">
              <AppTextField clearable v-model="form.full_name" :rules="[requiredValidator]"
                :error-messages="errorsBack.full_name" label="Nombre completo" @input="errorsBack.full_name = ''"
                :requiredField="true">
              </AppTextField>
            </VCol>
            <VCol cols="12" sm="3">
              <AppSelect clearable v-model="form.gender" :items="genders" :rules="[requiredValidator]"
                :error-messages="errorsBack.gender" label="Sexo" @input="errorsBack.gender = ''" :requiredField="true">
              </AppSelect>
            </VCol>
            <VCol cols="12" sm="3">
              <AppDateTimePicker clearable v-model="form.birthday" label="Fecha de nacimiento"
                :rules="[requiredValidator]" :requiredField="true" :error-messages="errorsBack.birthday"
                @input="errorsBack.birthday = ''" />
            </VCol>

            <VCol cols="12" sm="3">
              <AppDateTimePicker clearable v-model="form.real_entry_date" label="Fecha de ingreso a la institución"
                :rules="[requiredValidator]" :requiredField="true" :error-messages="errorsBack.real_entry_date"
                @input="errorsBack.real_entry_date = ''" />
            </VCol>

            <VCol cols="12" sm="3">
              <VFileInput accept="image/*" :key="archive.key" @change="addPhoto($event)"
                @click:clear="archive.clearData">
                <template #label>
                  Foto&nbsp;<b class="text-warning">*</b>
                </template>
              </VFileInput>
            </VCol>
          </VRow>


          <VRow>
            <VCol cols="12" class="d-flex justify-center ">
              <div style=" block-size: 200px;inline-size: 200px;">
                <VImg :src="archive.imageUrl ?? storageBack(form.photo)" alt="alt"></VImg>

              </div>
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
