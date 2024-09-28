<script lang="ts" setup>
definePage({
  name: "DashboardStudent",
  path: "/dashboard/student",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
  },
});


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


const loading = reactive({
  btnPdf: false
})
const openPdfPreview = async (obj: object) => {

  loading.btnPdf = true
  const { data, response } = await useApi(`pw-pdfNote/${obj.id}`).get();
  loading.btnPdf = false

  if (response.value?.ok && data.value) {
    openPdfBase64(data.value.pdf)
  }

}


//ModalChangePassword 
const refModalChangePassword = ref()

const openModalPassword = () => {
  refModalChangePassword.value.openDialog(user.value.id, user.value.first_time)
}


onMounted(() => {
  if (user.value.first_time) {
    refModalChangePassword.value.openDialog(user.value.id, user.value.first_time)

  }
})

const passwordSaved = () => {
  user.value.first_time = 0
}


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
            {{ user.id }}
            <VCardTitle>¡Bienvenido! 🎉</VCardTitle>
          </VCardItem>

          <VCardText>
            ¡Nos alegra mucho verte aquí! Tu viaje en nuestra plataforma comienza ahora y estamos emocionados de
            acompañarte
            en cada paso.
          </VCardText>
          <VCardText>
            Explora tu perfil y descubre todas las herramientas y recursos que hemos preparado para ti. Si tienes alguna
            pregunta o necesitas asistencia, no dudes en
            <a href="/support" class="text-decoration-none">contactarnos</a>. ¡Estamos aquí para ayudarte a alcanzar tus
            metas!
          </VCardText>

          <VCardText>
            <VDivider />
          </VCardText>

          <VCardText class="d-flex justify-center">
            <div class="me-auto pe-4">
              <p class="d-flex align-center mb-6">
                <VBtn :loading="loading.btnPdf" @click="openPdfPreview(user)" :disabled="!user.pdf" variant="outlined">
                  <VIcon icon="tabler-download"></VIcon>
                  <span>Descargar Notas</span>
                </VBtn>
              </p>

              <p class="d-flex align-center mb-0">
                <VBtn disabled variant="outlined">
                  <VIcon icon="tabler-download"></VIcon>
                  <span>Descargar Boletin</span>
                </VBtn>
              </p>
            </div>

            <VDivider v-if="$vuetify.display.smAndUp" vertical inset />

            <div class="ms-auto ps-4">
              <p class="d-flex align-center mb-6">
                <VBtn disabled variant="outlined">
                  <VIcon icon="tabler-address-book"></VIcon>
                  <span>Contactanos</span>
                </VBtn>


              </p>

              <p class="d-flex align-center mb-0">
                <VBtn variant="outlined" @click="openModalPassword()">
                  <VIcon icon="tabler-lock-open"></VIcon>
                  <span>Cambiar contraseña</span>
                </VBtn>
              </p>
            </div>
          </VCardText>
        </VCol>


      </VRow>
    </VCard>



    <VCard class="mb-6" outlined>
      <VCardTitle class="d-flex justify-center">
        <h2>Planificaciones {{ user.type_education_name }} {{ user.grade_name }} {{ user.section_name }}</h2>
      </VCardTitle>
      <VCardText>
        <div v-if="user.teacherPlannings?.length > 0" class="mt-3">
          <PlanningGradeSectionTeachers :school_id="user.company_id" :grade_id="user.grade_id"
            :section_id="user.section_id" />
        </div>
        <div v-else>
          <p>No hay planificaciones disponibles para este estudiante.</p>
        </div>
      </VCardText>
    </VCard>

    <ModalChangePassword ref="refModalChangePassword" @execute="passwordSaved" />

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
