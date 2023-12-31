<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router/auto";
import { useDisplay } from "vuetify";

import { useWindowScroll } from "@vueuse/core";

const props = defineProps({
  activeId: String,
  school: Object,
});

const route = useRoute()
const display = useDisplay();

interface navItem {
  name: string;
  to: RouteLocationRaw;
}

interface MenuItem {
  listTitle: string;
  listIcon: string;
  navItems: navItem[];
}
const { y } = useWindowScroll();

const sidebar = ref(false);

watch(
  () => display,
  () => {
    return display.mdAndUp ? (sidebar.value = false) : sidebar.value;
  },
  { deep: true }
);

const menu = ref<
  Array<{
    title: string;
    to: string;
    hash: string | null;
    params?: object;
  }>
>([
  {
    title: "Principal",
    to: "Pw-home",
    hash: null,
  },
  {
    title: "Inicio",
    to: 'Pw-school',
    params: {
      school_id: route.params.school_id
    },
    hash: null,
  },
  {
    title: "Servicios",
    to: "",
    hash: "#servicioData",
  },
  {
    title: "Contactanos",
    to: "",
    hash: "#contactData",
  },
]);

const openLink = (link: string) => {
  window.open(link, "_blank");
};
</script>

<template>
  <!-- 👉 Navigation drawer for mobile devices  -->
  <VNavigationDrawer v-model="sidebar" width="275" disable-resize-watcher>
    <!-- Nav items -->
    <div>
      <div class="d-flex flex-column gap-y-4 pa-4">
        <RouterLink v-for="(item, index) in [
          'Principal',
          'Inicio',
          'Sobre nosotros',
          'Galeria',
          'Contactanos',
        ]" :key="index" :to="{
  name: 'Pw-home',
  hash: `#${item.toLowerCase().replace(' ', '-')}`,
}" class="nav-link font-weight-medium" :class="[
  props.activeId?.toLocaleLowerCase().replace('-', ' ') ===
    item.toLocaleLowerCase()
    ? 'active-link'
    : '',
]">
          {{ item }}
        </RouterLink>
      </div>
    </div>

    <!-- Navigation drawer close icon -->
    <VIcon id="navigation-drawer-close-btn" icon="tabler-x" size="20" @click="sidebar = !sidebar" />
  </VNavigationDrawer>

  <!-- 👉 Navbar for desktop devices  -->
  <div class="front-page-navbar">
    <VAppBar :color="$vuetify.theme.current.dark
      ? 'rgba(var(--v-theme-background))'
      : 'rgba(255,255,255, 0.38)'
      " :class="y > 10
    ? 'app-bar-scrolled'
    : [
      $vuetify.theme.current.dark ? 'app-bar-dark' : 'app-bar-light',
      'elevation-0',
    ]
    " class="navbar-blur">
      <!-- toggle icon for mobile device -->
      <IconBtn id="vertical-nav-toggle-btn" class="ms-n3 me-2 d-inline-block d-md-none" @click="sidebar = !sidebar">
        <VIcon size="26" icon="tabler-menu-2" color="rgba(var(--v-theme-on-surface))" />
      </IconBtn>
      <!-- Title and Landing page sections -->
      <div class="d-flex align-center justify-space-between w-100">
        <!-- <VAppBarTitle class="me-6">
          <RouterLink
            to="/"
            class="d-flex gap-x-4"
            :class="$vuetify.display.mdAndUp ? 'd-none' : 'd-block'"
          >
            <div class="d-flex gap-x-3 align-center">
              <VNodeRenderer :nodes="themeConfig.app.logo" />
              <h4
                class="text-h4 text-capitalize text-truncate font-weight-bold"
              >
                {{ themeConfig.app.title }}
              </h4>
            </div>
          </RouterLink>
        </VAppBarTitle> -->

        <!-- landing page sections -->
        <div class="text-base align-center d-none d-md-flex">
          <RouterLink v-for="(item, index) in menu" :key="index" :to="{
            name: item.to,
            hash: item.hash,
          }" class="nav-link font-weight-medium py-2 px-2 px-lg-4">
            {{ item.title }}
          </RouterLink>
        </div>
        <div v-if="props.school?.social_networks.length > 0">
          <VBtn icon v-for="(item, index) in props.school?.social_networks" :key="index" @click="openLink(item.content)">
            <VIcon size="30" :icon="item.icon"></VIcon>
          </VBtn>
        </div>
      </div>
    </VAppBar>
  </div>
</template>

<style lang="scss" scoped>
.nav-menu {
  display: flex;
  gap: 3rem;
}

.nav-link {
  &:not(:hover) {
    color: rgb(var(--v-theme-on-surface));
  }
}

.page-link {
  &:hover {
    color: rgb(var(--v-theme-primary)) !important;
  }
}

@media (max-width: 1280px) {
  .nav-menu {
    gap: 2.25rem;
  }
}

@media (min-width: 1920px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(1440px - 32px);
    }
  }
}

@media (min-width: 1280px) and (max-width: 1919px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(1200px - 32px);
    }
  }
}

@media (min-width: 960px) and (max-width: 1279px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(900px - 32px);
    }
  }
}

@media (min-width: 600px) and (max-width: 959px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(100% - 64px);
    }
  }
}

@media (max-width: 600px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(100% - 32px);
    }
  }
}

.nav-item-img {
  border: 10px solid rgb(var(--v-theme-background));
  border-radius: 10px;
}

.active-link {
  color: rgb(var(--v-theme-primary)) !important;
}

.app-bar-light {
  border: 2px solid rgba(var(--v-theme-surface), 68%);
  border-radius: 0.5rem;
  background-color: rgba(var(-v--theme-surface), 38%);
  transition: all 0.1s ease-in-out;
}

.app-bar-dark {
  border: 2px solid rgba(255, 255, 255, 8%);
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 4%);
  transition: all 0.1s ease-in-out;
}

.app-bar-scrolled {
  border-radius: 0.5rem;
  background-color: rgb(var(--v-theme-surface)) !important;
  transition: all 0.1s ease-in-out;
}

.front-page-navbar::after {
  position: fixed;
  z-index: 2;
  backdrop-filter: saturate(100%) blur(6px);
  block-size: 5rem;
  content: "";
  inline-size: 100%;
  inset-block-start: 0;
}
</style>

<style lang="scss">
@use "@layouts/styles/mixins" as layoutMixins;

.mega-menu {
  position: fixed !important;
  inset-block-start: 5rem;
  inset-inline-start: 50%;
  transform: translateX(-50%);
}

.front-page-navbar {
  .v-toolbar__content {
    padding-inline: 1.5rem !important;
  }

  .v-toolbar {
    inset-inline: 0 !important;
    margin-block-start: 1rem !important;
    margin-inline: auto !important;
  }
}

.mega-menu-item {
  &:hover {
    color: rgb(var(--v-theme-primary)) !important;
  }
}

#navigation-drawer-close-btn {
  position: absolute;
  cursor: pointer;
  inset-block-start: 0.5rem;
  inset-inline-end: 1rem;
}
</style>
