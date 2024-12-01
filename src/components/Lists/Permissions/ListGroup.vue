<script setup lang="ts">

import { useRoleStore } from "@/pages/UserAccess/Role/stores/useRoleStore";

const roleStore = useRoleStore();
const { selectedElements, selectedFather } = storeToRefs(roleStore);

const { father } = defineProps({
  father: {
    required: true,
    type: Object,
  },
});

</script>
<template>
  <VListGroup>
    <template #activator="{ props }">
      <VListItem v-bind="props" :title="father.title" :prepend-icon="father.icon" />
    </template>


    <VListItem>
      <template v-for="({ id, description, check_state }, keyPermissions) in father.permissions" :key="keyPermissions">

        <VSwitch v-if="id != 1 && keyPermissions == 0" class="mb-2" label="Todos" :value="father.id"
          :id="'selectAll-' + father.id" v-model="selectedFather"
          @update:model-value="roleStore.handleCardCheckboxChange(father.id)" />

        <VSwitch :disabled="id == 1" class="my-0 py-0" :label="description" :value="id" :id="`permissions-${id}`"
          v-model="selectedElements" />
      </template>

    </VListItem>
    <template v-for="(item, key) in father.children" :key="key">
      <ListGroup :father="item" />
    </template>
  </VListGroup>
</template>
