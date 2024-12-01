<script lang="ts" setup>
import { useToast } from '@/composables/useToast';
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { router } from '@/plugins/1.router';
import type { VForm } from 'vuetify/components/VForm';

definePage({
  path: "company-form/:action/:id?",
  name: "Company-Form",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "company.list",
  },
});

const { toast } = useToast()
const errorsBack = ref<IErrorsBack>({});
const disabledFiledsView = ref<boolean>(false);
const route = useRoute()
const formValidation = ref<VForm>()
const loading = reactive({
  form: false,
})

const typeDetails = ref<Array<{
  value: string,
  title: string,
}>>([])

const form = ref({
  id: null as string | null,
  name: null as string | null,
  slogan: null as string | null,
  image_principal: null as string | null | File,
  iframeGoogleMap: null as string | null,
  arrayDetails: [] as Array<{
    id: string | null,
    type_detail_id: string | null,
    icon: string | null,
    color: string | null,
    content: string | null,
  }>,
});

const clearForm = () => {
  for (const key in form.value) {
    form.value[key] = null
  }
  form.value.arrayDetails = []
}

const fetchDataForm = async () => {

  form.value.id = route.params.id || null

  const url = form.value.id ? `/company/${form.value.id}/edit` : `/company/create`

  loading.form = true
  const { response, data } = await useApi(url).get();
  loading.form = false

  if (response.value?.ok && data.value) {

    typeDetails.value = data.value.typeDetails


    //formulario 
    if (data.value.form) {
      form.value = data.value.form
    }
  }
}

const submitForm = async () => {
  const validation = await formValidation.value?.validate()
  if (validation?.valid) {

    const url = form.value.id ? `/company/update/${form.value.id}` : `/company/store`

    if (image_principal.value.imageFile) form.value.image_principal = image_principal.value.imageFile

    const formData = new FormData();
    for (const key in form.value) {
      if (!["arrayDetails"].includes(key)) {
        formData.append(key, form.value[key])
      }
    }
    formData.append("arrayDetails", JSON.stringify(form.value.arrayDetails))

    loading.form = true;
    const { data, response } = await useApi(url).post(formData);
    loading.form = false;

    if (response.value?.ok && data.value) {

      if (data.value.code == 200) {
        router.push({ name: 'Company-List' })
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

//File image_principal

const image_principal = ref(useFileUpload())
image_principal.value.allowedExtensions = ["jpg", "jpeg", "png"];
watch(image_principal.value, (newVal, oldVal) => {
  if (newVal.imageFile) form.value.image_principal = newVal.imageFile
})

// Computed que verifica si al menos uno de los valores es true
const isLoading = computed(() => {
  return Object.values(loading).some(value => value);
});



const addDetail = () => {
  form.value.arrayDetails.push({
    id: null,
    type_detail_id: null,
    icon: null,
    color: null,
    content: null,
  });
};
const deleteDetail = (index: number) => {
  form.value.arrayDetails.splice(index, 1);
};
</script>


<template>
  <div>
    <VCard :disabled="loading.form" :loading="loading.form">
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Formulario Compañia
        </span>
      </VCardTitle>
      <VCardText>

        <VForm ref="formValidation" @submit.prevent="() => { }" :disabled="disabledFiledsView">
          <VRow>
            <VCol sm="4">
              <VRow>
                <VCol>
                  <VLabel>Imagen principal</VLabel>
                  <VFileInput accept="image/*" :loading="image_principal.loading"
                    @change="image_principal.handleImageSelected" :key="image_principal.key">
                  </VFileInput>
                </VCol>
              </VRow>

              <VRow v-if="image_principal.imageUrl || form.image_principal">
                <VCol class="d-flex justify-center ">
                  <VImg :src="image_principal.imageUrl ?? storageBack(form.image_principal)" alt="alt"></VImg>
                </VCol>
              </VRow>

            </VCol>
            <VCol sm="8">
              <VRow>
                <VCol cols="12">
                  <AppTextField :requiredField="true" :rules="[requiredValidator]" v-model="form.name" label="Nombre"
                    :error-messages="errorsBack.name" @input="errorsBack.name = ''" clearable />
                </VCol>
                <VCol cols="12">
                  <AppTextField clearable v-model="form.slogan" :rules="[requiredValidator]"
                    :error-messages="errorsBack.slogan" label="Eslogan" @input="errorsBack.slogan = ''"
                    :requiredField="true">
                  </AppTextField>
                </VCol>
                <VCol cols="12">
                  <AppTextField clearable v-model="form.iframeGoogleMap" label="iframeGoogleMap">
                  </AppTextField>
                </VCol>
              </VRow>
            </VCol>
          </VRow>


        </VForm>

      </VCardText>

      <VDivider class="my-5"></VDivider>

      <VCardTitle primary-title>
        <div class="d-flex justify-space-between">
          <span>Información de adicional</span>
          <VBtn color="success" @click="addDetail()">Agregar</VBtn>
        </div>
      </VCardTitle>
      <VCardText>
        <VRow v-for="(item, index) in form.arrayDetails" :key="index">
          <VCol cols="12" md="2">
            <AppSelect :items="typeDetails" v-model="item.type_detail_id" label="Tipo" :requiredField="true">
            </AppSelect>
          </VCol>
          <VCol cols="12" md="2">
            <AppTextField clearable v-model="item.icon" :rules="[requiredValidator]" label="Icono"
              :requiredField="true">
            </AppTextField>
          </VCol>
          <VCol cols="12" md="2">
            <AppTextField clearable v-model="item.color" :rules="[requiredValidator]" label="Color"
              :requiredField="true">
            </AppTextField>
          </VCol>
          <VCol cols="12" md="5">
            <AppTextField clearable v-model="item.content" :rules="[requiredValidator]" label="Contenido"
              :requiredField="true">
            </AppTextField>
          </VCol>
          <VCol cols="12" md="1">
            <VBtn icon color="error" variant="text" class="mt-6" @click="deleteDetail(index)">
              <VIcon icon="tabler-trash"></VIcon>
              <VTooltip location="top" transition="scale-transition" activator="parent" text="Eliminar">
              </VTooltip>
            </VBtn>
          </VCol>
        </VRow>
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
