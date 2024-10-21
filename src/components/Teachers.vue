<script setup lang="ts">
import TeacherData from "@/components/TeacherData.vue";

const props = defineProps({
  school_id: {
    type: [Number, String],
    required: true,
  },
});


interface ITeachers {
  subject_name: string,
  fullName: string,
  jobPosition: string,
  email: string,
  phone: string,
  photo: string,
  backgroundColor: string,
}


const tabsData = ref<{ title: string, number_records: string, data: Array<ITeachers> }[]>([])


const { data, response } = await useApi("pw-teachers/" + props.school_id).get();
if (data.value.code == 200) {
  tabsData.value = data.value.tabsData;
}


//TABS 
const currentTab = ref();


</script>

<template>


  <VContainer id="team">
    <div class="our-team">
      <div class="headers d-flex justify-center flex-column align-center">

        <div class="d-flex align-center text-h3 mb-1 flex-wrap justify-center">
          <div class="position-relative me-2">
            <h3 class="section-title text-center">
              Nuestro gran equipo docentes
            </h3>
          </div>
        </div>
        <p class="text-center">
          Educadores comprometidos con el éxito de tus hijos
        </p>
      </div>
    </div>


    <VCard>
      <VTabs next-icon="tabler-arrow-right" prev-icon="tabler-arrow-left" v-model="currentTab" grow stacked fixed-tabs
        show-arrows>
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
              <TeacherData v-if="item.data?.length > 0" :teachers="item.data" />
            </div>
          </VWindowItem>
        </VWindow>
      </VCardText>
    </VCard>
  </VContainer>
</template>
