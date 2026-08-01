<script setup lang="ts">
import { useAuthenticationStore } from '@/stores/useAuthenticationStore';
import { useDropZone, useFileDialog, useObjectUrl } from '@vueuse/core';
import { ref } from 'vue';

import type { VForm } from 'vuetify/components/VForm';
const formValidation = ref<VForm>()
const authenticationStore = useAuthenticationStore()

const { toast } = useToast()
const dropZoneRef = ref<HTMLDivElement>()

const isUploading = ref(false)  // Control de si estamos subiendo archivos
const field = ref()
interface FileData {
  file: File
  url: string
  progress?: number
  status?: 'pending' | 'uploading' | 'completed' | 'failed' // Agregamos el estado del archivo
  error?: string
}

const fileData = ref<FileData[]>([])
const { open, onChange } = useFileDialog({})

// Cada campo acepta su tipo. El backend valida lo mismo por MIME real; esto es solo
// para avisar antes de subir.
const acceptedTypes: Record<string, { mimes: string[]; label: string }> = {
  photo: {
    mimes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    label: 'una imagen (JPG, PNG, WEBP o GIF)',
  },
  boletin: {
    mimes: ['application/pdf'],
    label: 'un archivo PDF',
  },
}

const acceptAttr = computed(() =>
  field.value ? acceptedTypes[field.value]?.mimes.join(',') ?? '' : '')

const addFiles = (files: File[]) => {
  const rules = field.value ? acceptedTypes[field.value] : null

  for (const file of files) {
    // Sin campo elegido no se sabe qué tipo corresponde: se deja pasar y decide el backend.
    if (rules && !rules.mimes.includes(file.type)) {
      toast('Archivo no permitido', `${file.name}: se espera ${rules.label}`, 'danger')
      continue
    }

    fileData.value.push({
      file,
      url: useObjectUrl(file).value ?? '',
      progress: undefined,
      status: 'pending'
    })
  }
}

function onDrop(DroppedFiles: File[] | null) {
  if (DroppedFiles) addFiles(DroppedFiles)
}

onChange(selectedFiles => {
  if (!selectedFiles)
    return

  addFiles(Array.from(selectedFiles))
})

useDropZone(dropZoneRef, onDrop)

const savefiles = async () => {
  const validation = await formValidation.value?.validate()
  if (validation?.valid) {


    if (fileData.value.length === 0) {
      alert('No hay archivos para guardar');
      return;
    }

    isUploading.value = true  // Deshabilitar el botón de carga

    for (let i = 0; i < fileData.value.length; i++) {
      const fileItem = fileData.value[i]
      fileItem.status = 'uploading' // Cambiamos el estado a 'uploading' al comenzar la carga
      try {
        const formData = new FormData()
        formData.append('file', fileItem.file)
        formData.append('field', field.value)
        // El superadmin no tiene colegio propio: usa el que seleccionó y quedó en el store.
        formData.append('company_id', String(authenticationStore.company.id ?? ''))

        const { data, response } = await useApi('/savefiles').post(formData)
        if (response.value?.ok && data.value) {
          fileItem.status = 'completed' // Cambiamos el estado a 'completed' si la carga fue exitosa
          fileItem.progress = 100 // Progreso al 100%
          // console.log(`Archivo ${fileItem.file.name} guardado correctamente`)
        } else {
          // Antes el archivo quedaba en 'uploading' para siempre y no se sabía qué pasó.
          fileItem.status = 'failed'
          fileItem.progress = undefined
          fileItem.error = (data.value as any)?.message ?? 'No se pudo guardar'
        }
      } catch (error) {
        fileItem.status = 'failed' // Cambiamos el estado a 'failed' si hubo un error
        fileItem.progress = undefined // Restablecemos el progreso
        console.error('Error al guardar el archivo', fileItem.file.name, error)
        alert(`Error al guardar el archivo ${fileItem.file.name}`)
      }
    }

    isUploading.value = false  // Rehabilitar el botón después de que todos los archivos se hayan procesado
  }
}

const fields = [
  {
    title: "Foto",
    value: "photo",
  },
  {
    title: "Boletín",
    value: "boletin",
  },
]
</script>

<template>
  <VCard class="mb-6" title="Archivos">
    <VCardText>
      <VForm ref="formValidation" @submit.prevent="() => { }">
        <VRow>
          <VCol cols="12" md="6">
            <AppSelect :requiredField="true" label="Campo" :items="fields" v-model="field" :rules="[requiredValidator]">
            </AppSelect>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>

    <VCardText>
      <div class="flex">
        <div class="w-full h-auto relative">
          <div ref="dropZoneRef" class="cursor-pointer" @click="() => open({ accept: acceptAttr })">
            <div v-if="fileData.length === 0"
              class="d-flex flex-column justify-center align-center gap-y-3 px-6 py-10 border-dashed drop-zone">
              <IconBtn variant="tonal" class="rounded-sm">
                <VIcon icon="tabler-upload" />
              </IconBtn>
              <div class="text-base text-high-emphasis font-weight-medium">
                Arrastra y suelta tu archivo aquí.
              </div>
              <span class="text-disabled">o</span>
              <VBtn variant="tonal">Explorar archivos</VBtn>
            </div>

            <div v-else class="d-flex justify-center align-center gap-3 pa-8 border-dashed drop-zone flex-wrap">
              <VRow class="match-height w-100">
                <template v-for="(item, index) in fileData" :key="index">
                  <VCol cols="12" sm="4">
                    <VCard :ripple="false" border class="d-flex flex-column">
                      <VCardText @click.stop>
                        <VImg :src="item.url" width="150px" height="100px" />
                        <div class="mt-2">
                          <span class="clamp-text text-wrap">
                            {{ item.file.name }}
                          </span>
                          <span>
                            {{ item.file.size / 1000 }} KB
                          </span>
                        </div>

                        <div v-if="item.status === 'uploading'" class="mt-2">
                          <VProgressCircular :size="24" :value="item.progress" color="primary" />
                          <span>Cargando...</span>
                        </div>
                        <div v-if="item.status === 'completed'" class="mt-2 text-success">
                          <span>¡Archivo cargado exitosamente!</span>
                        </div>
                        <div v-if="item.status === 'failed'" class="mt-2 text-error">
                          <span>{{ item.error ?? 'Error al cargar el archivo' }}</span>
                        </div>

                      </VCardText>
                      <VSpacer />
                      <VCardActions>
                        <VBtn variant="outlined" block @click.stop="fileData.splice(index, 1)">
                          Eliminar archivo
                        </VBtn>
                      </VCardActions>
                    </VCard>
                  </VCol>
                </template>
              </VRow>
            </div>
          </div>
        </div>
      </div>
    </VCardText>

    <VCardText>
      <VRow>
        <VCol cols="12" class="d-flex justify-center">
          <VBtn :disabled="isUploading" :loading="isUploading" color="primary" @click="savefiles">
            Guardar archivos
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
