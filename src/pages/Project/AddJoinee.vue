<script lang="ts" setup>
import { useAddJoinees } from "@/components/Miro/Actions/http/addJoinee";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
const route = useRoute()
const { addJoinees, loading } = useAddJoinees(route)


definePage({
  name: "Miro-AddJoinees",
  meta: {
  },
});

onMounted(async () => {

  await addJoinees()

})
</script>


<template>
  <div align="center">
    <LoadingIndicator :loading="loading" />
  </div>
</template>
