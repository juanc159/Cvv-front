<script setup lang="ts">
import ingVirgenCvv from "@/assets/general/Virgen.png";
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
const students_pending_subject = ref<string>("")
const term_name = ref<string>("")
const { data, response } = await useApi(`pw-materiaPendiente/${route.params.school_id}`).get();
if (data.value.code == 200) {
  plannings.value = data.value.pendingRegistrations;
  term_name.value = data.value.term_name;
  students_pending_subject.value = data.value.students_pending_subject;
}




</script>

<template>
  <SchoolData :swiperBanners="false">
    <VContainer id="team">
      <div class="our-team">
        <div class="headers d-flex justify-center flex-column align-center">
          <div class="d-flex align-center text-h3 mb-1 flex-wrap justify-center">
            <div class="position-relative me-2 d-flex flex-column justify-center align-center">
              <VImg width="100" :src="ingVirgenCvv" />
              <h3 class="section-title text-center">
                Materias Pendientes {{ term_name }}
              </h3>
            </div>
          </div>
        </div>
        <VRow>
          <VCol>
            <h2 class=" font-weight-bold mb-6" v-if="students_pending_subject">
              <a target="_blank" :href="students_pending_subject">
                LISTADO DE ESTUDIANTES CON MATERIA PENDIENTE
              </a>
            </h2>
            <v-container>
              <v-row>
                <v-col v-for="(item, index) in plannings" :key="index" cols="12" md="6">
                  <v-card class="mb-4">

                    <!-- Toolbar -->
                    <div>
                      <VToolbar color="primary" class="text-center">
                        <VToolbarTitle>{{ item.grade_name }}</VToolbarTitle>
                      </VToolbar>
                    </div>
                    <VCardText>
                      <VList>
                        <v-list-item-group>

                          <VListItem v-for="(subject, indexSubject) in item.files_by_subject" :key="indexSubject">
                            <v-list-item-content>

                              <v-list-item-title class="font-weight-medium text-h6">
                                ● {{ subject.subject_name }}
                              </v-list-item-title>
                              <v-list>
                                <v-list-item-group>

                                  <VListItem v-for="(file, indexFile) in subject.files" :key="indexFile">
                                    <v-list-item-content>
                                      <v-list-item-title class="text-h5">{{ file.name }}</v-list-item-title>
                                      <v-list-item-subtitle>
                                        <a :href="storageBack(file.path)" target="_blank"
                                          class="text-h6 text-primary">Ver
                                          Archivo</a>
                                      </v-list-item-subtitle>
                                    </v-list-item-content>
                                  </VListItem>
                                </v-list-item-group>

                              </v-list>
                              <v-divider></v-divider>

                            </v-list-item-content>
                          </VListItem>
                        </v-list-item-group>

                      </VList>
                    </VCardText>

                  </v-card>
                </v-col>
              </v-row>
            </v-container>

            <!-- <v-card-text>
                      <v-list>
                        <v-list-item-group>
                          <v-list-item v-for="(files, sectionName) in sections" :key="sectionName">
                            <v-list-item-content>
                              <v-list-item-title class="font-weight-medium text-h6">Sección {{ sectionName
                              }}</v-list-item-title>
                              <v-list>
                                <v-list-item-group>
                                  <v-list-item v-for="(subjectFiles, subjectName) in files" :key="subjectName">
                                    <v-list-item-content>
                                      <v-list-item-title class="text-body-1 font-weight-bold">● {{ subjectName
                                      }}</v-list-item-title>
                                      <v-list>
                                        <v-list-item v-for="file in subjectFiles" :key="file.id">
                                          <v-list-item-content>
                                            <v-list-item-title class="text-body-1">{{ file.name }}</v-list-item-title>
                                            <v-list-item-subtitle>
                                              <a :href="storageBack(file.path)" target="_blank" class="text-primary">Ver
                                                Archivo</a>
                                            </v-list-item-subtitle>
                                          </v-list-item-content>
                                        </v-list-item>
                                      </v-list>
                                    </v-list-item-content>
                                  </v-list-item>
                                </v-list-item-group>
                              </v-list>
                              <v-divider></v-divider>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-card-text> -->



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
  font-size: 3rem;

  /* Tamaño de fuente aumentado */
}
</style>
