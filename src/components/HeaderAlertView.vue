<script lang="ts" setup>
const cpProps = defineProps({
  class: { type: String, default: "" },
  divider: { type: Boolean, default: true },
  title: { type: String, default: "" },
  titleClass: { type: String, default: "" },
  subTitle: { type: String, default: "" },
  routerLink: { type: String || Object, default: "" },
  action: { type: String, default: "create" },
  validateCrud: { type: Boolean, default: false },
  // Btn
  btnBack: { type: Boolean, default: false },
  btnAction: { type: String, default: "" },
  btnText: { type: String, default: "" },
  // Icon
  icon: { type: String, default: "" },
  iconSize: { type: String, default: "x-small" },
  iconColor: { type: String, default: "vblue" },
  iconTwo: { type: String, default: "" },
  iconTwoSize: { type: String, default: "x-small" },
  iconTwoColor: { type: String, default: "vblue" },
});

const emit = defineEmits(["changeScreenBack"]);
const changeScreenBack = async (typeAction: string) => {
  emit("changeScreenBack", typeAction);
};
</script>

<template>
  <div>
    <VAlert border="start" color="primary" variant="tonal" class="mb-2">
      <template #title>
        <span v-show="cpProps.validateCrud == false">
          <b :class="cpProps.titleClass">{{ cpProps.title }}</b>
        </span>
        <span v-show="cpProps.validateCrud == true">
          <b :class="cpProps.titleClass" v-show="cpProps.action == 'create'">
            Nuev@<span v-show="cpProps.title != ''"
              >&nbsp;{{ cpProps.title }}</span
            >
          </b>
          <b :class="cpProps.titleClass" v-show="cpProps.action == 'edit'">
            Editar<span v-show="cpProps.title != ''"
              >&nbsp;{{ cpProps.title }}</span
            >
          </b>
        </span>
      </template>
      <template #prepend>
        <span v-show="cpProps.validateCrud == false">
          <VIcon
            class="rounded-0 rounded-ts-sm rounded-bs-sm"
            v-show="cpProps.icon != ''"
            :icon="cpProps.icon"
            :color="cpProps.iconColor"
          />
          <VIcon
            class="rounded-0 rounded-te-sm rounded-be-sm"
            v-show="cpProps.iconTwo != ''"
            :icon="cpProps.iconTwo"
            :color="cpProps.iconTwoColor"
          />
        </span>
        <span v-show="cpProps.validateCrud == true">
          <VIcon
            class="rounded-0 rounded-ts-sm rounded-bs-sm"
            v-show="cpProps.action == 'create'"
            color="success"
            icon="tabler-plus"
          />
          <VIcon
            class="rounded-0 rounded-te-sm rounded-be-sm"
            v-show="cpProps.action == 'create' && cpProps.iconTwo != ''"
            color="vblue"
            :icon="cpProps.iconTwo"
          />
          <VIcon
            class="rounded-0 rounded-ts-sm rounded-ts-sm"
            v-show="cpProps.action == 'edit'"
            color="warning"
            icon="tabler-pencil"
          />
          <VIcon
            class="rounded-0 rounded-te-sm rounded-be-sm"
            v-show="cpProps.action == 'edit' && cpProps.iconTwo != ''"
            color="vblue"
            :icon="cpProps.iconTwo"
          />
        </span>
      </template>

      <div class="d-flex flex-wrap">
        <VSheet>
          <p class="mb-0">
            {{ cpProps.subTitle }}
            <b v-show="cpProps.routerLink != ''">
              <RouterLink :to="cpProps.routerLink">Ingresa aqui</RouterLink>
            </b>
          </p>
        </VSheet>
        <VSheet class="ms-auto mb-1" v-show="cpProps.btnBack == true">
          <VTooltip
            :text="cpProps.btnText == '' ? 'Atras' : cpProps.btnText"
            location="top"
          >
            <template v-slot:activator="{ props }">
              <VBtn
                class="ms-1"
                color="light"
                rounded="lg"
                v-bind="props"
                @click="changeScreenBack(cpProps.btnAction)"
              >
                <VIcon color="warning" icon="tabler-arrow-left" />
                &nbsp;Atras
              </VBtn>
            </template>
          </VTooltip>
        </VSheet>
      </div>
      <p class="mb-0" v-if="cpProps.validateCrud == true">
        Todos los campos marcados con <b class="text-warning"> * </b> son
        obligatorios
      </p>
    </VAlert>
  </div>
</template>
