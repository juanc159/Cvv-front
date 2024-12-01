import { createApp } from 'vue'

import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'


import Editor from '@tinymce/tinymce-vue'

// Create vue app
const app = createApp(App)

// Register plugins
registerPlugins(app)

app.component('Editor', Editor)

// Mount vue app
app.mount('#app')
