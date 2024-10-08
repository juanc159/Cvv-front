import { createApp } from 'vue'

import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'

import registerGlobalComponents from './globalComponents'

import Editor from '@tinymce/tinymce-vue'

// Create vue app
const app = createApp(App)
registerGlobalComponents(app)

// Register plugins
registerPlugins(app)

app.component('Editor', Editor)

// Mount vue app
app.mount('#app')
