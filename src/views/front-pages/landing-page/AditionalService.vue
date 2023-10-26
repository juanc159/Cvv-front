<script setup lang="ts">
const colorAvatar = ref("primary");

const data = ref([
  {
    hover: false,
    title: "Educación",
    icon: "tabler-pencil",
  },
  {
    hover: false,
    title: "Danza",
    icon: "tabler-star-half-filled",
  },
  {
    hover: false,
    title: "Musica",
    icon: "tabler-music",
  },
  {
    hover: false,
    title: "Deporte",
    icon: "tabler-ball-football",
  },
]);
</script>

<template>
  <div class="section">
    <div class="headers d-flex justify-center flex-column align-center py-12">
      <div class="d-flex align-center text-h3 mb-1 flex-wrap justify-center">
        <div class="position-relative me-2">
          <h3 class="section-title">Servicios adicionales o complementarios</h3>
        </div>
      </div>
      <p>
        Además de sus servicios educativos obligatorios, el aprendizaje de danza
        latinoamericana, música...
      </p>
    </div>

    <VRow>
      <VCol cols="12" class="d-flex justify-space-around w-100">
        <div v-for="(item, index) in data" :key="index" class="activity">
          <VAvatar
            :color="item.hover ? 'success' : 'primary'"
            variant="tonal"
            size="170"
            @mouseover="item.hover = true"
            @mouseout="item.hover = false"
          >
            <VIcon :icon="item.icon" size="100"></VIcon>
          </VAvatar>
          <h3 class="mt-1">{{ item.title }}</h3>
        </div>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss" scoped>
.activity {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
