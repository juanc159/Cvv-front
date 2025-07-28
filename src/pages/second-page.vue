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
  console.log('Connecting to WebSocket...');
  window.Echo.channel('test-channel')
    .listen('.TestEvent', (payload) => {
      console.log('Evento recibido:', payload.message);
      message.value = payload.message;
    })
    .subscribed(() => {
      console.log('Subscribed to test-channel');
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
