<script setup lang="ts">
import IErrorsBack from '@/interfaces/Axios/IErrorsBack'
import { router } from '@/plugins/1.router'
import { useAuthenticationStore } from "@/stores/useAuthenticationStore"
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import type { VForm } from "vuetify/components"

const refForm = ref<VForm>();

definePage({
  name: "Login",
  path: "/login",
  meta: {
    layout: "blank",
    guestOnly: true
  },
});


const authenticationStore = useAuthenticationStore();
const { loading, tokenGoogle, rememberMe } = storeToRefs(authenticationStore);

const errorsBack = ref<IErrorsBack>({});

const form = ref({
  user: '',
  password: '',
  remember: false,
})

const isPasswordVisible = ref(false)

const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

const login = async () => {
  const validation = await refForm.value?.validate();
  if (validation?.valid) {
    const promise = await authenticationStore.login(form.value);

    if (promise.code == 200) {
      if (promise.user.type_user == 'student') {
        router.push({ name: "DashboardStudent" })
        return
      }
      if (promise.user.type_user == 'teacher') {
        router.push({ name: "DashboardTeacher" })
        return
      }
      if (promise.user.type_user == 'admin') {
        if (isEmpty(promise.user.company_id)) {
          router.push({ name: "Company-List" })
          return
        }
        router.push({ name: "Home" })
        return
      }

    };

    if (promise.code === 422) errorsBack.value = promise.errors ?? {};
  }
}

// Verificar si el usuario está autenticado al cargar el componente
const isAuthenticated = authenticationStore.checkAuthentication();
if (isAuthenticated) {
  router.push({ name: "Home" }) // Redirige a la página de inicio si ya está autenticado
}

</script>

<template>
  <a href="javascript:void(0)">
    <div class="auth-logo d-flex align-center gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="auth-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </a>

  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol md="8" class="d-none d-md-flex">
      <div class="position-relative bg-background w-100 me-0">
        <div class="d-flex align-center justify-center w-100 h-100" style="padding-inline: 6.25rem;">
          <VImg max-width="613" :src="authThemeImg" class="auth-illustration mt-16 mb-2" />
        </div>

        <img class="auth-footer-mask flip-in-rtl" :src="authThemeMask" alt="auth-footer-mask" height="280" width="100">
      </div>
    </VCol>

    <VCol cols="12" md="4" class="auth-card-v2 d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-6">
        <VCardText>
          <h4 class="text-h4 mb-1">
            Bienvenido Apreciado Usuario
          </h4>
          <p class="mb-0">
            Por favor, ingrese su usuario (cédula / correo electrónico) y contraseña.
          </p>
        </VCardText>
        <VCardText>
          <VForm ref="refForm" @submit.prevent="() => { }">
            <VRow>
              <!-- user -->
              <VCol cols="12">
                <AppTextField v-model="form.user" autofocus label="Correo electrónico / Cédula de identidad" clearable
                  :rules="[requiredValidator]" />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField v-model="form.password" label="Contraseña" placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" clearable :rules="[requiredValidator]" />

                <div class="d-flex align-center flex-wrap justify-space-between mt-1 mb-4">
                  <VCheckbox v-model="rememberMe" label="Recuérdame" />
                </div>

                <VBtn class="mt-2" :loading="loading" :disabled="loading" block type="submit" @click="login()">
                  Ingresar
                </VBtn>
              </VCol>

            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
