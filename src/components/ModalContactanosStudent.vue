<script setup lang="ts">
import coordinadoraImg from "@/assets/general/corrdinadora.jpg";
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import type { VForm } from "vuetify/components/VForm";

const errorsBack = ref<IErrorsBack>({});
const emit = defineEmits(["execute"]);
const { toast } = useToast();

const componentData = reactive({
  titleDialog: "Contáctanos",
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
          <h2 class="large-text">📞 Cualquier duda, reprogramación de pruebas o revisión</h2>
          <div class="contact-info">
            <div class="teacher-photo">
              <img :src="coordinadoraImg" alt="Lcda. Dayanna Cario" />
            </div>
            <div class="contact-details">
              <p><strong>Comuníquese con:</strong></p>
              <p><strong>Lcda. Dayanna Cario</strong></p>
              <p>
                <strong>WhatsApp:</strong> <a href="https://wa.me/5804247087181" target="_blank">wa.me/5804247087181</a>
              </p>
              <p>
                <strong>Correo electrónico:</strong> <a
                  href="mailto:cvvevaluaciondayannacario@gmail.com">cvvevaluaciondayannacario@gmail.com</a>
              </p>
              <p>¡Estamos para servirle!</p>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style lang="scss" scoped>
.teacher-photo {
  margin-right: 20px;
  /* Espacio entre la imagen y el texto */
}

.teacher-photo img {
  max-width: 100px;
  /* Ajustar tamaño de la imagen */
  border-radius: 8px;
  /* Esquinas redondeadas */
}

.contact-info {
  display: flex;
  /* Usar flexbox para alinear imagen y texto */
  align-items: center;
  /* Centrar verticalmente */
}
</style>
