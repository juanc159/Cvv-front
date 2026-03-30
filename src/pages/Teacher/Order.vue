<script lang="ts" setup>
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

definePage({
  name: "Teacher-Order",
  path: "/teacher-Order",
  meta: {
    requiresAuth: true,
    requiredPermission: "teacher.index",
  },
});

const authenticationStore = useAuthenticationStore();

interface ITeacher {
  backgroundColor: string,
  photo: string,
  subject_name: string,
  fullName: string,
  jobPosition: string,
  email: string,
  phone: string,
  files: Array<{
    name: string,
    path: string,
  }>,
}

const currentTab = ref();

const tabsData = ref<{ title: string, number_records: string, data: Array<ITeacher> }[]>([])

const { data } = await useApi("pw-teachers/" + authenticationStore.company.id).get();
if (data.value.code == 200) {
  tabsData.value = data.value.tabsData;
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
            <VTabs next-icon="tabler-arrow-right" prev-icon="tabler-arrow-left" v-model="currentTab" grow stacked
              fixed-tabs show-arrows>
              <VTab v-for="(item, index) in tabsData" :key="index">
                <v-chip class="ma-2" label>
                  <span>{{ item.number_records }}</span>
                </v-chip>
                {{ item.title }}
              </VTab>
            </VTabs>


            <VCardText>
              <VWindow v-model="currentTab">
                <VWindowItem v-for="(item, index) in tabsData" :key="index">
                  <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
                    <DropTeachers v-if="item.data?.length > 0" :teachers="item.data" :company-id="authenticationStore.company.id" />
                  </div>
                </VWindowItem>
              </VWindow>
            </VCardText>

          </VCard>
        </VContainer>
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
</style>
