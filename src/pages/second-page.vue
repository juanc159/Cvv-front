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
  console.log('WebSocket Config:', {
    key: import.meta.env.VITE_REVERB_APP_KEY,
    host: import.meta.env.VITE_REVERB_HOST,
    port: 443,
    tls: import.meta.env.VITE_REVERB_SCHEME === 'https'
  });

  window.Echo.connector.pusher.connection.bind('connected', () => {
    console.log('WebSocket connected');
  });

  window.Echo.connector.pusher.connection.bind('error', (err) => {
    console.error('WebSocket error:', err);
  });

  window.Echo.channel('test-channel')
    .subscribed(() => {
      console.log('Subscribed to test-channel');
    })
    .listen('.TestEvent', (payload) => {
      console.log('Evento recibido:', payload);
      message.value = payload.message;
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
