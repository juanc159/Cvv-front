<script lang="ts" setup>
import { useToast } from '@/composables/useToast';
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { router } from '@/plugins/1.router';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import type { VForm } from 'vuetify/components/VForm';

definePage({
  path: "banner-form/:action/:id?",
  name: "Banner-Form",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "banner.list",
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
  path: null as string | null | File,
  company_id: null as string | null,
});

const clearForm = () => {
  for (const key in form.value) {
    form.value[key] = null
  }
}

const fetchDataForm = async () => {

  form.value.id = route.params.id || null

  const url = form.value.id ? `/banner/${form.value.id}/edit` : `/banner/create`

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

    const url = form.value.id ? `/banner/update/${form.value.id}` : `/banner/store`

    if (archive.value.imageFile) form.value.path = archive.value.imageFile

    const formData = new FormData();
    for (const key in form.value) {
      formData.append(key, form.value[key])
    }

    loading.form = true;
    const { data, response } = await useApi(url).post(formData);
    loading.form = false;

    if (response.value?.ok && data.value) {

      if (data.value.code == 200) {
        router.push({ name: 'Banner-List' })
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

//File archive

const archive = ref(useFileUpload())
archive.value.allowedExtensions = ["jpg", "jpeg", "png"];
watch(archive.value, (newVal, oldVal) => {
  if (newVal.imageFile) form.value.path = newVal.imageFile
})

// Computed que verifica si al menos uno de los valores es true
const isLoading = computed(() => {
  return Object.values(loading).some(value => value);
});

const addFile = (e: Event) => {
  archive.value.handleImageSelected(e);
  setTimeout(() => {
    form.value.path = archive.value.imageFile;
  }, 1000);
};
</script>


<template>
  <div>
    <VCard :disabled="loading.form" :loading="loading.form">
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Formulario Banner
        </span>
      </VCardTitle>
      <VCardText>

        <VForm ref="formValidation" @submit.prevent="() => { }" :disabled="disabledFiledsView">
          <VRow>
            <VCol sm="4">
              <VFileInput accept="image/*" :loading="archive.loading" @change="addFile($event)" :key="archive.key"
                @click:clear="archive.clearData" :rules="[requiredValidator]">
                <template #label>
                  Imagen&nbsp;<b class="text-warning">*</b>
                </template>
              </VFileInput>
            </VCol>
          </VRow>

          <VRow>
            <VCol v-if="archive.imageUrl || form.path" class="d-flex justify-center ">
              <VImg :src="archive.imageUrl ?? storageBack(form.path)" alt="alt"></VImg>
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
