<script setup lang="ts">

import { router } from "@/plugins/1.router";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import Swal from "sweetalert2";

const authenticationStore = useAuthenticationStore();
const { company, user } = storeToRefs(authenticationStore);

const logout = () => {
  router.push({ name: "Login" });
  authenticationStore.logout()
};

// Solo el Super Administrador puede cerrar todas las sesiones del sistema.
const SUPER_ADMIN_ROLE_ID = "21626ff9-4940-4143-879a-0f75b46eadb7";
const isSuperAdmin = computed(() => user.value?.role_id === SUPER_ADMIN_ROLE_ID);

const revokeAllSessions = async () => {
  const result = await Swal.fire({
    icon: "warning",
    title: "¿Cerrar todas las sesiones?",
    text: "Todos los usuarios (alumnos, docentes y personal) deberán volver a iniciar sesión. Tu sesión actual se mantendrá activa.",
    showCancelButton: true,
    confirmButtonText: "Sí, cerrar todas",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#d33",
  });
  if (!result.isConfirmed) return;

  const { data, response } = await useAxios("/sessions/revoke-all").post({});
  if (response?.status === 200) {
    Swal.fire({
      icon: "success",
      title: "Sesiones cerradas",
      text: data?.message || "Se cerraron todas las sesiones activas.",
      timer: 4000,
      timerProgressBar: true,
    });
  }
};


const avatarData = computed(() => {
  if (user.value) {
    return String(user.value?.name?.split(" ")[0]) + ' ' + String(user.value?.surname?.split(" ")[0]) || "Administrador"
  }
  return ""
})


/* Limpia los datos del storage */
const changeCompany = () => {
  company.value = {};
  authenticationStore.getMenuData;
  router.push({ name: "Company-List" });

};



//ModalChangePassword 
const refModalChangePassword = ref()

const openModalPassword = () => {
  refModalChangePassword.value.openDialog(user.value.id)
}
</script>

<template>
  <VBadge dot location="bottom right" offset-x="3" offset-y="3" bordered color="success">
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <!-- <VImg :src="avatar1" /> -->
      {{ avatarText(user.full_name) }}

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success">
                  <!-- <VAvatar
                    color="primary"
                    variant="tonal"
                  >
                    <VImg :src="avatar1" />
                  </VAvatar> -->

                  <VAvatar color="primary" variant="tonal">
                    {{ avatarText(user.full_name) }}
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ user?.full_name }}
            </VListItemTitle>
            <VListItemSubtitle>
              {{ user?.rol_name }}
            </VListItemSubtitle>
          </VListItem>



          <VListItem v-if="company.id && !user.company_id" @click="changeCompany">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-building" size="22" />
            </template>

            <VListItemTitle>Cambiar Empresa</VListItemTitle>
          </VListItem>

          <VListItem @click="openModalPassword">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-lock" size="22" />
            </template>

            <VListItemTitle>Cambiar Constraseña</VListItemTitle>
          </VListItem>



          <!-- 👉 Cerrar todas las sesiones (solo Super Administrador) -->
          <VListItem v-if="isSuperAdmin" @click="revokeAllSessions()">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-lock-off" size="22" color="error" />
            </template>

            <VListItemTitle class="text-error">Cerrar todas las sesiones</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem @click="logout()">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-logout" size="22" />
            </template>

            <VListItemTitle>Cerrar Sesión</VListItemTitle>
          </VListItem>

        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>

    <ModalChangePassword ref="refModalChangePassword" />


  </VBadge>
</template>
