<script setup lang="ts">
import school_1 from "@/assets/cvv-central/school_1.jpg";
import school_2 from "@/assets/cvv-central/school_2.jpg";
import school_3 from "@/assets/cvv-central/school_3.jpg";

const teamData = ref([
  {
    name: "U.E Colegio Virgen del Valle",
    position: "",
    image: school_1,
    backgroundColor: "rgba(144, 85, 253, 0.16)",
    borderColor: "rgba(144, 85, 253,0.5)",
    isHover: false,
  },
  {
    name: "Virgen del Valle International School",
    position: "",
    image: school_2,
    backgroundColor: "rgba(22, 177, 255, 0.16)",
    borderColor: "rgba(22, 177, 255,0.5)",
    isHover: true,
  },
  {
    name: "U.E Colegio Lolita Robles de Mora",
    position: "",
    image: school_3,
    backgroundColor: "rgba(255, 76, 81, 0.16)",
    borderColor: "rgba(255, 76, 81,0.5)",
    isHover: false,
  },
]);
</script>

<template>
  <VContainer id="team">
    <div class="our-team">
      <div class="headers d-flex justify-center flex-column align-center">
        <div class="d-flex align-center text-h3 mb-1 flex-wrap justify-center">
          <div class="position-relative me-2">
            <h3 class="section-title">ELIGE EL COLEGIO</h3>
          </div>
        </div>

        <p class="text-center">Selecciona la institucion que desees</p>
      </div>

      <VRow class="d-flex justify-center">
        <VCol
          v-for="(data, index) in teamData"
          :key="index"
          cols="12"
          lg="4"
          sm="6"
        >
          <VCard
            flat
            min-width="262"
            class="position-relative overflow-visible team-card mb-12"
            style="cursor: pointer"
            :to="{ name: 'Pw-school', params: { id: index + 1 } }"
          >
            <div
              :style="{
                maxHeight: '185px',
                minHeight: '185px',
                borderRadius: '90px 20px 0 0',
                backgroundColor: `${data.backgroundColor}`,
              }"
            >
              <VImg
                :style="{ borderRadius: '20px 20px 0 0' }"
                :src="data.image"
                height="240"
                cover
                class="team-image"
              />
            </div>
            <VCardText
              class="text-center pa-4"
              :style="{
                border: `1px solid ${data.borderColor}`,
                borderBlockStart: 'none',
                borderRadius: '0 0 6px 6px',
                boxSizing: 'border-box',
              }"
            >
              <h5 class="text-h5" style="min-block-size: 2.5rem">
                {{ data.name }}
              </h5>
              <span class="text-body-1 text-disabled">{{ data.position }}</span>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </VContainer>
</template>

<style lang="scss" scoped>
.team-image {
  position: absolute;
  inset-block-start: -3.4rem;
  inset-inline: 0;
}

.headers {
  margin-block-end: 7rem;
}

.our-team {
  margin-block: 1rem;
}

.team-card {
  border-radius: 90px 20px 6px 6px;
}

.section-title::after {
  position: absolute;
  background: url("../../../assets/images/front-pages/icons/section-title-icon.png")
    no-repeat left bottom;
  background-size: contain;
  block-size: 100%;
  content: "";
  font-weight: 700;
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: 0%;
}
</style>
