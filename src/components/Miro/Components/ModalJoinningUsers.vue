<script setup lang="ts">
import { useToast } from '@/composables/useToast';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { yDocStore } from '../Store/yDocStore';

const emit = defineEmits<{
  (e: "reloadTable"): void;
}>();

const authenticationStore = useAuthenticationStore();
const { toast } = useToast()

const titleDialog = ref<string>("Usuarios conectados")

const isDialogVisible = ref<boolean>(false);

const handleDialogVisible = () => {
  isDialogVisible.value = !isDialogVisible.value;
};

const openDialog = async () => {
  handleDialogVisible();

};

defineExpose({
  openDialog,
});

</script>

<template>

  <VDialog v-model="isDialogVisible" max-width="30rem" transition="dialog-transition">

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="handleDialogVisible()" />

    <!-- Toolbar -->
    <div>
      <VToolbar color="primary">
        <VToolbarTitle>{{ titleDialog }}</VToolbarTitle>
      </VToolbar>
    </div>
    <VCard>
      <VCardText>

        <VList lines="two" border>
          <template v-for="(user, index) of yDocStore.joinees" :key="user.name">
            <VListItem>
              <template #prepend>
                <VAvatar color="primary" variant="tonal">
                  {{ avatarText(user.full_name) }}
                </VAvatar>
              </template>
              <VListItemTitle>
                {{ user.full_name }}
              </VListItemTitle>
              <VListItemSubtitle class="mt-1">
                <span class="text-primary">{{ user.role_name }}</span>
                &mdash;
                <span>{{ user.email }}</span>
              </VListItemSubtitle>

            </VListItem>
            <VDivider v-if="index !== yDocStore.joinees.length - 1" />
          </template>
        </VList>
      </VCardText>

    </VCard>
  </VDialog>
</template>
