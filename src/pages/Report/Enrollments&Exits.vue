<script setup lang="ts">

definePage({
  name: "Enrollments&Exits-Index",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "menu.enrollments&Exits",
  },
});

</script>

<template>
  <div>
    <StudentStatistics />
  </div>
</template>
