<script lang="ts" setup>
definePage({
  name: "Teacher-Order",
  path: "/teacher-Order",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "teacher.index",
  },
});


onMounted(async () => {
})



const submitForm = () => {

}

const loading = reactive({
  form: false
})


interface ITeachers {
  subject_name: string,
  fullName: string,
  jobPosition: string,
  email: string,
  phone: string,
  photo: string,
  backgroundColor: string,
}

const currentTab = ref();

const teachers = ref<ITeachers[]>([])
const typeEducations = ref<{ title: string }[]>([])

const { data, response } = await useApi("pw-teachers/" + 1).get();
if (data.value.code == 200) {
  teachers.value = data.value.teachers;
  typeEducations.value = data.value.typeEducations;
}



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


        <VContainer id="team">
          <div class="our-team">
            <div class="headers d-flex justify-center flex-column align-center">

              <div class="d-flex align-center text-h3 mb-1 flex-wrap justify-center">
                <div class="position-relative me-2">
                  <h3 class="section-title text-center">
                    Ordenar a los docentes
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <VCard>
            <VTabs v-model="currentTab" grow stacked>
              <VTab v-for="(item, index) in typeEducations" :key="index">
                <!-- <VIcon icon="tabler-phone" class="mb-2" /> -->
                <span>{{ item.title }}</span>
              </VTab>
            </VTabs>
            <VCardText>
              <VWindow v-model="currentTab">
                <VWindowItem v-for="(item, index) in typeEducations" :key="index">
                  <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">

                    <template v-if="teachers[item.title]?.length > 0">
                      <DropTeachers :teachers="teachers[item.title]"></DropTeachers>
                    </template>

                  </div>
                </VWindowItem>
              </VWindow>
            </VCardText>
          </VCard>
        </VContainer>

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
