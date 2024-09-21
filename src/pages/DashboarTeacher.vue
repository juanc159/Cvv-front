<script lang="ts" setup>
definePage({
  name: "DashboardTeacher",
  path: "/dashboard/teacher",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
  },
});

import { VDataTable } from "vuetify/labs/VDataTable";

import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

const authenticationStore = useAuthenticationStore();

const { company, user } = storeToRefs(authenticationStore);

const avatarData = computed(() => {
  // Asegúrate de que `full_name` no esté vacío
  const fullName = authenticationStore.user?.full_name || '';
  // Si `full_name` no está vacío, procesar las iniciales
  if (fullName) {
    return fullName
  }

  return 'S/N'; // Retorna 'A' si `full_name` está vacío
});

const headersFile = [
  { title: "Título", key: "name", sortable: false },
];



const loading = reactive({
  form: false
})
const teacher = ref()

onMounted(async () => {

  loading.form = true
  const { data, response, error, isFetching } = await useApi('/teacher-planningShow/' + authenticationStore.user?.id).get()
  loading.form = isFetching.value


  if (response.value?.ok && data.value) {
    teacher.value = data.value.data
  }
})


</script>
<template>
  <div>

    <VCard class="mb-6">
      <VCardTitle class="d-flex justify-center align-center title-container">
        <h3 class="title-text">{{ user.full_name }}</h3>
      </VCardTitle>
      <VRow>
        <VCol cols="12" sm="4" md="12" lg="5" class="member-pricing-bg text-center">
          <div class="membership-pricing d-flex flex-column align-center   h-100 justify-center">
            <VAvatar v-if="authenticationStore.user?.photo" color="primary" variant="tonal" size="250">
              <VImg :src="authenticationStore.user?.photo" />
            </VAvatar>

            <VAvatar v-else color="primary" variant="tonal" size="50">
              {{ avatarText(avatarData) }}
            </VAvatar>
          </div>
        </VCol>


        <VCol cols="12" sm="8" md="12" lg="7">
          <VCardItem>
            <VCardTitle>¡Bienvenido! 🎉</VCardTitle>
          </VCardItem>

          <VCardText>
            Estimado profesor,

            En esta sección puede consultar todo lo relacionado con su planificación. Se agradece que revise
            cuidadosamente y, ante cualquier novedad, informe.

            Muchas gracias.
          </VCardText>

          <VCardText>
            <VDivider />
          </VCardText>

        </VCol>


      </VRow>
    </VCard>



    <VCard class="mb-6" outlined>
      <VCardTitle class="d-flex justify-center">
        <h2>Planificaciones </h2>
      </VCardTitle>

      <VCardText v-if="teacher">

        <VRow>
          <VCol cols="12" sm="6">
            <h2>{{ teacher?.name }} {{ teacher?.last_name }}</h2>
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12" v-for="(grade, index) in teacher.complementaries" :key="index">
            <VCard>
              <VCardTitle primary-title>
                <h2>Grado: {{ grade.grade_name }} {{ grade.section_name }}</h2>
              </VCardTitle>
              <VCardText>

                <div v-for="(subject, indexS) in grade.subjects" :key="indexS">
                  <h3>Planificacion: {{ subject.title }}</h3>

                  <VRow>
                    <VCol cols="12">
                      <VDataTable :headers="headersFile" :items="subject.files" :items-per-page="999">

                        <template #item.name="{ item, index }">
                          <div class="d-flex align-center py-1">
                            <VIcon icon="tabler-file" color="primary" />
                            <a href="#" @click="descargarArchivo(item.file, item.name)"> <b>{{ item.name }}</b></a>
                          </div>
                        </template>


                        <template #bottom>
                        </template>
                      </VDataTable>
                    </VCol>
                  </VRow>
                </div>
              </VCardText>
            </VCard>


          </VCol>
        </VRow>
      </VCardText>
    </VCard>

  </div>
</template>

<style lang="scss" scoped>
.title-container {
  padding: 16px;

  /* Espacio alrededor del título */
  text-align: center;

  /* Alinear el texto al centro */
}

.title-text {
  overflow: hidden;

  /* Ocultar el desbordamiento */
  margin: 0;

  /* Eliminar márgenes por defecto */
  font-size: 2rem;

  /* Tamaño de fuente predeterminado */
  text-overflow: ellipsis;

  /* Mostrar puntos suspensivos si el texto es largo */
  white-space: nowrap;

  /* Evitar el salto de línea en pantallas pequeñas */
}

/* Ajuste de tamaño de fuente para pantallas pequeñas */
@media (max-width: 600px) {
  .title-text {
    font-size: 1.5rem;

    /* Tamaño de fuente más pequeño en pantallas pequeñas */
  }
}
</style>
