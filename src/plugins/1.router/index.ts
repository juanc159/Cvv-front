import type { App } from 'vue'

import { setupLayouts } from 'virtual:generated-layouts'
import type { RouteRecordRaw } from 'vue-router/auto'
// eslint-disable-next-line import/no-unresolved
import { createRouter, createWebHistory } from 'vue-router/auto'

import { useAuthenticationStore } from '@/stores/useAuthenticationStore'

function recursiveLayouts(route: RouteRecordRaw): RouteRecordRaw {
  if (route.children) {
    for (let i = 0; i < route.children.length; i++)
      route.children[i] = recursiveLayouts(route.children[i])

    return route
  }

  return setupLayouts([route])[0]
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    if (to.hash)
      return { el: to.hash, behavior: 'smooth', top: 60 }

    return { top: 0 }
  },
  extendRoutes: pages => [
    ...[...pages].map(route => recursiveLayouts(route)),
  ],
})

router.beforeEach((to, from, next) => {

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const authenticationStore = useAuthenticationStore() // obtiene el usuario actual
  const { isAuthenticate, permissions } = storeToRefs(authenticationStore)


  if (requiresAuth && !isAuthenticate.value) {
    next('/login') // redirige al usuario al login si la ruta requiere autenticación y el usuario no está autenticado
  }
  else {
    const requiredPermission = to.meta.requiredPermission
    if (requiredPermission && isAuthenticate.value && !permissions.value.includes(requiredPermission))
      next('/unauthorized') // redirige al usuario a una página de error si no tiene los permisos necesarios para acceder a la ruta

    else
      next() // permite el acceso a la ruta
  }
})


export { router }

export default function (app: App) {
  app.use(router)
}
