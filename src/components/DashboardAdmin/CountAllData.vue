<script setup lang="ts">
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
const authenticationStore = useAuthenticationStore();

interface CountData {
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  value: string | number;
  isHover: boolean;
}

const countData = ref<CountData[]>([
  {
    "icon": 'tabler-user-shield',
    "color": 'success',
    "title": 'Usuarios',
    "subtitle": '',
    "value": 0,
    "isHover": false
  },
  {
    "icon": 'tabler-circles',
    "color": 'success',
    "title": 'Roles',
    "subtitle": '',
    "value": 0,
    "isHover": false
  },
  {
    "icon": 'tabler-border-inner',
    "color": 'warning',
    "title": 'Banners',
    "subtitle": '',
    "value": 0,
    "isHover": false
  },
  {
    "icon": 'tabler-checklist',
    "color": 'error',
    "title": 'Materias',
    "subtitle": '',
    "value": 0,
    "isHover": false
  },
  {
    "icon": 'tabler-layers-intersect',
    "color": 'info',
    "title": 'Grados',
    "subtitle": '',
    "value": 0,
    "isHover": false
  },
  {
    "icon": 'tabler-device-gamepad-3',
    "color": 'info',
    "title": 'Servicios',
    "subtitle": '',
    "value": 0,
    "isHover": false
  },
  {
    "icon": 'tabler-users-group',
    "color": 'info',
    "title": 'Estudiantes',
    "subtitle": '',
    "value": 0,
    "isHover": false
  },
  {
    "icon": 'tabler-user-square-rounded',
    "color": 'info',
    "title": 'Docentes',
    "subtitle": '',
    "value": 0,
    "isHover": false
  },
]);
const isLoading = ref<boolean>(true)

onMounted(async () => {
  isLoading.value = true;
  const { data, response } = await useApi<any>(
    createUrl(`/dashboard/countAllData`, {
      query: {
        company_id: authenticationStore.company.id,
        user_id: authenticationStore.user.role_id == ROLE_SUPERADMIN_UUID ? null : authenticationStore.user.id,
      },
    })
  );

  isLoading.value = false;

  if (response.value?.ok && data.value) {
    countData.value[0].value = data.value.userCount
    countData.value[1].value = data.value.roleCount
    countData.value[2].value = data.value.bannerCount
    countData.value[3].value = data.value.subjectCount
    countData.value[4].value = data.value.gradeCount
    countData.value[5].value = data.value.serviceCount

    countData.value[6].value = data.value.studentCount.active
    if (data.value.studentCount.withdrawn > 0) {
      countData.value[6].subtitle = "Retirados: " + data.value.studentCount.withdrawn
    }

    countData.value[7].value = data.value.teacherCount
  }
});

</script>

<template>
  <VRow>
    <VCol v-for="(data, index) in countData" :key="index" cols="12" md="3" sm="6">
      <div>
        <VCard
          :style="data.isHover ? `border-block-end-color: rgb(var(--v-theme-${data.color}))` : `border-block-end-color: rgba(var(--v-theme-${data.color}),0.38)`"
          @mouseenter="data.isHover = true" @mouseleave="data.isHover = false">
          <VSkeletonLoader :loading="isLoading" type="avatar,list-item, list-item">
            <VCardText>
              <div class="text-body-1 mb-1">
                {{ data.title }}
              </div>
              <div class="d-flex align-center gap-x-4 mb-1">
                <VAvatar variant="tonal" :color="data.color" rounded>
                  <VIcon :icon="data.icon" size="28" />
                </VAvatar>
                <h4 class="text-h4">
                  {{ data.value }}
                </h4>
              </div>
              <div class="text-body-1 mb-1">
                {{ data.subtitle }}
              </div>
            </VCardText>
          </VSkeletonLoader>
        </VCard>
      </div>
    </VCol>
  </VRow>
</template>
