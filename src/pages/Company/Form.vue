<script lang="ts" setup>
definePage({
  name: "Company-Form",
  path: "/company-form/:action/:id?",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "company.index",
  },
});

import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { useCrudCompanyStore } from "@/pages/Company/Store/useCrudCompanyStore";
import { VForm } from "vuetify/components";

const archive = ref(useImageUpload());

const route = useRoute();
const { toast } = useToast();
const formValidation = ref<VForm>();
const storeCompany = useCrudCompanyStore();
const { form, loading, typeDetails } = storeToRefs(storeCompany);
const errorsBack = ref<IErrorsBack>({});
const arrayValidation = ref<Array<string | boolean>>([]);

const submitForm = async () => {
  const validation = await formValidation.value?.validate();
  if (validation?.valid) {
    const data = await storeCompany.fetchSave();
    if (data?.code === 200) {
      arrayValidation.value = [];
      errorsBack.value = {};
      archive.value.clearData();
      await formValidation.value?.resetValidation();
    }
    if (data?.code === 422) errorsBack.value = data.errors ?? {}; // muestra error del back
  } else {
    toast("Faltan Campos Por Diligenciar", "", "danger");
  }
};

onMounted(async () => {
  storeCompany.clearForm();
  if (route.params.id) {
    await storeCompany.fetchDataForm(
      Number(route.params.id),
      route.params.action
    );
  }
});

//informacion adicional

const details = computed(() => {
  return form.value.arrayDetails.filter((ele) => ele.delete != 1);
});
const addDetail = () => {
  form.value.arrayDetails.push({
    type_detail_id: null,
    icon: null,
    color: null,
    content: null,
    delete: 0,
  });
};
const deleteDetail = (index: number) => {
  if (form.value.arrayDetails[index].id) {
    form.value.arrayDetails[index].delete = 1;
  } else {
    form.value.arrayDetails.splice(index, 1);
  }
};


watch(
  form,
  (newValue, oldValue) => {
    if (!newValue.id) arrayValidation.value.image_principal = [requiredValidator(archive.value.imageUrl)]
    else arrayValidation.value.image_principal = [];
  },
  { deep: true }
);

const addFile = (e: Event) => {
  archive.value.handleImageSelected(e);
  setTimeout(() => {
    form.value.image_principal = archive.value.imageFile;
  }, 1000);
};
</script>

<template>
  <div>
    <HeaderAlertView sub-title="Formulario de compañia" :action="String($route.params.action)" btn-action="list"
      :validate-crud="true" :btn-back="true" @changeScreenBack="$router.back" />
    <VCard>
      <VCardTitle primary-title>Información principal</VCardTitle>
      <VCardText>
        <VRow>
          <VCol> </VCol>
        </VRow>
        <VForm ref="formValidation" lazy-validation>
          <VRow>
            <VCol cols="12" md="4">
              <AppTextField clearable v-model="form.name" :rules="[requiredValidator]" :error-messages="errorsBack.name"
                label="Nombre" @input="errorsBack.name = ''" :requiredField="true">
              </AppTextField>
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField clearable v-model="form.slogan" :rules="[requiredValidator]"
                :error-messages="errorsBack.slogan" label="Eslogan" @input="errorsBack.slogan = ''"
                :requiredField="true">
              </AppTextField>
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField clearable v-model="form.iframeGoogleMap" label="iframeGoogleMap">
              </AppTextField>
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12" sm="3">
              <VFileInput accept="image/*" :key="archive.key" @change="addFile($event)"
                @click:clear="archive.clearData">
                <template #label>
                  Imagen Principal&nbsp;<b class="text-warning">*</b>
                </template>
              </VFileInput>
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12">
              <VCard width="400">
                <VImg :src="archive.imageUrl ?? form.image_principal"></VImg>
              </VCard>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <VCard class="mt-5">
      <VCardTitle primary-title>
        <div class="d-flex justify-space-between">
          <span>Información de adicional</span>
          <VBtn color="success" @click="addDetail()">Agregar</VBtn>
        </div>
      </VCardTitle>
      <VCardText>
        <VRow v-for="(item, index) in details" :key="index">
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
            <VBtn icon size="x-small" color="error" variant="text" class="mt-6" @click="deleteDetail(index)">
              <VIcon icon="tabler-trash"></VIcon>
              <VTooltip location="top" transition="scale-transition" activator="parent" text="Eliminar">
              </VTooltip>
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <VRow class="mt-5">
      <VCol cols="12" class="d-flex justify-center">
        <VBtn :loading="loading.form" color="primary" @click="submitForm()">
          Guardar
        </VBtn>
      </VCol>
    </VRow>
  </div>
</template>
