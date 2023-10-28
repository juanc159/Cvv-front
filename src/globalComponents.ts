import type { App } from 'vue'

import HeaderAlertView from '@/components/HeaderAlertView.vue'
import PreloadInterno from '@/components/preload/Interno.vue'


export default function registerGlobalComponents(app: App): void {
  //Componentes Generales
  app.component('HeaderAlertView', HeaderAlertView)
  app.component('PreloadInterno', PreloadInterno)

}
