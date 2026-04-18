import { createApp } from 'vue'

import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'

// Styles2
import '@core/scss/template/index.scss'
import '@styles/styles.scss'

import Editor from '@tinymce/tinymce-vue'

import axios from 'axios'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT ?? 443,
  wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
  enabledTransports: ['ws', 'wss'],

  // Authorizer custom: lee el token FRESCO del cookie en cada intento de suscripción.
  // Esto evita que Echo quede con un token vencido o vacío capturado al arranque.
  authorizer: (channel: any) => {
    return {
      authorize: (socketId: string, callback: (err: any, data?: any) => void) => {
        const token = useCookie('accessToken').value;
        axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/broadcasting/auth`,
          {
            socket_id: socketId,
            channel_name: channel.name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
          .then((response: any) => callback(null, response.data))
          .catch((error: any) => callback(error));
      },
    };
  },
});



// Create vue app
const app = createApp(App)

// Register plugins
registerPlugins(app)
app.component('Editor', Editor)

// Refrescar datos del usuario al cargar la app (F5, abrir pestaña).
// Si el token es válido, sincroniza con el backend; si no, limpia la sesión.
import { useAuthenticationStore } from '@/stores/useAuthenticationStore'
const authStore = useAuthenticationStore()
authStore.fetchMe().finally(() => app.mount('#app'))
