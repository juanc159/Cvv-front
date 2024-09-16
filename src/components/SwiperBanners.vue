<script setup lang="ts">

import { register } from "swiper/element/bundle";

register();

const props = defineProps({
  school_id: {
    type: [Number, String],
    required: true,
  },
});

interface IBanners {
  path: string,
}


const banners = ref<IBanners[]>([])

const { data, response } = await useApi("pw-banners/" + props.school_id).get();
if (data.value.code == 200) {
  banners.value = data.value.banners;
}



</script>

<template>
  <swiper-container style="margin-block-start: 6rem" v-if="banners.length > 0" navigation="true"
    events-prefix="swiper-">
    <swiper-slide pagination="true" v-for="(item, index) in banners" :key="index">
      <VImg :src="item.path" />
    </swiper-slide>
  </swiper-container>
</template>
