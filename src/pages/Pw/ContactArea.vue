<script setup lang="ts">
const { data } = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div :style="{
    'background-color': 'rgb(var(--v-theme-surface))',
    'border-radius': '3.75rem 3.75rem 0 0',
  }">
    <VContainer id="contact-us">
      <!-- 👉 Headers  -->
      <div class="contact-us-section">
        <div class="headers d-flex justify-center flex-column align-center py-12">
          <div class="d-flex align-center text-h3 mb-1 flex-wrap justify-center">
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
                <VCard variant="outlined" border class="pa-2" :style="{
                  borderRadius: '3.75rem 0.375rem 0.375rem 0.375rem',
                }">
                  <div class="d-flex justify-center">
                    <VAvatar color="primary" variant="tonal" size="170">
                      <VIcon icon="tabler-school" size="100"></VIcon>
                    </VAvatar>
                  </div>
                  <VCardText>
                    <div class="d-flex justify-space-between flex-wrap gap-y-4">
                      <!-- {{ data.details }} -->
                      <div v-for="(item, index) in data.details" :key="index" class="w-100 d-flex gap-x-3 align-center">
                        <div>
                          <VAvatar size="36" :color="item.color" variant="tonal" class="rounded-sm">
                            <VIcon :icon="item.icon" size="24" />
                          </VAvatar>
                        </div>

                        <div>
                          <b>{{ item.type_detail_name }}</b>
                          <VDivider />
                          <div class="font-weight-medium text-high-emphasis">
                            <template v-if="Array.isArray(item.content)">
                              <ul style="list-style-type: none">
                                <li v-for="(element, index) in item.content" :key="index">
                                  {{ element }}
                                </li>
                              </ul>
                            </template>
                            <template v-else>
                              <span>{{ item.content }}</span>
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
                  <div v-html="data.iframeGoogleMap"></div>
                  <!-- <iframe v-if="data.iframeGoogleMap" :src="data.iframeGoogleMap" height="450"
                    style="border-radius: 1rem; inline-size: 100%" :allowfullscreen="true" loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"></iframe> -->
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
.contact-us-section {}

.section-title::after {
  position: absolute;
  // background: url("../../../assets/images/front-pages/icons/section-title-icon.png") no-repeat left bottom;
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
  // content: url("@images/front-pages/icons/contact-border.png");
  inset-block-start: -2.5rem;
  inset-inline-start: -2.5rem;
}

@media screen and (max-width: 999px) {
  .contact-card::before {
    display: none;
  }
}
</style> 
