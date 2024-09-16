<template>
  <div class="footer">
    <!-- 👉 Footer Line -->
    <div class="text-white-variant footer-line w-100">
      <VContainer>
        <div class="d-flex justify-space-between flex-wrap gap-y-4 align-center">
          <div style="color: white" v-for="(item, index) in data?.footer" :key="index">
            <VIcon :icon="item.icon"></VIcon>
            <span>{{ item.text }}</span>
          </div>
        </div>
      </VContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data } = defineProps({
  data: {
    type: Object,
    required: false,
    default: {},
  },
});
</script>

<style lang="scss" scoped>
.footer {
  padding: 1rem;
  background: #171925;
  color: #fff;
  inline-size: 100%;
  text-align: center;
}
</style>

<style lang="scss">
.subscribe-form {
  .v-label {
    color: rgba(211, 212, 220, 50%) !important;
  }

  .v-field {
    border-radius: 6px 0 0 6px !important;

    input.v-field__input::placeholder {
      color: rgba(231, 227, 252, 50%) !important;
    }
  }
}

.footer-top {
  border-radius: 60px 60px 0 0;
  background-size: cover;
  color: #fff;
}

.footer-line {
  background: #171925;
}

@media (min-width: 600px) and (max-width: 960px) {
  .v-container {
    padding-inline: 2rem !important;
  }
}
</style>
