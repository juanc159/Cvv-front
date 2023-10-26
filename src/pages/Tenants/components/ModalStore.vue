<script setup lang="ts">
import { useTenantStore } from "@/pages/Tenants/Store/useTenantStore";
import { VForm } from "vuetify/components/VForm";
const formValidation = ref<VForm>();
const tenantStore = useTenantStore();

const formulario = ref<{
  name: null | string;
}>({
  name: null,
});

const submit = async () => {
  const validation = await formValidation.value?.validate();
  if (validation?.valid) {
    await tenantStore.fetchSave(formulario.value);
    emit("update:isDialogDetailVisible", false);
    await tenantStore.fetchList();
  }
};

const { isDialogDetailVisible } = defineProps({
  isDialogDetailVisible: {
    type: Boolean,
  },
});

const emit = defineEmits(["update:isDialogDetailVisible"]);

watch(formulario.value, (value) => {
  if (formulario.value.name) {
    formulario.value.name = formulario.value.name.replaceAll(" ", "_");
  }
});

const closeModal = () => {
  emit("update:isDialogDetailVisible", false);
};
</script>
<template>
  <div>
    <VDialog :model-value="isDialogDetailVisible" width="500" persistent>
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="closeModal()" />

      <!-- Dialog Content -->
      <VCard title="Nuevo subdominio">
        <VCardText>
          <VForm ref="formValidation">
            <VRow>
              <VCol cols="12">
                <AppTextField
                  v-model="formulario.name"
                  class="mt-1"
                  label="Nombre de tenant a crear"
                  :rules="[requiredValidator]"
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>

        <VCardText class="d-flex justify-end">
          <VBtn
            :loading="tenantStore.loading.form"
            color="secondary"
            class="mr-5"
            @click="closeModal()"
          >
            Cancelar
          </VBtn>
          <VBtn :loading="tenantStore.loading.form" @click="submit()">
            Crear
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
