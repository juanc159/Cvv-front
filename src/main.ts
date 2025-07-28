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
const accessToken = useCookie("accessToken").value;

window.Echo = new Echo({
  broadcaster: 'reverb',
  key: 'otm5syqaviw1uw9iqpen',
  wsHost: 'colegiovirgendelvalle.com.co', // Tu dominio real
  wsPort: 443,  // Puerto SSL público
  wssPort: 443, // Puerto SSL público
  forceTLS: true, // Obligatorio en producción
  enabledTransports: ['wss'], // Solo WebSocket seguro
});



// Create vue app
const app = createApp(App)

// Register plugins
registerPlugins(app)
app.component('Editor', Editor)

// Mount vue app
app.mount('#app')
