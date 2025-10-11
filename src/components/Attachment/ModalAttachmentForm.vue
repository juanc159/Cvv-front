<script setup lang="ts">
import type { VForm } from "vuetify/components/VForm"; 

const emits = defineEmits(["saveData"]);

const { toast } = useToast();

const { model_type, model_id } = defineProps({
  model_type: {
    type: String,
    required: true,
  },
  model_id: {
    type: String,
    required: true,
  },
})

const componentData = reactive({
  isDialogVisible: false,
  isLoading: false,
  attachmentTypes: [],
  form: {
    id: null as string | null,
    filename: null as string | null,
    fileable_id: null as string | null,
    fileable_type: null as string | null,
    file: null as null | File,
    attachment_type_id: null as string | null,
    attachment_type_name: null as string | null,
  }
});


const handleIsDialogVisible = () => {
  componentData.isDialogVisible = !componentData.isDialogVisible;
};

const handleClearForm = (): void => {
  componentData.form.id = null
  componentData.form.filename = null
  componentData.form.file = null
  componentData.form.attachment_type_id = null
  componentData.form.attachment_type_name = null
};

const setFormCreate = async () => {
  handleClearForm();
  componentData.isLoading = true;
  const { response, data } = await useApi(`attachment/create`).get();
  componentData.isLoading = false;

  if (response.value?.ok) {
    componentData.attachmentTypes = data.value?.attachmentTypes;
    handleIsDialogVisible();
  }
};

const setFormEdit = async (id: string) => {
  handleClearForm();
  componentData.isLoading = true;
  const { response, data } = await useApi(`attachment/${id}/edit`).get();
  componentData.isLoading = false;

  if (response.value?.ok) {
    componentData.form = data.value.form;
    componentData.form.fileable_id = model_id;
    componentData.form.fileable_type = model_type;
    componentData.attachmentTypes = data.value.attachmentTypes;

    handleIsDialogVisible();
  }
};

const handleSubmit = async () => {
  const validation = await refForm.value?.validate();
  if (validation?.valid) {

    if (inputFile.value.imageFile) componentData.form.file = inputFile.value.imageFile

    const formData = new FormData();

    for (const key in componentData.form) {
      if (componentData.form.hasOwnProperty(key)) {
        formData.append(key, componentData.form[key]);
      }
    }

    formData.append("fileable_id", model_id);
    formData.append("fileable_type", model_type);


    let responseApi = {} as any

    if (!componentData.form.id) {
      componentData.isLoading = true;
      responseApi = await useApi(`/attachment/store`).post(formData);
      componentData.isLoading = false;
    } else {
      componentData.isLoading = true;
      responseApi = await useApi(`/attachment/update/${componentData.form.id}`).post(formData);
      componentData.isLoading = false;
    }

    if (responseApi.response.value?.ok && responseApi.data.value) {
      handleIsDialogVisible();
      emits("saveData")
    }

  } else {
    toast("Faltan campos por diligenciar", "", "danger");
  }
};

//File 
const inputFile = ref(useFileUpload())
inputFile.value.allowedExtensions = ["jpg", "jpeg", "png", "doc", "docx", "xls", "xlsx", "pdf"];
watch(inputFile.value, (newVal, oldVal) => {
  if (newVal.imageFile) componentData.form.file = newVal.imageFile
})

defineExpose({
  setFormCreate,
  setFormEdit,
  handleIsDialogVisible,
  componentData
});

const refForm = ref<VForm>();
</script>
<template>
  <VDialog v-model="componentData.isDialogVisible" max-width="40rem" persistent>
    <DialogCloseBtn @click="handleIsDialogVisible()" />
    <VCard :title="`${componentData.form.id ? 'Editar' : 'Subir'} archivo`" :loading="componentData.isLoading"> 
      <VCardText> 
        <VForm @submit.prevent="" ref="refForm">
          <VRow>
            <VCol cols="12">
              <AppFileInput :requiredField="componentData.form.id ? false : true" clearable :loading="inputFile.loading"
                label="Seleccione un archivo" @change="inputFile.handleImageSelected" :key="inputFile.key"
                :rules="[componentData.form.id ? true : requiredValidator]"></AppFileInput>

            </VCol>
            <VCol cols="12">
              <AppTextField :requiredField="true" label="Nombre del archivo" v-model="componentData.form.filename"
                clearable :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12">
              <!-- <AppTextField :requiredField="true" label="Tipo de archivo" v-model="componentData.form.attachment_type_name"
              clearable :rules="[requiredValidator]" /> -->

              <!-- <AppAutocomplete :requiredField="true" label="Tipo de archivo" v-model="componentData.form.attachment_type_id"
                :items="componentData.attachmentTypes" clearable :rules="[requiredValidator]" /> -->
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      <VCardText class="d-flex justify-end">
        <VBtn variant="flat" color="secondary" class="mr-3" @click="handleIsDialogVisible()" :loading="componentData.isLoading" :disabled="componentData.isLoading">
          <VIcon start icon="tabler-x" />
          Cancelar
        </VBtn>
        <VBtn variant="flat" @click="handleSubmit()" :loading="componentData.isLoading" :disabled="componentData.isLoading">
          <VIcon start icon="tabler-device-floppy" />
          Guardar cambios
        </VBtn>
      </VCardText> 
    </VCard>
  </VDialog>
</template>
