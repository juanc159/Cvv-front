<script lang="ts" setup>
import { useToast } from '@/composables/useToast';
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { router } from '@/plugins/1.router';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import type { VForm } from 'vuetify/components/VForm';


definePage({
  path: "service-form/:action/:id?",
  name: "Service-Form",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "service.list",
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


const form = ref({
  id: null as string | null,
  image: null as string | null | File,
  title: null as string | null,
  html: null as string | null,
  company_id: null as string | null,
});

const clearForm = () => {
  for (const key in form.value) {
    form.value[key] = null
  }
}

const fetchDataForm = async () => {

  form.value.id = route.params.id || null

  const url = form.value.id ? `/service/${form.value.id}/edit` : `/service/create`

  loading.form = true
  const { response, data } = await useApi(url).get();
  loading.form = false

  if (response.value?.ok && data.value) {

    //formulario 
    if (data.value.form) {
      form.value = data.value.form
    }
  }
}

const submitForm = async () => {
  const validation = await formValidation.value?.validate()
  if (validation?.valid) {

    form.value.company_id = authenticationStore.company.id;

    const url = form.value.id ? `/service/update/${form.value.id}` : `/service/store`

    const formData = new FormData();
    for (const key in form.value) {
      if (!["arrayDetails"].includes(key)) {
        formData.append(key, form.value[key])
      }
    }

    loading.form = true;
    const { data, response } = await useApi(url).post(formData);
    loading.form = false;

    if (response.value?.ok && data.value) {

      if (data.value.code == 200) {
        router.push({ name: 'Service-List' })
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

// File
const archive = ref(useFileUpload());
const aExtImage = ["jpg", "jpeg", "png"];
archive.value.allowedExtensions = aExtImage;

const addFile = (e: Event) => {
  archive.value.handleImageSelected(e);
  setTimeout(() => {
    form.value.image = archive.value.imageFile;
  }, 1000);
};

const errorsFormHtml = computed(() => {
  if (errorsBack.value.html) {
    return errorsBack.value.html
  }
})

const validateImagen = computed(() => {
  if (form.value.id) {
    return []
  }
  return [requiredValidator]
})

</script>


<template>
  <div>
    <VCard :disabled="loading.form" :loading="loading.form">
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Formulario servicio
        </span>
      </VCardTitle>
      <VCardText>

        <VForm ref="formValidation" @submit.prevent="() => { }" :disabled="disabledFiledsView">
          <VRow>
            <VCol cols="12" sm="3">
              <AppTextField clearable v-model="form.title" :rules="[requiredValidator]"
                :error-messages="errorsBack.title" label="Título" @input="errorsBack.title = ''" :requiredField="true">
              </AppTextField>
            </VCol>
            <VCol cols="12" sm="3">
              <VLabel>
                Imagen&nbsp;<b v-if="validateImagen.length > 0 ? true : false" class="text-warning">*</b>
              </VLabel>
              <VFileInput accept="image/*" :rules="validateImagen" :key="archive.key" @change="addFile($event)"
                @click:clear="archive.clearData">

              </VFileInput>
            </VCol>
            <VCol cols="12" sm="3">
              <VImg :src="archive.imageUrl ?? storageBack(form.image)"></VImg>
            </VCol>

            <VCol cols="12">
              <Editor :api-key="API_KEY_EDITOR" :init="{
                toolbar_mode: 'sliding',
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
              }" initial-value="" v-model="form.html" />

              <template v-for="(item, index) in errorsFormHtml" :key="index">
                <VAlert class="my-2" variant="tonal" color="error">
                  {{ item }}
                </VAlert>
              </template>
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
