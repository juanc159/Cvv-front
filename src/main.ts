import { createApp } from 'vue'

import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'

import Editor from '@tinymce/tinymce-vue'

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

  // Importante: configurar el endpoint de autorización
  authEndpoint: `${import.meta.env.VITE_API_BASE_URL}/broadcasting/auth`,

  auth: {
    headers: {
      Authorization: `Bearer ${useCookie("accessToken").value}`
    }
  }
});



// Create vue app
const app = createApp(App)

// Register plugins
registerPlugins(app)
app.component('Editor', Editor)

// Mount vue app
app.mount('#app')
