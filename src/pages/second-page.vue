<template>
  <div>
    <h1>Testing Laravel Reverb with Vue 3</h1>
    <p>Connection Status: {{ connectionStatus }}</p>
    <p>Message from Reverb: {{ message }}</p>
    <button @click="testConnection">Test Connection</button>
    <div>
      <h3>Debug Info:</h3>
      <pre>{{ debugInfo }}</pre>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const message = ref('Waiting for message...');
const connectionStatus = ref('Connecting...');
const debugInfo = ref({});

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
  const channel = window.Echo.channel('test-channel');

  channel.subscribed(() => {
    console.log('✅ Subscribed to test-channel');
    connectionStatus.value = 'Connected & Subscribed';
  });

  // ⚠️ CAMBIO IMPORTANTE: Sin punto antes de .TestEvent
  channel.listen('.TestEvent', (payload) => {
    console.log('🎉 Evento recibido:', payload);
    message.value = payload.message;
    debugInfo.value = payload;
  });

  // También escuchar TODOS los eventos para debug
  channel.listenForWhisper('*', (eventName, data) => {
    console.log('📢 Evento whisper:', eventName, data);
  });

  // Bind directo para capturar cualquier evento
  window.Echo.connector.pusher.bind_global((eventName, data) => {
    console.log('🌍 Global event:', eventName, data);
    if (eventName.includes('.TestEvent')) {
      console.log('🎯 .TestEvent capturado globalmente:', data);
      message.value = data.message || 'Evento recibido sin mensaje';
    }
  });
});

const testConnection = async () => {
  try {
    console.log('🚀 Enviando test broadcast...');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/test-broadcast`);
    const data = await response.json();
    console.log('✅ Test broadcast result:', data);
  } catch (error) {
    console.error('❌ Error testing broadcast:', error);
  }
};
</script>
