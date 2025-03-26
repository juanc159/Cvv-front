<script setup lang="ts">
import { OptionsFilter, Queries } from '@/components/CustomComponents/Filter/types'; // Ajusta la ruta según tu proyecto
import { computed, defineProps, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';


/**
 * Componente FilterDialogNew: un sistema de filtros dinámicos para Vue 3 con Composition API.
 * Permite filtrar datos mediante un campo de búsqueda general, un diálogo de filtros avanzados y filtros adicionales vía slot.
 * Sincroniza los filtros con los parámetros de la URL usando Vue Router, ofreciendo modos automático (debounce) y manual (botón).
 */

const props = defineProps<{
  optionsFilter: OptionsFilter;
  tableLoading?: boolean; // Nueva prop para el estado de carga de la tabla
}>();

// Estado reactivo local para los filtros
const filters = reactive({
  dialog: {
    title: props.optionsFilter.dialog?.title ?? 'Filtros Generales',
    cols: props.optionsFilter.dialog?.cols ?? '12',
    width: props.optionsFilter.dialog?.width ?? '800',
    inputs: props.optionsFilter.dialog?.inputs.map(field => ({
      ...field,
      value: field.value
    }))
  },
  extraFilters: { ...props.optionsFilter.extraFilters }
});

// Emits
const emit = defineEmits<{
  (e: 'forceSearch'): void;
}>();

const generalSearch = ref<string>('');
const queries = ref<Queries>({
  sort: '',
  'filter[inputGeneral]': '',
  page: 1,
  perPage: 15
});

const isDialogOpen = ref(false);
const isLoading = ref(false);
const router = useRouter();
const route = useRoute();
const showSearchButton = ref(false);
const isButtonSearchMode = ref(false);
const debounceTimeout = ref<NodeJS.Timeout | null>(null);

// Actualiza los parámetros de la URL con los valores actuales de los filtros
const updateQueries = async () => {
  queries.value = {
    sort: route.query.sort ? route.query.sort as string : '', // Preservamos el sort existente
    'filter[inputGeneral]': '',
    page: 1,
    perPage: 15
  };

  queries.value['filter[inputGeneral]'] = generalSearch.value;

  filters.dialog.inputs?.forEach(field => {
    if (field.value !== null && field.value !== undefined && field.value !== '') {
      if (['select', 'selectChipCount'].includes(field.type)) {
        const values = Array.isArray(field.value)
          ? field.value.map(item => item.value)
          : [field.value?.value];
        queries.value[`filter[${field.name}]`] = values.join(',');
      } else if (field.type === 'selectApi') {
        const values = Array.isArray(field.value)
          ? field.value.map(item => `${item.value}|${item.title}`)
          : [field.value ? `${field.value.value}|${field.value.title}` : ''];
        queries.value[`filter[${field.name}]`] = values.filter(v => v !== '').join(',');
      } else {
        queries.value[`filter[${field.name}]`] = field.value;
      }
    }
  });

  for (const key in filters.extraFilters) {
    const field = filters.extraFilters[key];
    if (field.value !== null && field.value !== undefined && field.value !== '') {
      queries.value[`filter[${key}]`] = field.value;
    }
  }

  await router.push({ query: { ...queries.value } });
};

// Combinamos isLoading y tableLoading para deshabilitar el botón
const isButtonDisabled = computed(() => isLoading.value || props.tableLoading);

// Método para forzar la búsqueda
const forceSearch = async () => {
  isLoading.value = true; // Indicamos que está cargando
  await updateQueries(); // Esperamos a que los parámetros se actualicen
  isLoading.value = false; // Reseteamos el estado de carga
  emit('forceSearch'); // Emitimos el evento después de actualizar la URL
};

// Aplica los filtros manualmente al hacer clic en el botón "Buscar"
const applySearch = async () => {
  await forceSearch(); // Esperamos a que forceSearch termine
  // closeDialog(); // Cerramos el modal
};

// Ejecuta updateQueries con un debounce de 500ms
const debounceUpdateQueries = () => {
  if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
  debounceTimeout.value = setTimeout(() => {
    updateQueries();
    debounceTimeout.value = null;
  }, 500);
};

// Maneja cambios en el campo de búsqueda general
const onInputChange = () => {
  if (!isButtonSearchMode.value) {
    debounceUpdateQueries();
  }
};

// Observa cambios en extraFilters
watch(
  () => filters.extraFilters,
  () => {
    if (!isButtonSearchMode.value) {
      debounceUpdateQueries();
    }
  },
  { deep: true }
);

// Funciones para el diálogo
const openDialog = () => {
  isDialogOpen.value = true;
};

const closeDialog = () => {
  isDialogOpen.value = false;
};

// Limpia todos los filtros
const clearFilters = () => {
  generalSearch.value = '';
  filters.dialog.inputs?.forEach(field => {
    field.value = ['selectChipCount', 'select', 'selectApi'].includes(field.type) ? [] : '';
  });
  for (const key in filters.extraFilters) {
    filters.extraFilters[key].value = ['selectChipCount', 'select', 'selectApi'].includes(filters.extraFilters[key].type) ? [] : '';
  }
  queries.value = { sort: '', 'filter[inputGeneral]': '', page: 1, perPage: 15 };
  router.push({ query: { ...queries.value } });
};

// Inicializa los valores desde los parámetros de la URL
const initializeFromQuery = () => {
  const queryParams = route.query;

  generalSearch.value = queryParams['filter[inputGeneral]'] ? queryParams['filter[inputGeneral]'] as string : '';

  filters.dialog.inputs?.forEach(field => {
    const queryValue = queryParams[`filter[${field.name}]`];
    if (queryValue) {
      if (['select', 'selectChipCount'].includes(field.type)) {
        const values = (queryValue as string).split(',');
        field.value = field.options?.filter(opt => values.includes(String(opt.value))) || [];
      } else if (field.type === 'selectApi') {
        field.value = [];
        const values = (queryValue as string).split(',');
        values.forEach(element => {
          const [value, title] = element.split('|');
          const isNumber = !isNaN(Number(value));
          const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value);
          const infoValue = isNumber ? Number(value) : (isUUID ? value : value);
          field.value.push({ value: infoValue, title: title || value });
        });
      } else {
        field.value = queryValue as string;
      }
    } else {
      field.value = ['select', 'selectChipCount', 'selectApi'].includes(field.type) ? [] : '';
    }
  });

  for (const key in filters.extraFilters) {
    const queryValue = queryParams[`filter[${key}]`];
    filters.extraFilters[key].value = queryValue ? queryValue as string : '';
  }

  queries.value = { ...queries.value, ...queryParams };
};

