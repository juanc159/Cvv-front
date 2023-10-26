<script setup lang="ts">
const { data } = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div
    :style="{
      'background-color': 'rgb(var(--v-theme-surface))',
      'border-radius': '3.75rem 3.75rem 0 0',
    }"
  >
    <VContainer id="contact-us">
      <!-- 👉 Headers  -->
      <div class="contact-us-section">
        <div
          class="headers d-flex justify-center flex-column align-center py-12"
        >
          <div
            class="d-flex align-center text-h3 mb-1 flex-wrap justify-center"
          >
            <div class="position-relative me-2">
              <h3 class="section-title">Contactanos</h3>
            </div>
          </div>
          <!-- <p>Any question or remark? just write us a message</p> -->
        </div>

        <div class="mb-15">
          <VRow class="match-height">
            <VCol cols="12" md="4">
              <div class="contact-card h-100">
                <VCard
                  variant="outlined"
                  border
                  class="pa-2"
                  :style="{
                    borderRadius: '3.75rem 0.375rem 0.375rem 0.375rem',
                  }"
                >
                  <div class="d-flex justify-center">
                    <VAvatar color="primary" variant="tonal" size="170">
                      <VIcon icon="tabler-school" size="100"></VIcon>
                    </VAvatar>
                  </div>
                  <VCardText>
                    <div class="d-flex justify-space-between flex-wrap gap-y-4">
                      <div
                        v-for="(item, index) in data.contactArea"
                        :key="index"
                        class="d-flex gap-x-3 align-center"
                      >
                        <div>
                          <VAvatar
                            size="36"
                            :color="item.color"
                            variant="tonal"
                            class="rounded-sm"
                          >
                            <VIcon :icon="item.icon" size="24" />
                          </VAvatar>
                        </div>

                        <div>
                          <b>{{ item.title }}</b>
                          <VDivider />
                          <div class="font-weight-medium text-high-emphasis">
                            <template v-if="Array.isArray(item.value)">
                              <ul style="list-style-type: none">
                                <li
                                  v-for="(element, index) in item.value"
                                  :key="index"
                                >
                                  {{ element }}
                                </li>
                              </ul>
                            </template>
                            <template v-else>
                              <span>{{ item.value }}</span>
                            </template>
                          </div>
                        </div>
                      </div>
                    </div>
                  </VCardText>
                </VCard>
              </div>
            </VCol>

            <VCol cols="12" md="8">
              <VCard flat>
                <VCardItem class="pb-0"> </VCardItem>

                <VCardText>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.6676004022324!2d-72.20886082542425!3d7.824962306673646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e666c2486e7b9c9%3A0x6b3c0c32ba495b0a!2sColegio%20Virgen%20del%20Valle!5e0!3m2!1ses-419!2sco!4v1698344529987!5m2!1ses-419!2sco"
                    height="450"
                    style="border-radius: 1rem; inline-size: 100%"
                    :allowfullscreen="true"
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                  ></iframe>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </div>
      </div>
    </VContainer>
  </div>
</template>

<style lang="scss" scoped>
.contact-us-section {
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

.contact-card {
  position: relative;
}

.contact-card::before {
  position: absolute;
  content: url("@images/front-pages/icons/contact-border.png");
  inset-block-start: -2.5rem;
  inset-inline-start: -2.5rem;
}

@media screen and (max-width: 999px) {
  .contact-card::before {
    display: none;
  }
}
</style>
