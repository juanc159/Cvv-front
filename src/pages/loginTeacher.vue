<script setup lang="ts">
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import authV2LoginIllustrationBorderedDark from "@images/pages/auth-v2-login-illustration-bordered-dark.png";
import authV2LoginIllustrationBorderedLight from "@images/pages/auth-v2-login-illustration-bordered-light.png";
import authV2LoginIllustrationDark from "@images/pages/auth-v2-two-step-illustration-dark.png";
import authV2LoginIllustrationLight from "@images/pages/auth-v2-two-step-illustration-light.png";
import authV2MaskDark from "@images/pages/misc-mask-dark.png";
import authV2MaskLight from "@images/pages/misc-mask-light.png";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import { VForm } from "vuetify/components/VForm";

definePage({
  name: "Login-Teacher",
  path: "/loginTeacher",
  meta: {
    layout: "blank",
  },
});

const form = reactive({
  email: "",
  password: "",
});
const errorsBack = ref<IErrorsBack>({});
const isPasswordVisible = ref(false);

const formValidation = ref<VForm>();

const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true
);

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);

const authenticationStore = useAuthenticationStore();
const { loading } = storeToRefs(authenticationStore);

const router = useRouter();

const login = async () => {
  const validation = await formValidation.value?.validate();
  if (validation?.valid) {
    const promise = await authenticationStore.loginTeacher(form);

    if (promise.code == 200) router.push({ name: "DashboardTeacher" });
    if (promise.code === 422) errorsBack.value = promise.errors ?? {}; //muestra error del back
  }
};
</script>

<template>
  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol md="8" class="d-none d-md-flex">
      <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg max-width="505" :src="authThemeImg" class="auth-illustration mt-16 mb-2" />
        </div>

        <VImg class="auth-footer-mask" :src="authThemeMask" />
      </div>
    </VCol>

    <VCol cols="12" md="4" class="auth-card-v2 d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <VNodeRenderer :nodes="themeConfig.app.logo" class="mb-6" />
          <h4 class="text-h4 mb-1">
            Welcome to
            <span class="text-capitalize">{{ themeConfig.app.title }}</span>! 👋🏻
          </h4>
          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>
        <VCardText>
          <VForm ref="formValidation">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField clearable v-model="form.email" autofocus label="Cédula" :rules="[requiredValidator]"
                  :error-messages="errorsBack.email" />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField clearable v-model="form.password" label="Password" placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'" :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                    " @click:append-inner="isPasswordVisible = !isPasswordVisible" :rules="[requiredValidator]"
                  :error-messages="errorsBack.password" />

                <VBtn :loading="loading" block @click="login()" type="button" class="mt-5">
                  Login
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