// Configura el componente al montarse
onMounted(() => {
  initializeFromQuery();
  showSearchButton.value = !!props.optionsFilter.extraFilters && Object.keys(props.optionsFilter.extraFilters).length > 0;
  isButtonSearchMode.value = !!props.optionsFilter.showBtnSearch;
});

// Limpia el campo de búsqueda general
const clearGeneralSearchInput = () => {
  generalSearch.value = '';
};

// Calcula los filtros activos para mostrar como chips
const activeFilters = computed(() => {
  const filters: Record<string, string> = {};
  for (const key in route.query) {
    if (key.startsWith('filter[')) {
      const filterKey = key.replace('filter[', '').replace(']', '');
      const value = route.query[key]; // No asumimos que es string directamente
      const stringValue = value !== null && value !== undefined ? String(value) : ''; // Convertimos a string de forma segura
      if (stringValue.trim() !== '') { // Usamos stringValue para trim
        const field = props.optionsFilter.dialog?.inputs?.find(f => f.name === filterKey);
        if (field) {
          if (field.type === 'selectApi') {
            const titles = stringValue.split(',').map(v => v.split('|')[1] || v).join(', ');
            filters[filterKey] = titles;
          } else if (['select', 'selectChipCount'].includes(field.type)) {
            const titles = stringValue.split(',').map(v => field.options?.find(opt => opt.value == v)?.title || v).join(', ');
            filters[filterKey] = titles;
          } else if (field.type === 'booleanActive') {
            const selectedOption = booleanActive.find(opt => String(opt.value) === stringValue);
            filters[filterKey] = selectedOption ? selectedOption.title : stringValue;
          } else {
            filters[filterKey] = stringValue;
          }
        } else {
          filters[filterKey] = stringValue; // Fallback para filtros no definidos en dialog.inputs
        }
      }
    }
  }
  return filters;
});

// Elimina un filtro específico
const removeFilter = (filterKey: string) => {
  const query = { ...route.query };
  delete query[`filter[${filterKey}]`];

  if (filterKey === 'inputGeneral') {
    generalSearch.value = '';
  }

  const dialogField = filters?.dialog?.inputs?.find(f => f.name === filterKey);
  if (dialogField) {
    dialogField.value = ['selectChipCount', 'select', 'selectApi'].includes(dialogField.type) ? [] : '';
  }

  if (props.optionsFilter?.extraFilters && props.optionsFilter.extraFilters[filterKey]?.value !== undefined) {
    props.optionsFilter.extraFilters[filterKey].value = '';
  }

  router.push({ query });
};

