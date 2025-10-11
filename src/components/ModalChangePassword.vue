<script setup lang="ts">
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import type { VForm } from "vuetify/components/VForm";

import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
const authenticationStore = useAuthenticationStore();

const errorsBack = ref<IErrorsBack>({});
const emit = defineEmits(["execute"]);
const { toast } = useToast();

const componentData = reactive({
  titleDialog: "Cambiar contraseña",
  isDialogVisible: false,
  isLoading: false,
  first_time: false,
  statuses: [],
  form: {
    id: null as null | string | number,
    new_password: "",
  },
});

const handleClearForm = () => {
  componentData.form = {
    id: null,
    new_password: "",
  };

  errorsBack.value = {}
  isPasswordVisible.value = false

};

const handleDialogVisible = () => {
  componentData.isDialogVisible = !componentData.isDialogVisible;
};

const openDialog = async (id: null | number | string) => {
  handleClearForm();
  handleDialogVisible();

  componentData.form.id = id;
};

const submitForm = async () => {
  const validation = await refForm.value?.validate();

  if (validation?.valid) {

    componentData.isLoading = true;

    const { response, data } = await useApi(`/user/changePassword`).post({
      id: componentData.form.id,
      new_password: componentData.form.new_password,
      type_user: authenticationStore.user.type_user,
    });
    componentData.isLoading = false;

    if (response.value?.ok && data.value?.code == 200) {
      handleDialogVisible();

      emit("execute");
    }

    if (data.value.code == 422) {
      errorsBack.value = data.value.errors ?? {}
    }
  }
};

const refForm = ref<VForm>();

defineExpose({
  openDialog,
});

const isPasswordVisible = ref(false);

</script>

<template>
  <div>
    <VDialog v-model="componentData.isDialogVisible" persistent max-width="40rem" transition="dialog-transition">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="handleDialogVisible()" v-if="!componentData.first_time" />
      <!-- Toolbar -->
      <div>
        <VToolbar color="primary">
          <VToolbarTitle>{{ componentData.titleDialog }}</VToolbarTitle>
        </VToolbar>
      </div>
      <VCard>
        <VCardText>
          <VForm ref="refForm" @submit.prevent="() => { }">
            <VRow>
              <VCol cols="12" v-if="componentData.first_time">
                <h4>¡Bienvenido! Como es tu primera vez ingresando al sistema, es necesario que cambies tu contraseña.
                  Por favor, elige una nueva contraseña que sea segura y fácil de recordar.</h4>

              </VCol>
              <VCol cols="12">
                <AppTextField clearable v-model="componentData.form.new_password" label="Contraseña"
                  placeholder="············" :type="isPasswordVisible ? 'text' : 'password'" :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                    " @click:append-inner="isPasswordVisible = !isPasswordVisible" :rules="[requiredValidator]"
                  :error-messages="errorsBack.new_password" @input="errorsBack.new_password = ''" />
              </VCol>
              <VCol cols="12">
                <span>
                  Requisitos de la Contraseña:

                  Mínimo de 8 caracteres.
                  Debe incluir al menos:
                  Una letra mayúscula (A-Z)
                  Una letra minúscula (a-z)
                  Un número (0-9)
                  Asegúrate de que la nueva contraseña no sea igual a la contraseña actual.

                </span>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn v-if="!componentData.first_time" :loading="componentData.isLoading" color="secondary" variant="tonal"
            @click="handleDialogVisible()">
            <VIcon start icon="tabler-x" />
            Cancelar
          </VBtn>
          <VBtn :disabled="componentData.isLoading" :loading="componentData.isLoading" @click="submitForm()"
            color="primary">
            <VIcon start icon="tabler-device-floppy" />
            Cambiar contraseña
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
