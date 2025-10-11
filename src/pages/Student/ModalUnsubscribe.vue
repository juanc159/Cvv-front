<script setup lang="ts">
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import type { VForm } from "vuetify/components/VForm";
const emit = defineEmits(["execute"]);
const errorsBack = ref<IErrorsBack>({});
const refForm = ref<VForm>();

const titleModal = ref<string>("Dar de baja")
const isDialogVisible = ref<boolean>(false)

const isLoading = ref<boolean>(false)

const form = ref({
  id: null as null | string,
  date: null as null | string,
  reason: null as null | string,
})

const handleClearForm = () => {
  for (const key in form.value) {
    form.value[key] = null
  }
}

const handleDialogVisible = () => {
  isDialogVisible.value = !isDialogVisible.value;
};

const openModal = async (id: string) => {
  handleClearForm()
  handleDialogVisible();

  form.value.id = id
  await fetchDataForm();
};

const fetchDataForm = async () => {

  const url = `/student/show/${form.value.id}`

  isLoading.value = true
  const { data, response } = await useApi(url).get();

  isLoading.value = false

  if (response.value?.ok && data.value) {
    studentInfo.value = {
      fullName: data.value.student.full_name,
      document: data.value.student.identity_document,
      grade: data.value.student.grade_name,
      section: data.value.student.section_name
    };
  }
}

const submitForm = async (action: string) => {
  const validation = await refForm.value?.validate();

  if (validation?.valid) {

    const url = `/student/withdraw`

    isLoading.value = true
    const { response, data } = await useApi(url).post({
      student_id: form.value.id,
      date: form.value.date,
      reason: form.value.reason
    });
    isLoading.value = false

    if (response.value?.ok && data.value) {
      handleClearForm()
      handleDialogVisible()
      emit("execute");
    }

    if (data.value.code == 422) {
      errorsBack.value = data.value.errors ?? {}
    }
  }
}



//ModalQuestion
const refModalQuestion = ref()

const openModalQuestionSubmit = async () => {
  const validation = await refForm.value?.validate();

  if (validation?.valid) {

    refModalQuestion.value.openModal()
    refModalQuestion.value.componentData.title = "¿Seguro desea dar de baja al estudiante?"
    refModalQuestion.value.componentData.subTitle = "Verifique la información"
  }

}


const studentInfo = ref({
  fullName: '',
  document: '',
  grade: '',
  section: ''
});

defineExpose({
  openModal,
})

</script>

<template>
  <div>
    <VDialog v-model="isDialogVisible" :overlay="false" max-width="50rem" transition="dialog-transition" persistent>
      <DialogCloseBtn @click="handleDialogVisible" />
      <VCard :loading="isLoading" :disabled="isLoading" class="w-100">
        <!-- Toolbar -->
        <div>
          <VToolbar color="primary">
            <VToolbarTitle>{{ titleModal }}</VToolbarTitle>
          </VToolbar>
        </div>



        <VCardText class="pt-4 pb-0">

          <v-alert color="info" variant="tonal" border="start" class="mb-4">
            <div class="student-info">
              <div class="text-h6 mb-2">{{ studentInfo.fullName }}</div>
              <div class="d-flex gap-4">
                <div>
                  <span class="text-caption">Identificación:</span>
                  <span class="font-weight-medium"> {{ studentInfo.document }}</span>
                </div>
                <div>
                  <span class="text-caption">Grado:</span>
                  <span class="font-weight-medium"> {{ studentInfo.grade }}</span>
                </div>
                <div>
                  <span class="text-caption">Sección:</span>
                  <span class="font-weight-medium"> {{ studentInfo.section }}</span>
                </div>
              </div>
            </div>
          </v-alert>
          <VForm ref="refForm">
            <VContainer>
              <VRow>
                <VCol cols="6">
                  <AppDateTimePicker clearable v-model="form.date" label="Fecha" :rules="[requiredValidator]"
                    :requiredField="true" :error-messages="errorsBack.date" @input="errorsBack.date = ''" />
                </VCol>
                <VCol cols="12">
                  <AppTextarea :requiredField="true" :rules="[requiredValidator]" label="Motivo" v-model="form.reason"
                    clearable counter maxlength="255" :error-messages="errorsBack.reason"
                    @input="errorsBack.reason = ''" />
                </VCol>
              </VRow>
            </VContainer>
          </VForm>

        </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap mt-5">
          <VBtn :disabled="isLoading" :loading="isLoading" @click="handleDialogVisible()" color="secondary">
            Cancelar
          </VBtn>
          <VBtn :disabled="isLoading" :loading="isLoading" @click="openModalQuestionSubmit()">
            Guardar
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <ModalQuestion ref="refModalQuestion" @success="submitForm" />

  </div>
</template>