/**
 * Formatea las claves de los filtros para mostrar en los chips.
 * Usa las etiquetas de optionsFilter.filterLabels si existen, o el label de dialog.inputs, o reemplaza '.' por ' - ' como fallback.
 * @param {string} key - Clave del filtro (ej: 'inputGeneral', 'name').
 * @returns {string} Etiqueta formateada para mostrar en el chip.
 * @example
 * ```typescript
 * // Con optionsFilter.filterLabels = { inputGeneral: 'Buscar Todo' }
 * formatFilterKey('inputGeneral'); // 'Buscar Todo'
 * // Con dialog.inputs = [{ name: 'name', label: 'Nombre Completo' }]
 * formatFilterKey('name'); // 'Nombre Completo'
 * // Sin configuración específica
 * formatFilterKey('author.name'); // 'author - name'
 * ```
 */
const formatFilterKey = (key: string) => {
  // Prioridad 1: Usar filterLabels si existe en optionsFilter
  if (props.optionsFilter.filterLabels && props.optionsFilter.filterLabels[key]) {
    return props.optionsFilter.filterLabels[key];
  }

  // Prioridad 2: Usar label de dialog.inputs si el filtro está en el diálogo
  const dialogField = props.optionsFilter.dialog.inputs.find(f => f.name === key);
  if (dialogField) {
    return dialogField.label;
  }

  // Fallback: Reemplazar '.' por ' - '
  return key.replace('.', ' - ');
};

// Verifica si existen filtros adicionales
const hasExtraFilters = computed(() => {
  return props.optionsFilter.extraFilters && Object.keys(props.optionsFilter.extraFilters).length > 0;
});

const booleanActive = [
  { value: null, title: "Todos" },
  { value: 1, title: "Activo" },
  { value: 0, title: "Inactivo" },
];

// Exponemos forceSearch
defineExpose({
  forceSearch,
});
</script>

