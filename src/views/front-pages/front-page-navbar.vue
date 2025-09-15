<script setup lang="ts">
import { useDisplay } from "vuetify";


import { useWindowScroll } from "@vueuse/core";

const props = defineProps(
  {
    activeId: String,
    school_id: {
      type: [Number, String],
      required: true,
    },
  }
);

const display = useDisplay();

interface linksMenu {
  type_detail_name: string,
  icon: string,
  color: string,
  content: string,
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
    isExternal?: boolean;
    icon?: string;
  }>
>([
  {
    title: "Principal",
    to: "Pw-home",
    hash: null,
    icon: "tabler-device-laptop",
  },
  {
    title: "Inicio",
    to: 'Pw-school',
    params: {
      school_id: props.school_id
    },
    hash: null,
    icon: "tabler-home",
  },
  {
    title: "Servicios",
    to: "",
    hash: "#servicioData",
    icon: "tabler-brand-slack",
  },
  {
    title: "Contactanos",
    to: "",
    hash: null,
    icon: "tabler-address-book",
  },
  {
    title: "Redes sociales",
    to: "",
    hash: "",
    icon: "tabler-layout-grid",
  },
  {
    title: "Pago de Mensualidades",
    to: "",
    hash: "",
    isExternal: true, // Marca como externa
    icon: "",
  },
  // {
  //   title: "Biblioteca virtual",
  //   to: "https://inforcolegio.blogspot.com/2018/04/clase-25042018.html",
  //   hash: "",
  //   isExternal: true, // Marca como externa
  //   icon: "tabler-books",
  // },
  {
    title: "Inscripciones Virtuales",
    to: "https://docs.google.com/forms/d/e/1FAIpQLSdpFCCns9x0ngiVVck-Cil-HKyKnw5kSdV0bS7mkPTIF6PAeA/viewform",
    hash: "",
    isExternal: true, // Marca como externa
    icon: "tabler-books",
  },
  {
    title: "Materia Pendiente",
    to: "Pw-SubjectPennding",
    hash: "",
    icon: "tabler-file",
  },
  {
    title: "Acceso",
    to: "Login",
    hash: "",
    icon: "tabler-lock-access",
  },
]);

const filteredMenu = computed(() => {

  const updateItemWithLink = (item) => {
    const link = links.value.find(link => link.type_detail_name === item.title);
    if (link) {
      return {
        ...item,
        icon: link.icon, // Nuevo icono
        to: link.content, // O el valor que quieras usar
      };
    }
    return null; // Si no existe el link, excluimos el elemento
  };

  return menu.value.map(item => {
    // Verificación y actualización para otros elementos
    if (["Materia Pendiente", "Pago de Mensualidades", "Biblioteca virtual"].includes(item.title)) {
      return updateItemWithLink(item);
    }

    // Retorna el resto de los elementos sin cambios
    return item;
  }).filter(Boolean); // Filtra elementos nulos
});

// Usa `filteredMenu` en tu template




const isMenuOpen = ref(false)
const isMegaMenuOpen = ref(false)



const openLink = (link: string) => {
  window.open(link, "_blank");
};

const social_networks = ref<linksMenu[]>([])
const links = ref([])
onMounted(async () => {
  const { data, response } = await useApi("pw-linksMenu/" + props.school_id).get();
  if (data.value.code == 200) {
    social_networks.value = data.value.social_networks;
    links.value = data.value.links;
  }
});

//ModalContactanosMenu 
const refModalContactanosMenu = ref()
const openModalContactanosMenu = () => {
  refModalContactanosMenu.value.openDialog()
}

</script>

