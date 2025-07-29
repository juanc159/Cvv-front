<template>
  <div>
    <h1>Testing Laravel Reverb with Vue 3</h1>
    <p>Connection Status: {{ connectionStatus }}</p>
    <p>Message from Reverb: {{ message }}</p>
    <button @click="testConnection">Test Connection</button>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const message = ref('Waiting for message...');
const connectionStatus = ref('Connecting...');

onMounted(() => {
  console.log('WebSocket Config:', {
    key: import.meta.env.VITE_REVERB_APP_KEY,
    host: import.meta.env.VITE_REVERB_HOST,
    port: import.meta.env.VITE_REVERB_PORT,
    scheme: import.meta.env.VITE_REVERB_SCHEME
  });

  // Eventos de conexión
  window.Echo.connector.pusher.bind('pusher:connection_established', () => {
    console.log('WebSocket connected!');
    connectionStatus.value = 'Connected';
  });

  window.Echo.connector.pusher.bind('pusher:error', (error) => {
    console.log('WebSocket error:', error);
    connectionStatus.value = 'Error: ' + error.message;
  });

  // Suscribirse al canal
  window.Echo.channel('test-channel')
    .subscribed(() => {
      console.log('Subscribed to test-channel');
      connectionStatus.value = 'Connected & Subscribed';
    })
    .listen('TestEvent', (payload) => {
      console.log('Evento recibido:', payload);
      message.value = payload.message;
    });
});

const testConnection = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/test-broadcast`);
    const data = await response.json();
    console.log('Test broadcast result:', data);
  } catch (error) {
    console.error('Error testing broadcast:', error);
  }
};
</script>
