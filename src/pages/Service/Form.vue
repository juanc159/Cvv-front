<script lang="ts" setup>
definePage({
  name: "Service-Form",
  path: "/service-form/:action/:id?",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "service.index",
  },
});

import { useImageUpload } from "@/composables/useImageUpload";
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { useCrudServiceStore } from "@/pages/Service/Store/useCrudServiceStore";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { VForm } from "vuetify/components";
const route = useRoute();
const { toast } = useToast();
const formValidation = ref<VForm>();
const storeService = useCrudServiceStore();
const authenticationStore = useAuthenticationStore();
const { form, loading } = storeToRefs(storeService);
const photo = ref(useImageUpload());
const errorsBack = ref<IErrorsBack>({});


const arrayValidation = ref<Array<string | boolean>>([]);

// File
const archive = ref(useImageUpload());
const aExtImage = ["jpg", "jpeg", "png"];
archive.value.allowedExtensions = aExtImage;

const submitForm = async () => {
  form.value.company_id = authenticationStore.company.id;
  const validation = await formValidation.value?.validate();
  if (validation?.valid) {
    const data = await storeService.fetchSave();
    if (data?.code === 200) {
      arrayValidation.value = [];
      errorsBack.value = {};
      photo.value.clearData();
      await formValidation.value?.resetValidation();
    }
    if (data?.code === 422) errorsBack.value = data.errors ?? {}; // muestra error del back
  } else {
    toast("Faltan Campos Por Diligenciar", "", "danger");
  }
};

const addFile = (e: Event) => {
  archive.value.handleImageSelected(e);
  setTimeout(() => {
    form.value.image = archive.value.imageFile;
  }, 1000);
};

onMounted(async () => {
  storeService.clearForm();
  if (route.params.id) {
    await storeService.fetchDataForm(
      Number(route.params.id),
      route.params.action
    );
  }
});

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
    <VCard>
      <VCardText>
        <VRow>
          <VCol>
            <HeaderAlertView sub-title="Formulario Servicio" :action="String($route.params.action)" btn-action="list"
              :validate-crud="true" :btn-back="true" @changeScreenBack="$router.back" />
          </VCol>
        </VRow>
        <VForm ref="formValidation" lazy-validation>
          <VRow>
            <VCol cols="12" sm="3">
              <AppTextField clearable v-model="form.title" :rules="[requiredValidator]"
                :error-messages="errorsBack.title" label="Título" @keypress="errorsBack.title = ''"
                :requiredField="true">
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
              <VImg :src="archive.imageUrl ?? form.image"></VImg>
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
          <VRow>

          </VRow>
          <VRow>
            <VCol cols="12" class="d-flex justify-center">
              <VBtn :loading="loading.form" color="primary" @click="submitForm()">
                Guardar
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>
