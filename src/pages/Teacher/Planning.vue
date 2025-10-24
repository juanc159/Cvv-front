<script lang="ts" setup>

definePage({
  name: "Teacher-Planning",
  path: "/teacher-Planning/:id?",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "teacher.index",

  },
});

import { VForm } from "vuetify/components";

const route = useRoute();
const { toast } = useToast();
const formValidation = ref<VForm>();
const fileValidation = ref<VForm>();

const arrayValidation = ref<Array<string | boolean>>([]);

// File
const archive = ref(useFileUpload());
const aExtImage = ["jpg", "jpeg", "png", "pdf", "ppsx", "pptx"];
archive.value.allowedExtensions = aExtImage;

const submitForm = async () => {

  const formData = new FormData()

  formData.append("teacher_id", teacher.value.id)

  let cant = 0
  teacher.value.complementaries.forEach(element => {
    element.subjects.forEach(element2 => {

      element2.files.forEach((element3, key) => {

        formData.append("file_id_" + cant, element3.id)
        formData.append("file_grade_id_" + cant, element.grade_id)
        formData.append("file_section_id_" + cant, element.section_id)
        formData.append("file_subject_id_" + cant, element2.value)
        formData.append("file_file_" + cant, element3.file)
        formData.append("file_name_" + cant, element3.name)

        cant++
      });
    });

    formData.append("files_cant", cant)

  });

  loading.form = true
  const { data, response } = await useApi('/teacher-planningStore').post(formData)
  loading.form = false

  if (response.value?.ok && data.value) {
    teacher.value = data.value.data

    teacher.value.complementaries.forEach(element => {

      element.subjects.forEach(element2 => {

        dynamicVariables['file-' + element2.value] = ref(useFileUpload());

        dynamicVariables['file-' + element2.value].allowedExtensions = ["jpg", "jpeg", "png", "pdf", "ppsx", "pptx"]

      });
    });
  }

}


const loading = reactive({
  form: false
})
const teacher = ref()

const dynamicVariables = reactive({});

onMounted(async () => {

  loading.form = true
  const { data, response, error, isFetching } = await useApi('/teacher-planning/' + route.params.id).get()


  if (response.value?.ok && data.value) {
    teacher.value = data.value.data

    teacher.value.complementaries.forEach(element => {

      element.subjects.forEach(element2 => {

        dynamicVariables['file-' + element2.value] = ref(useFileUpload());

        dynamicVariables['file-' + element2.value].allowedExtensions = ["jpg", "jpeg", "png", "pdf", "ppsx", "pptx"]

      });
    });
  }
  loading.form = false

})



//documentos 
const headersFile = [
  { title: "Título", key: "name" },
  { title: "Acciones", key: "actions" },
];


const addFile = async (obj: object) => {
  obj.files.push({
    name: dynamicVariables['file-' + obj.value].name,
    file: dynamicVariables['file-' + obj.value].imageFile,
    id: null,
  })

  dynamicVariables['file-' + obj.value].clearData()
};


const deleteFile = (obj: object, index: number, value: number) => {
  obj.splice(index, 1);
};

</script>

<template>
  <div>
    <VCard>
      <VCardText>
        <VRow>
          <VCol>
            <HeaderAlertView sub-title="Formulario Teacher planificacion" btn-action="list" :validate-crud="true"
              :btn-back="true" @changeScreenBack="$router.back" />
          </VCol>
        </VRow>

        <VCardText>
          <VSkeletonLoader type="image, list-item-two-line" :loading="loading.form" class="mt-5">
            <VRow>
              <VCol cols="12" sm="6">
                <h2>{{ teacher?.name }} {{ teacher?.last_name }}</h2>
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12" v-for="(grade, index) in teacher?.complementaries" :key="index">
                <VCard>
                  <VCardTitle primary-title>
                    <h2>Grado: {{ grade.grade_name }} {{ grade.section_name }}</h2>
                  </VCardTitle>
                  <VCardText>

                    <div v-for="(subject, indexS) in grade.subjects" :key="indexS">
                      <h3>Planificacion: {{ subject.title }}</h3>

                      <VForm lazy-validation>
                        <VRow>
                          <VCol cols="12" sm="6">
                            <AppTextField clearable v-model="dynamicVariables['file-' + subject.value].name"
                              :rules="[requiredValidator]" label="Titulo" :requiredField="true">
                            </AppTextField>
                          </VCol>
                          <VCol cols="12" sm="5">
                            <VLabel>Archivo&nbsp;<b class="text-warning">*</b></VLabel>
                            <VFileInput :rules="[requiredValidator]"
                              @change="dynamicVariables['file-' + subject.value].handleImageSelected"
                              :key="dynamicVariables['file-' + subject.value].key"
                              @click:clear="dynamicVariables['file-' + subject.value].clearData">
                            </VFileInput>
                          </VCol>
                          <VCol cols="12" sm="1">
                            <VBtn size="30" class="mt-6" icon color="success" @click="addFile(subject)">
                              <VIcon icon="tabler-plus"></VIcon>
                            </VBtn>
                          </VCol>

                          <VCol cols="12">
                            <VDataTable :headers="headersFile" :items="subject.files" :items-per-page="999">

                              <template #item.actions="{ item, index }">
                                <div>
                                  <VBtn v-if="item.id" icon size="x-small" color="primary" variant="text"
                                    @click="descargarArchivo(storageBack(item.file), item.name)">
                                    <VIcon size="22" icon="tabler-eye" />
                                    <VTooltip location="top" transition="scale-transition" activator="parent"
                                      text="Visualizar">
                                    </VTooltip>
                                  </VBtn>
                                  <VBtn icon size="x-small" color="error" variant="text"
                                    @click="deleteFile(subject.files, index, 1)">
                                    <VIcon size="22" icon="tabler-trash" />
                                    <VTooltip location="top" transition="scale-transition" activator="parent"
                                      text="Eliminar">
                                    </VTooltip>
                                  </VBtn>
                                </div>

                              </template>
                              <template #bottom>
                              </template>
                            </VDataTable>
                          </VCol>
                        </VRow>
                      </VForm>
                    </div>
                  </VCardText>
                </VCard>


              </VCol>
            </VRow>
          </VSkeletonLoader>
        </VCardText>

        <VRow>
          <VCol cols="12" class="d-flex justify-center">
            <VBtn :loading="loading.form" color="primary" @click="submitForm()">
              Guardar
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
.green-background {
  background-color: rgb(252, 231, 231);
}

.red-background {
  background-color: rgb(236, 247, 255);
}
</style>
