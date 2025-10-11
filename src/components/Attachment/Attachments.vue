<script setup lang="ts">
import ModalAttachmentForm from "@/components/Attachment/ModalAttachmentForm.vue";
import ModalQuestion from "@/components/ModalQuestion.vue";

const { toast } = useToast();
const { model, id } = defineProps({
  model: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
})

const componentData = reactive({
  isLoading: false,
  files: [] as Array<{
    pathname: string
    filename: string
    type_file: string
    created_at: string
  }>,
});



const getFiles = async () => {
  componentData.isLoading = true;
  const { data, response } = await useApi<any>(
    createUrl(`/attachment/list`, {
      query: {
        fileable_type: model, fileable_id: id
      },
    })
  );

  componentData.isLoading = false;

  if (response.value?.ok) {
    componentData.files = data.value.tableData;
  }
};

const changeStatus = async (
  obj: object,
  field: string,
  value: any
) => {
  const { data, response } = await useApi(`/attachment/changeStatus`).post({
    id: obj.id,
    value: value,
    field: field,
  });
  if (data.value.code === 200) toast("Éxito", data.value.message, "success");
};


const viewFile = (pathname: any) => {
  window.open(
    `${import.meta.env.VITE_API_BASE_BACK}/storage/${pathname}`,
    "_blank"
  );
};

const deleteData = async (id: any) => {
  const { data, response } = await useApi(`/attachment/delete/${id}`).delete();
  await getFiles();
}


//ModalAttachmentForm
const refModalAttachmentForm = ref()


//ModalQuestion
const refModalQuestion = ref()

onMounted(() => {
  getFiles();
});
</script>

<template>
  <div>

    <VCard :loading="componentData.isLoading">
      <VCardTitle>
        <VBtn color="success" @click="refModalAttachmentForm?.setFormCreate()">
          Cargar archivo
        </VBtn>
      </VCardTitle>

      <VCardText>

        <VSkeletonLoader type="image, list-item-two-line" :loading="componentData.isLoading" class="mt-5">
          <p v-show="componentData.files.length < 1">
            No se encontraros archivos
          </p>

          <VRow>
            <VCol cols="12" md="4" v-for="(file, index) in componentData.files" :key="index">
              <VCard>
                <VCardText>
                  <VRow>
                    <VCol cols="12" md="6">
                      <h4>
                        <a href="#" @click="viewFile(file.pathname)">
                          <!-- <a href="#" @click="downloadFileV2(file.pathname, file.filename)"> -->
                          <u>
                            {{ file.filename }}
                          </u>
                        </a>
                      </h4>
                      <h5>
                        {{ file.type_file }}
                      </h5>
                    </VCol>
                  </VRow>
                </VCardText>
                <VCardText>
                  <VRow cols="12" md="6">
                    <VCol> <b>Fecha de creación:</b> {{ file.created_at }} </VCol>
                    <VCol class="d-flex justify-end align-center" cols="12" md="6">
                      <VBtn size="small" @click="refModalAttachmentForm?.setFormEdit(file.id)">
                        <VIcon icon="tabler-pencil" />
                      </VBtn>
                      <VBtn size="small" color="error" class="ml-3" @click="refModalQuestion?.openModal(file.id)">
                        <VIcon icon="tabler-trash" />
                      </VBtn>
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VSkeletonLoader>
      </VCardText>
    </VCard>


    <ModalAttachmentForm ref="refModalAttachmentForm" @saveData="getFiles" :model_type="model" :model_id="id" />
    <ModalQuestion ref="refModalQuestion" @success="deleteData" />

  </div>
</template>