<template>
  <!-- 👉 Navigation drawer for mobile devices  -->
  <VNavigationDrawer v-model="sidebar" width="275" disable-resize-watcher>
    <!-- Nav items -->
    <div>
      <div class="d-flex flex-column gap-y-4 pa-4">
        <template v-for="(item, index) in filteredMenu" :key="index">

          <a v-if="item.isExternal" :href="item.to" :target="item.isExternal ? '_blank' : '_self'"
            class="nav-link font-weight-medium py-2 px-lg-4">
            <VIcon :icon="item.icon" color="primary" />
            {{ item.title }}
          </a>


          <!-- Contactanos -->
          <span v-else-if="item.title == 'Contactanos'" class="font-weight-medium cursor-pointer"
            style="color: rgba(var(--v-theme-on-surface))" @click="openModalContactanosMenu()">
            <VIcon :icon="item.icon" color="primary" />
            {{ item.title }}
          </span>



          <RouterLink v-else :to="{
            name: item.to,
            hash: `#${item.title.toLowerCase().replace(' ', '-')}`,
          }" class="nav-link font-weight-medium" :class="[
            props.activeId?.toLocaleLowerCase().replace('-', ' ') ===
              item.title.toLocaleLowerCase()
              ? 'active-link'
              : '',
          ]">
            <VIcon :icon="item.icon" color="primary" />
            {{ item.title }}
          </RouterLink>

        </template>
        <div class="font-weight-medium cursor-pointer">
          <div :class="[isMenuOpen ? 'mb-6 active-link' : '']" style="color: rgba(var(--v-theme-on-surface))"
            class="nav-link font-weight-medium" @click="isMenuOpen = !isMenuOpen">
            <VIcon icon=" tabler-layout-grid" color="primary" />
            Redes sociales
            <VIcon :icon="isMenuOpen ? 'tabler-chevron-up' : 'tabler-chevron-down'" />
          </div>
          <div class="px-4" :class="isMenuOpen ? 'd-block' : 'd-none'" v-if="social_networks.length > 0">
            <div v-for="(item, index) in social_networks" :key="index">
              <div class="d-flex align-center gap-x-3 mb-4">
                <VAvatar variant="tonal" :color="item.color" rounded :icon="item.icon" />
                <div class="text-body-1 text-high-emphasis font-weight-medium">
                  {{ item.type_detail_name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation drawer close icon -->
    <VIcon id="navigation-drawer-close-btn" icon="tabler-x" size="20" @click="sidebar = !sidebar" />
  </VNavigationDrawer>


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
      <div class="d-flex align-center justify-center w-100">


        <!-- landing page sections -->
        <div class="text-base align-center d-none d-md-flex ">
          <template v-for="(item, index) in filteredMenu" :key="index">

            <a v-if="item.isExternal" :href="item.to" :target="item.isExternal ? '_blank' : '_self'"
              class="nav-link font-weight-medium py-2 px-2 px-lg-4">
              <VIcon :icon="item.icon" color="primary" />
              {{ item.title }}
            </a>

            <!-- Redes sociales -->
            <span v-else-if="item.title == 'Redes sociales'" class="font-weight-medium cursor-pointer px-2 px-lg-4 py-2"
              style="color: rgba(var(--v-theme-on-surface))">
              <VIcon :icon="item.icon" color="primary" />
              {{ item.title }}
              <VIcon icon="tabler-chevron-down" size="12" />
              <VMenu v-model="isMegaMenuOpen" open-on-hover activator="parent" transition="slide-y-transition"
                location="bottom center" offset="16" content-class="mega-menu" location-strategy="static"
                close-on-content-click>
                <VCard max-width="1000">
                  <VCardText class="pa-8">
                    <div class="nav-menu">
                      <div v-for="(item, index) in social_networks" :key="index">
                        <div class="d-flex align-center gap-x-3 mb-6 cursor-pointer" @click="openLink(item.content)">
                          <VAvatar variant="tonal" :color="item.color" rounded :icon="item.icon" />
                          <div class="text-body-1 text-high-emphasis font-weight-medium">
                            {{ item.type_detail_name }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </VCardText>
                </VCard>
              </VMenu>
            </span>

            <!-- Contactanos -->
            <span v-else-if="item.title == 'Contactanos'" class="font-weight-medium cursor-pointer px-2 px-lg-4 py-2"
              style="color: rgba(var(--v-theme-on-surface))" @click="openModalContactanosMenu()">
              <VIcon :icon="item.icon" color="primary" />
              {{ item.title }}
            </span>

            <RouterLink v-else :to="{
              name: item.to,
              hash: item.hash,
            }" class="nav-link font-weight-medium py-2 px-2 px-lg-4">
              <VIcon :icon="item.icon" color="primary" />

              {{ item.title }}
            </RouterLink>
          </template>


        </div>
      </div>
    </VAppBar>

    <ModalContactanosMenu ref="refModalContactanosMenu" />

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
