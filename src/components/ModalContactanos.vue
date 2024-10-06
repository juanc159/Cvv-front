<script setup lang="ts">
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import type { VForm } from "vuetify/components/VForm";

const errorsBack = ref<IErrorsBack>({});
const emit = defineEmits(["execute"]);
const { toast } = useToast();

const componentData = reactive({
  titleDialog: "Contactanos",
  isDialogVisible: false,
  isLoading: false,
});


const handleDialogVisible = () => {
  componentData.isDialogVisible = !componentData.isDialogVisible;
};

const openDialog = async () => {
  handleDialogVisible();
};


const refForm = ref<VForm>();

defineExpose({
  openDialog,
});

</script>

<template>
  <div>
    <VDialog v-model="componentData.isDialogVisible" persistent max-width="40rem" transition="dialog-transition">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="handleDialogVisible()" />
      <!-- Toolbar -->
      <div>
        <VToolbar color="primary">
          <VToolbarTitle>{{ componentData.titleDialog }}</VToolbarTitle>
        </VToolbar>
      </div>
      <VCard>
        <VCardText>
          <h2>📞 Contáctanos para Información Administrativa</h2>
          <p>Si necesitas información sobre <strong>administración</strong> (pagos, deudas,
            solvencias, mensualidades y otros trámites), no dudes en ponerte en contacto con nosotros.</p>
          <p><strong>Correo electrónico:</strong> <a
              href="mailto:colegiovirgendelvalle.adm@gmail.com">colegiovirgendelvalle.adm@gmail.com</a></p>
          <p>¡Estamos aquí para ayudarte!</p>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
