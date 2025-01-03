<script lang="ts" setup>
import { useToast } from '@/composables/useToast';
import { IProjectDetail } from '../Actions/http/getProjectDetail';
import { yDocStore } from '../Store/yDocStore';
const { toast } = useToast();

const props = defineProps<{
  project: IProjectDetail;
  userData: any | undefined;
}>();

const emit = defineEmits<{
  (e: "showJoiningUsersModal"): void;
}>();

function convertLetterToUpperCase() {

  if (typeof props.userData !== "undefined") {
    const user = props.userData?.user;
    return (user.full_name as string)[0].toUpperCase();
  }
}

function copyProjectLink() {
  // Obtener el inicio de la URL (dominio + protocolo)
  const baseUrl = window.location.origin;

  // Crear el link completo
  const projectLink = baseUrl + "/Project/AddJoinee?project_code=" + props?.project?.code;

  // Copiar al portapapeles
  navigator.clipboard
    .writeText(projectLink)
    .then(() => {
      toast("Project link copied", "", "info");
    })
    .catch((error) => toast("Error copying project link", "", "danger"));
}

</script>
<template>
  <div class="flex justify-between p-2 mt-1">
    <div class="flex bg-white p-2 px-3 gap-2 py-2 rounded-md shadow-md">
      <img :src="'/img/logo.png'" width="35" alt="logo" />
      <span class="text-slate-200">|</span><span class="pt-1"> {{ project?.name }}</span>

      <span class="text-slate-200">|</span>

      <RouterLink :to="{ name: 'Project-List' }"
        class="flex border-0 text-medium gap-1 hover:bg-slate-100 px-1 py-1 rounded-md">
        <VIcon icon="tabler-squares"></VIcon>
        <span>Projectos</span>
      </RouterLink>
    </div>

    <div class="flex gap-2 bg-white p-2 px-2 py-2 rounded-md shadow-md">
      <div class="flex pr-4">
        <VBtn class="w-8 h-8 mx-2 bg-yellow-300 rounded-full" icon>
          {{ convertLetterToUpperCase() }}

        </VBtn>
        <span @click="emit('showJoiningUsersModal')"
          class="pt-1 text-sm text-gray-600 font-semibold hover:bg-slate-200 px-2 py-1 rounded-md cursor-pointer">+{{
            yDocStore.joinees.length }} usuarios</span>
      </div>

      <VBtn @click="copyProjectLink" class="flex gap-2 bg-blue-500 py-1 px-2 rounded-md text-white">
        <VIcon icon="tabler-plus"></VIcon>
        <span class="text-sm"> Compartir</span>
      </VBtn>
    </div>
  </div>
</template>
