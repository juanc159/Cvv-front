<script lang="ts" setup>
definePage({
  name: "Banner-Form",
  path: "/banner-form/:action/:id?",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "banner.index",
  },
});

import { useImageUpload } from "@/composables/useImageUpload";
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { useCrudBannerStore } from "@/pages/Banner/Store/useCrudBannerStore";
import { router } from "@/plugins/1.router";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { VForm } from "vuetify/components";
const route = useRoute();
const { toast } = useToast();
const formValidation = ref<VForm>();
const storeBanner = useCrudBannerStore();
const authenticationStore = useAuthenticationStore();
const { form, loading } = storeToRefs(storeBanner);
const errors = ref<IErrorsBack>({});
const photo = ref(useImageUpload());

const arrayValidation = ref<Array<string | boolean>>([]);

// File
const archive = ref(useImageUpload());
const aExtImage = ["jpg", "jpeg", "png"];
archive.value.allowedExtensions = aExtImage;

const submitForm = async () => {
  form.value.company_id = authenticationStore.company.id;
  const validation = await formValidation.value?.validate();
  if (validation?.valid) {
    const data = await storeBanner.fetchSave();
    if (data?.code === 200) {
      arrayValidation.value = [];
      errors.value = {};
      photo.value.clearData();
      await formValidation.value?.resetValidation();
      router.push({ name: "Banner-Index" })

    }
    if (data?.code === 422) errors.value = data.errors ?? {}; // muestra error del back
  } else {
    toast("Faltan Campos Por Diligenciar", "", "danger");
  }
};

const addFile = (e: Event) => {
  archive.value.handleImageSelected(e);
  setTimeout(() => {
    form.value.path = archive.value.imageFile;
  }, 1000);
};

onMounted(async () => {
  storeBanner.clearForm();
  if (route.params.id) {
    await storeBanner.fetchDataForm(
      Number(route.params.id),
      route.params.action
    );
  }
});
</script>

<template>
  <div>
    <VCard>
      <VCardText>
        <VRow>
          <VCol>
            <HeaderAlertView sub-title="Formulario Banner" :action="String($route.params.action)" btn-action="list"
              :validate-crud="true" :btn-back="true" @changeScreenBack="$router.back" />
          </VCol>
        </VRow>
        <VForm ref="formValidation" lazy-validation>
          <VRow>
            <VCol cols="12" sm="3">
              <VFileInput accept="image/*" :rules="[requiredValidator]" :key="archive.key" @change="addFile($event)"
                @click:clear="archive.clearData" :requiredField="true">
                <template #label>
                  Imagen&nbsp;<b class="text-warning">*</b>
                </template>
              </VFileInput>
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12">
              <VImg :src="archive.imageUrl ?? form.path"></VImg>
            </VCol>
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
