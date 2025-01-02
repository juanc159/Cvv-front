<script lang="ts" setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import LoadingIndicator from "../../components/base-components/LoadingIndicator.vue";
import { useAddJoinees } from './actions/addjoinee/http/addJoinee';
const route = useRoute()
const { addJoinees, loading } = useAddJoinees(route)


onMounted(async () => {

  await addJoinees()

})
</script>


<template>
  <div align="center">
    <LoadingIndicator :loading="loading" />
  </div>
</template>
