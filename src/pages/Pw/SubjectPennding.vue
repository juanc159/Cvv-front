<script setup lang="ts">
import SchoolData from "@/layouts/SchoolData.vue";

const route = useRoute()


definePage({
  name: "Pw-SubjectPennding",
  path: "/school/:school_id/subjectPennding",
  meta: {
    requiresAuth: false,
    layout: "blank",
  },
});

interface IService {
  id: string,
  title: string,
  image: string,
  html: string,
}


const plannings = ref<IService>({
  id: "",
  title: "",
  image: "",
  html: "",
})
const { data, response } = await useApi("pw-materiaPendiente").get();
if (data.value.code == 200) {
  plannings.value = data.value.plannings;
}




</script>

<template>
  <SchoolData :swiperBanners="false">
    <VContainer id="team">
      <div class="our-team">
        <div class="headers d-flex justify-center flex-column align-center">
          <div class="d-flex align-center text-h3 mb-1 flex-wrap justify-center">
            <div class="position-relative me-2">
              <h3 class="section-title">
                Materias pendientes año escolar 2023-2024
              </h3>
            </div>
          </div>
        </div>
        <VRow>
          <VCol>
            <h2 class=" font-weight-bold mb-6">
              <a target="_blank"
                href="https://docs.google.com/document/d/1sJLQi7sObOw41VI9udy8P-9I3NZnLvII/edit?usp=sharing&ouid=109014023290836934766&rtpof=true&sd=true">LISTADO
                DE ESTUDIANTES CON MATERIA PENDIENTE</a>
            </h2>
            <v-list>
              <v-list-item-group>
                <v-list-item v-for="(sections, gradeName) in plannings" :key="gradeName">
                  <v-list-item-content>
                    <v-list-item-title class="font-weight-bold text-h5">{{ gradeName }}</v-list-item-title>
                    <v-list>
                      <v-list-item-group>
                        <v-list-item v-for="(files, sectionName) in sections" :key="sectionName">
                          <v-list-item-content>
                            <v-list-item-title class="font-weight-medium text-h5">Sección {{ sectionName
                              }}</v-list-item-title>
                            <v-list>
                              <v-list-item v-for="file in files" :key="file.id">
                                <v-list-item-content>
                                  <v-list-item-title class="text-body-1">{{ file.name }}</v-list-item-title>
                                  <v-list-item-subtitle>
                                    <a :href="file.path" target="_blank" class="text-primary">Ver Archivo</a>
                                  </v-list-item-subtitle>
                                </v-list-item-content>
                              </v-list-item>
                            </v-list>
                            <v-divider></v-divider>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-list-item-content>
                  <v-divider></v-divider>
                </v-list-item>
              </v-list-item-group>
            </v-list>

          </VCol>
        </VRow>
      </div>
    </VContainer>
  </SchoolData>
</template>

<style lang="scss" scoped>
.team-image {
  position: absolute;
  inset-block-start: -3.4rem;
  inset-inline: 0;
}

.headers {
  margin-block-end: 5rem;
}

.our-team {
  margin-block: 7rem;
}

.team-card {
  border-radius: 90px 20px 6px 6px;
}

.section-title::after {
  position: absolute;
  background: url('../../../assets/images/front-pages/icons/section-title-icon.png') no-repeat left bottom;
  background-size: contain;
  block-size: 100%;
  content: '';
  font-weight: 700;
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: 0%;
}

.text-primary {
  color: #1976D2;

  /* Color primario de Vuetify */
}

.text-body-1 {
  font-size: 1.125rem;

  /* Tamaño de fuente aumentado */
}
</style>
