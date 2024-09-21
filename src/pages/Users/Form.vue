<script lang="ts" setup>
definePage({
  name: "Users-Form",
  path: "/user-form/:action/:id?",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "users.index",
  },
});

import { useImageUpload } from "@/composables/useImageUpload";
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { useCrudUserStore } from "@/pages/Users/Store/useCrudUserStore";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { VForm } from "vuetify/components";
const route = useRoute();
const { toast } = useToast();
const formValidation = ref<VForm>();
const authentication = useAuthenticationStore();
const storeUser = useCrudUserStore();
const { form, loading } = storeToRefs(storeUser);
const errors = ref<IErrorsBack>({});
const photo = ref(useImageUpload());
const showPass = ref(false);

const arrayValidation = ref<Array<string | boolean>>([]);

const selectedimage = (e: any) => {
  photo.value.handleImageSelected(e);
};

const submitForm = async () => {
  const validation = await formValidation.value?.validate();
  if (validation?.valid) {
    if (photo.value.imageFile) form.value.photo = photo.value.imageFile;

    const data = await storeUser.fetchSave();
    if (data?.code === 200) {
      arrayValidation.value = [];
      errors.value = {};
      photo.value.clearData();
      await formValidation.value?.resetValidation();
    }
    if (data?.code === 422) errors.value = data.errors ?? {}; // muestra error del back
  } else {
    toast("Faltan Campos Por Diligenciar", "", "danger");
  }
};

// watch(
//   form,
//   (newValue, oldValue) => {
//     if (!newValue.id)
//       arrayValidation.value.password = [requiredValidator(newValue.password)];
//     // arrayValidation.value["photo"] =[requiredValidator(photo.value.imageUrl)]
//     else arrayValidation.value.password = [];

//     // arrayValidation.value["photo"] = []
//   },
//   { deep: true }
// );

onMounted(async () => {
  storeUser.clearForm();
  await storeUser.fetchDataForm(Number(route.params.id), route.params.action);
});
</script>

<template>
  <div>
    <VCard>
      <VCardText>
        <VRow>
          <VCol>
            <HeaderAlertView sub-title="form de usuario" :action="String($route.params.action)" btn-action="list"
              :validate-crud="true" :btn-back="true" @changeScreenBack="$router.back" />
          </VCol>
        </VRow>
        <VForm ref="formValidation" lazy-validation>
          <VRow>
            <VCol cols="12" md="4">
              <AppTextField clearable v-model="form.email" :rules="[requiredValidator, emailValidator]"
                autocomplete="off" :error-messages="errors.email" label="Email" @keypress="errors.email = ''"
                :requiredField="true">
              </AppTextField>
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField clearable v-model="form.password" :rules="arrayValidation.password" autocomplete="off"
                :type="showPass ? 'text' : 'password'" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :error-messages="errors.password" label="Contraseña" @click:append="showPass = !showPass"
                @keypress="errors.password = ''" :requiredField="true">
              </AppTextField>
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField clearable v-model="form.name" :rules="[requiredValidator]" :error-messages="errors.name"
                label="Nombre" @keypress="errors.name = ''" :requiredField="true">
              </AppTextField>
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField clearable v-model="form.last_name" :rules="[requiredValidator]"
                :error-messages="errors.last_name" label="Apellido" @keypress="errors.last_name = ''"
                :requiredField="true">
              </AppTextField>
            </VCol>

            <VCol cols="12" md="4">
              <VLabel>Foto&nbsp; <b class="text-warning">*</b></VLabel>
              <VFileInput :key="photo.key" show-size counter accept="image/*" @change="selectedimage($event)">
              </VFileInput>
            </VCol>
            <VCol cols="12">
              <VImg contain :src="photo.imageUrl ?? form.photo" alt="foto Personal" :max-width="200"
                class="mx-auto img-fluid" />
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
