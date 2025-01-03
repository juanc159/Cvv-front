import { createApp } from 'vue'

import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'


import Editor from '@tinymce/tinymce-vue'

// import Echo from 'laravel-echo'

// import Pusher from 'pusher-js'
// window.Pusher = Pusher;

// const accessToken = useCookie("accessToken").value;


// window.Echo = new Echo({
//   broadcaster: 'reverb',
//   key: import.meta.env.VITE_REVERB_APP_KEY,
//   wsHost: import.meta.env.VITE_REVERB_HOST,
//   wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
//   wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
//   forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
//   enabledTransports: ['ws', 'wss'],

//   // forceTLS: true,
//   // authEndpoint: "/api/broadcasting/auth",
//   // headers: { "X-CSRF-Token": accessToken },

//   // authEndpoint: "http://localhost:8000/api/broadcasting/auth",
//   // auth: {
//   //   headers: {
//   //     Authorization: "Bearer " + accessToken,
//   //   },
//   // },

// });



// Create vue app
const app = createApp(App)

// Register plugins
registerPlugins(app)

app.component('Editor', Editor)

// Mount vue app
app.mount('#app')
