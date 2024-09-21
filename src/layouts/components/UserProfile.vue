<script setup lang="ts">

import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

const authenticationStore = useAuthenticationStore();

const { company, user } = storeToRefs(authenticationStore);
const router = useRouter();
const logout = () => {

  let urlLogout = "Login"
  if (authenticationStore.user.type_user == "admin") {
    urlLogout = "Login"
  }
  if (authenticationStore.user.type_user == "student") {
    urlLogout = "Login-Estudent"
  }
  if (authenticationStore.user.type_user == "teacher") {
    urlLogout = "Login-Teacher"
  }
  authenticationStore.logout();
  router.push({
    name: urlLogout
  });
};

/* Limpia los datos del storage */
const clearStorage = () => {
  company.value = {};
  authenticationStore.getMenuData;
};


const avatarData = computed(() => {
  // Asegúrate de que `full_name` no esté vacío
  const fullName = authenticationStore.user?.full_name || '';
  // Si `full_name` no está vacío, procesar las iniciales
  if (fullName) {
    return fullName
  }

  return 'S/N'; // Retorna 'A' si `full_name` está vacío
});
</script>

<template>
  <VBadge dot location="bottom right" offset-x="3" offset-y="3" bordered color="success">
    <VAvatar class="cursor-pointer" color="primary" variant="tonal" size="50">
      <VImg v-if="authenticationStore.user?.photo" :src="authenticationStore.user?.photo" />
      <div v-else>
        {{ avatarText(avatarData) }}
      </div>


      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success">
                  <VAvatar v-if="authenticationStore.user?.photo" color="primary" variant="tonal">
                    <VImg :src="authenticationStore.user?.photo" />
                  </VAvatar>

                  <VAvatar v-else color="primary" variant="tonal" size="50">
                    {{ avatarText(avatarData) }}
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ user.full_name }}
            </VListItemTitle>
            <!-- <VListItemSubtitle>Admin</VListItemSubtitle> -->
          </VListItem>

          <!-- 👉 Cambiar empresa -->
          <VListItem v-if="company.id && !user.company_id" :to="{ name: 'Company-Index' }" @click="clearStorage">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-logout" size="22" />
            </template>

            <VListItemTitle>Cambiar Empresa</VListItemTitle>
          </VListItem>
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem @click="logout()">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-logout" size="22" />
            </template>

            <VListItemTitle>Terminar sesión</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
