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

import { useImageUpload } from "@/composables/useImageUpload";
import { VForm } from "vuetify/components";
import { VDataTable } from "vuetify/labs/VDataTable";

const route = useRoute();
const { toast } = useToast();
const formValidation = ref<VForm>();
const fileValidation = ref<VForm>();

const arrayValidation = ref<Array<string | boolean>>([]);

// File
const archive = ref(useImageUpload());
const aExtImage = ["jpg", "jpeg", "png", "pdf", "ppsx", "pptx"];
archive.value.allowedExtensions = aExtImage;

const submitForm = async () => {

  const formData = new FormData()

  formData.append("teacher_id", JSON.stringify(teacher.value.id))

  teacher.value.complementaries.forEach(element => {

    let cant = 0

    element.subjects.forEach(element2 => {

      element2.files.forEach((element3, key) => {





        formData.append("file_id_" + cant, element3.id)
        formData.append("file_grade_id_" + cant, element.grade_id)
        formData.append("file_section_id_" + cant, element.section_id)
        formData.append("file_subject_id_" + cant, element2.value)
        formData.append("file_file_" + cant, element3.file)
        formData.append("file_name_" + cant, element3.name)
        formData.append("file_delete_" + cant, element3.delete)

        cant++

      });


    });

    formData.append("files_cant", cant)

  });

  loading.form = true
  await useApi('/teacher-planningStore/').post(formData)
  loading.form = false


}


const loading = reactive({
  form: false
})
const teacher = ref()

const dynamicVariables = reactive({});

onMounted(async () => {

  loading.form = true
  const { data, response, error, isFetching } = await useApi('/teacher-planning/' + route.params.id).get()
  loading.form = isFetching.value


  if (response.value?.ok && data.value) {
    teacher.value = data.value.data

    teacher.value.complementaries.forEach(element => {

      element.subjects.forEach(element2 => {

        dynamicVariables['file-' + element2.value] = ref(useImageUpload());

        dynamicVariables['file-' + element2.value].allowedExtensions = ["jpg", "jpeg", "png", "pdf", "ppsx", "pptx"]

      });
    });
  }
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
    delete: 0,
  })

  dynamicVariables['file-' + obj.value].clearData()
};


const deleteFile = (obj: object, index: number, value: number) => {
  obj[index].delete = value;
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

        <VCardText v-if="teacher">

          <VRow>
            <VCol cols="12" sm="6">
              <h2>{{ teacher?.name }} {{ teacher?.last_name }}</h2>
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12" v-for="(grade, index) in teacher.complementaries" :key="index">
              <h2>Grado: {{ grade.grade_name }} {{ grade.section_name }}</h2>

              <div v-for="(subject, indexS) in grade.subjects" :key="indexS">
                <h3>Planificacion: {{ subject.title }}</h3>

                <VForm lazy-validation>
                  <VRow>
                    <VCol cols="12" sm="6">
                      <AppTextField clearable v-model="dynamicVariables['file-' + subject.value].name"
                        :rules="[requiredValidator]" label="Titulo" :requiredField="true">
                      </AppTextField>
                    </VCol>
                    <VCol cols="12" sm="3">
                      <VLabel>Archivo&nbsp;<b class="text-warning">*</b></VLabel>
                      <VFileInput :rules="[requiredValidator]"
                        @change="dynamicVariables['file-' + subject.value].handleImageSelected"
                        :key="dynamicVariables['file-' + subject.value].key"
                        @click:clear="dynamicVariables['file-' + subject.value].clearData">
                      </VFileInput>
                    </VCol>
                    <VCol cols="12" sm="3">
                      <VBtn size="30" class="mt-6" icon color="success" @click="addFile(subject)">
                        <VIcon icon="tabler-plus"></VIcon>
                      </VBtn>
                    </VCol>

                    <VCol cols="12">
                      <VDataTable :headers="headersFile" :items="subject.files" :items-per-page="999">

                        <template #item.actions="{ item, index }">
                          <span v-if="item.delete">
                            Sera eliminado al guardar, <b style="cursor: pointer;"
                              @click="deleteFile(subject.files, index, 0)">restaurar</b>
                          </span>
                          <VBtn v-else icon size="x-small" color="error" variant="text"
                            @click="deleteFile(subject.files, index, 1)">
                            <VIcon size="22" icon="tabler-trash" />
                            <VTooltip location="top" transition="scale-transition" activator="parent" text="Eliminar">
                            </VTooltip>
                          </VBtn>
                        </template>
                        <template #bottom>
                        </template>
                      </VDataTable>
                    </VCol>
                  </VRow>
                </VForm>
              </div>
            </VCol>
          </VRow>
        </VCardText>

        <VRow>
          <VCol cols="12" class="d-flex justify-center">
            <VBtn :loading="loading.form" color="primary" @click="submitForm">
              Guardar
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>
</template>
 