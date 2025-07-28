<template>
  <div>
    <h1>Testing Laravel Reverb with Vue 3</h1>
    <p>Message from Reverb: {{ message }}</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
const message = ref('Waiting for message...');

onMounted(() => {
  // window.Echo.channel('test-channel').listen('TestEvent', (e) => {
  //   console.log('Event received:', e.message);
  //   message.value = e.message;
  // });

  window.Echo.channel('test-channel')
    .listen('.TestEvent', (payload) => { // ¡El punto es crucial!
      console.log('Evento recibido:', payload.message);
      // Actualiza tu estado Vue aquí
    });
});
</script>

<style scoped>
div {
  text-align: center;
  padding: 20px;
}

h1 {
  color: #333;
}

p {
  font-size: 18px;
  color: #007bff;
}
</style>
