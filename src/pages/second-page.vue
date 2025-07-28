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
  console.log('Setting up WebSocket listener at', new Date().toISOString());
  window.Echo.connector.pusher.connection.bind('connected', () => {
    console.log('WebSocket connected at', new Date().toISOString());
  });
  window.Echo.connector.pusher.connection.bind('error', (err) => {
    console.error('WebSocket error:', err);
  });

  window.Echo.channel('test-channel')
    .subscribed(() => {
      console.log('Subscribed to test-channel at', new Date().toISOString());
    })
    .listen('.TestEvent', (payload) => {
      console.log('Evento recibido at', new Date().toISOString(), '- Payload:', payload);
      message.value = payload.message;
    })
    .listenAny((event, payload) => {
      console.log('Any event received at', new Date().toISOString(), '- Event:', event, '- Payload:', payload);
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
