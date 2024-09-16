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

const currentTab = ref();

const teachers = ref<ITeachers[]>([])
const typeEducations = ref<{ title: string }[]>([])

const { data, response } = await useApi("pw-teachers/" + props.school_id).get();
if (data.value.code == 200) {
  teachers.value = data.value.teachers;
  typeEducations.value = data.value.typeEducations;
}


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
              <TeacherData v-if="teachers[item.title]?.length > 0" :teachers="teachers[item.title]" />
            </div>
          </VWindowItem>
        </VWindow>
      </VCardText>
    </VCard>
  </VContainer>
</template>