<template>
  <div class="filter-dialog-container">

    <!-- Filtros adicionales en grid responsivo -->
    <div v-if="hasExtraFilters" class="extra-filters-container">
      <VRow class="g-3">
        <slot :extraFilters="props.optionsFilter.extraFilters" />
      </VRow>
    </div>

    <!-- Barra de búsqueda con botones de acción -->
    <div class="filter-bar">
      <div class="search-container">
        <AppTextField v-model="generalSearch" label="Buscar" id="generalSearchInput" @update:model-value="onInputChange"
          solo clearable @click:clear="clearGeneralSearchInput" hide-details prepend-inner-icon="tabler-search"
          placeholder="Buscar..." class="search-field" />
      </div>

      <div class="action-buttons mt-6">
        <VBtn v-if="filters.dialog?.inputs?.length > 0" icon @click="openDialog" color="primary" :loading="isLoading"
          :disabled="isLoading" class="filter-btn">
          <VIcon icon="tabler-filter-cog" />
          <VTooltip location="top" transition="scale-transition" activator="parent" text="Filtros Avanzados" />
        </VBtn>

        <VBtn @click="forceSearch" color="primary" icon :loading="isButtonDisabled" :disabled="isButtonDisabled">
          <VIcon icon="tabler-refresh" />
          <VTooltip location="top" transition="scale-transition" activator="parent" text="Refrescar" />
        </VBtn>

        <VBtn v-if="showSearchButton && isButtonSearchMode" icon @click="applySearch" color="primary"
          :loading="isButtonDisabled" :disabled="isButtonDisabled" class="search-btn">
          <VIcon icon="tabler-filter-search" />
          <VTooltip location="top" transition="scale-transition" activator="parent" text="Buscar" />
        </VBtn>


      </div>
    </div>



    <!-- Sección de filtros activos (chips) -->
    <div v-if="Object.keys(activeFilters).length > 0" class="active-filters-container">
      <div class="active-filters-label">
        <VIcon icon="tabler-filter" size="small" class="mr-2" />
        <span>Filtros activos:</span>
      </div>

      <div class="chips-container">
        <VChip v-for="(value, key) in activeFilters" :key="key" closable @click:close="removeFilter(key)"
          :color="$vuetify.theme.current.dark ? 'warning' : 'primary'" size="small" class="filter-chip">
          <span class="font-weight-bold">{{ formatFilterKey(key) }}: &nbsp;</span>
          <span>{{ value }}</span>
        </VChip>
      </div>

      <div class="clear-filters">
        <VBtn size="small" @click="clearFilters" :color="$vuetify.theme.current.dark ? 'warning' : 'primary'"
          :loading="isLoading" variant="text" prepend-icon="tabler-x">
          Limpiar todos
        </VBtn>
      </div>
    </div>

    <!-- Diálogo de filtros avanzados -->
    <VDialog v-model="isDialogOpen" :max-width="filters.dialog?.width" persistent>
      <DialogCloseBtn @click="closeDialog" />
      <div>
        <VToolbar color="primary">
          <VToolbarTitle>{{ filters.dialog.title }}</VToolbarTitle>
        </VToolbar>
      </div>
      <VCard>
        <VCardText>
          <VRow>
            <VCol v-for="(field, index) in filters.dialog.inputs" :key="index" :cols="props.optionsFilter.dialog.cols">
              <AppTextField v-if="field.type === 'text'" v-model="field.value" :label="field.label"
                :placeholder="field.placeholder" :type="field.type" clearable />
              <AppTextField v-if="field.type === 'number'" v-model="field.value" :label="field.label"
                :placeholder="field.placeholder" :type="field.type" clearable />
              <AppSelect v-if="field.type === 'select'" v-model="field.value" :items="field.options" return-object
                :label="field.label" :multiple="field.multiple" :chips="field.chips" :closable-chips="field.chips"
                clearable />
              <AppSelect v-if="field.type === 'booleanActive'" v-model="field.value" :items="booleanActive"
                :label="field.label" :chips="field.chips" :closable-chips="field.chips" clearable />
              <AppSelectRemote v-if="field.type === 'selectApi'" v-model="field.value" :url="field.url"
                :arrayInfo="field.arrayInfo" :item-title="field.itemTitle" :item-value="field.itemValue"
                :multiple="field.multiple" :search-param="field.searchParam" :label="field.label">
                <template v-slot:selection="{ item, index }">
                  <v-chip closable @click:close="field.value.splice(index, 1)" v-if="index < 5">
                    <span>{{ item.title }}</span>
                  </v-chip>
                  <span v-if="index === 5" class="text-grey text-caption align-self-center">
                    (+{{ field.value.length - 5 }} otros)
                  </span>
                </template>
              </AppSelectRemote>
              <AppSelect v-if="field.type === 'selectChipCount'" v-model="field.value" :items="field.options"
                :label="field.label" :multiple="field.multiple" return-object clearable>
                <template v-slot:selection="{ item, index }">
                  <v-chip closable @click:close="field.value.splice(index, 1)" v-if="index < 5">
                    <span>{{ item.title }}</span>
                  </v-chip>
                  <span v-if="index === 5" class="text-grey text-caption align-self-center">
                    (+{{ field.value.length - 5 }} otros)
                  </span>
                </template>
              </AppSelect>
              <AppDateTimePicker v-if="field.type === 'date'" v-model="field.value" :label="field.label"
                :config="{ dateFormat: 'Y-m-d' }" clearable />
              <AppDateTimePicker v-if="field.type === 'dateRange'" v-model="field.value" :label="field.label"
                :config="{ mode: 'range' }" clearable />
            </VCol>
          </VRow>
        </VCardText>
        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn @click="closeDialog" color="secondary" variant="tonal">
            <template #prepend>
              <VIcon icon="tabler-x" />
            </template>
            Cerrar
          </VBtn>
          <VBtn @click="applySearch" color="primary" :loading="isButtonDisabled" :disabled="isButtonDisabled">
            <template #prepend>
              <VIcon icon="tabler-filter-search" />
            </template>
            Buscar
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.filter-dialog-container {
  inline-size: 100%;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-block-end: 16px;
}

.search-container {
  flex: 1;
}

.search-field {
  border-radius: 8px;
  inline-size: 100%;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.extra-filters-container {
  margin-block-end: 16px;
}

.active-filters-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border-radius: 8px;
  background-color: rgba(var(--v-theme-grey-600), 0.25);
  gap: 12px;
  margin-block-end: 16px;
  padding-block: 12px;
  padding-inline: 16px;
}

.active-filters-label {
  display: flex;
  align-items: center;
  font-weight: 500;
  white-space: nowrap;
}

.chips-container {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-chip {
  font-size: 0.875rem;
}

.clear-filters {
  margin-inline-start: auto;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .action-buttons {
    justify-content: flex-end;
    margin-block-start: 8px;
  }

  .active-filters-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .active-filters-label {
    margin-block-end: 8px;
  }

  .clear-filters {
    align-self: flex-end;
    margin-block-start: 8px;
    margin-inline-start: 0;
  }
}
</style>
