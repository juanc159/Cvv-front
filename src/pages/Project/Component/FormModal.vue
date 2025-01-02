<script setup lang="ts">
import { useToast } from '@/composables/useToast';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import type { VForm } from 'vuetify/components/VForm';

const emit = defineEmits<{
  (e: "reloadTable"): void;
}>();
const refForm = ref<VForm>()
const authenticationStore = useAuthenticationStore();
const { toast } = useToast()

const titleDialog = ref<string>("Proyecto")

const form = ref({
  id: null as string | null,
  name: null as string | null,
  user_id: null as string | null,
  company_id: null as string | null,
});

const loading = reactive({
  form: false,
});

const isDialogVisible = ref<boolean>(false);
const fieldsDisableds = ref<boolean>(false);

const handleClearForm = () => {
  for (const key in form.value) {
    form.value[key] = null;
  }
};

const handleDialogVisible = () => {
  isDialogVisible.value = !isDialogVisible.value;
};


const openDialog = async (objData: any) => {
  handleClearForm();
  handleDialogVisible();

  fieldsDisableds.value = objData.action === "view" ? true : false;

  if (objData.id) {
    titleDialog.value = "Editar Proyecto"
    loading.form = true;
    const { data, response } = await useApi(`/project/${objData.id}/edit`).get()
    loading.form = false;

    if (response.value?.ok && data.value) {
      form.value = data.value.form
    }
  }
  else {
    titleDialog.value = "Nuevo Proyecto"
  }

};

const submitForm = async () => {
  const validation = await refForm.value?.validate()
  if (validation?.valid) {

    form.value.user_id = authenticationStore.user.id
    form.value.company_id = authenticationStore.company.id

    const url = form.value.id ? `/project/update/${form.value.id}` : `/project/store`

    loading.form = true;
    const { data, response } = await useApi(url).post(form.value);
    loading.form = false;

    if (response.value?.ok && data.value) {
      handleDialogVisible()
      emit('reloadTable')
    }

  }
  else {
    toast('Faltan Campos Por Diligenciar', '', 'danger')
  }
}

defineExpose({
  openDialog,
});

</script>

<template>

  <VDialog v-model="isDialogVisible" persistent max-width="40rem" transition="dialog-transition">

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="handleDialogVisible()" />

    <!-- Toolbar -->
    <div>
      <VToolbar color="primary">
        <VToolbarTitle>{{ titleDialog }}</VToolbarTitle>
      </VToolbar>
    </div>
    <VCard>
      <VCardText>
        <VForm ref="refForm" @submit.prevent="() => { }">
          <VRow>
            <VCol cols="12">
              <AppTextField clearable v-model="form.name" :rules="[requiredValidator]" label="Nombre"
                :requiredField="true" :disabled="fieldsDisableds">
              </AppTextField>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>

      <VCardText class="d-flex justify-end gap-3 flex-wrap">
        <VBtn :disabled="loading.form" :loading="loading.form" @click="handleDialogVisible" color="secondary">
          Cancelar
        </VBtn>
        <VBtn :disabled="loading.form" :loading="loading.form" color="primary" @click="submitForm()">
          Guardar
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
