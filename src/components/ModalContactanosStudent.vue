<script setup lang="ts">
import coordinadoraImg from "@/assets/general/corrdinadora.jpg";
import userPng from "@/assets/general/user.png";
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

          <v-divider></v-divider>

          <!-- New Contact Information -->
          <div class="additional-contact-info">
            <!-- <h3 class="section-title">Otros contactos importantes</h3> -->

            <!-- Contact 1: Lcda. Dayanna Cario -->
            <div class="contact-card">
              <div class="contact-info">
                <div class="teacher-photo">
                  <!-- Placeholder image for Dayanna Cario (we'll add this later) -->
                  <img :src="coordinadoraImg" alt="Lcda. Dayanna Cario" />
                </div>
                <div class="contact-details">
                  <p class="section-subtitle">Coordinadora de Evaluación de Bachillerato</p>
                  <p><strong>Lcda. Dayanna Cario</strong></p>
                  <p><strong>WhatsApp:</strong> <a href="https://wa.me/5804247087181"
                      target="_blank">wa.me/5804247087181</a></p>
                  <p><strong>Correo electrónico:</strong> <a
                      href="mailto:cvvevaluaciondayannacario@gmail.com">cvvevaluaciondayannacario@gmail.com</a></p>
                </div>
              </div>
            </div>
            <v-divider></v-divider>


            <!-- Contact 2: Lcda. Erika Casanova -->
            <div class="contact-card">
              <div class="contact-info">
                <div class="teacher-photo">
                  <!-- Placeholder image for Erika Casanova -->
                  <img :src="userPng" alt="Lcda. Erika Casanova" />
                </div>
                <div class="contact-details">
                  <p class="section-subtitle">Coordinadora de Educación Preescolar</p>
                  <p><strong>Lcda. Erika Casanova</strong></p>
                  <p><strong>Teléfono:</strong> <a href="tel:+5804247468350">0424 7468350</a></p>
                </div>
              </div>
            </div>
            <v-divider></v-divider>


            <!-- Contact 3: Lcda. Yennifer Herrera -->
            <div class="contact-card">
              <div class="contact-info">
                <div class="teacher-photo">
                  <!-- Placeholder image for Yennifer Herrera -->
                  <img :src="userPng" alt="Lcda. Yennifer Herrera" />
                </div>
                <div class="contact-details">
                  <p class="section-subtitle">Coordinadora de Educación Primaria</p>
                  <p><strong>Lcda. Yennifer Herrera</strong></p>
                  <p><strong>Teléfono:</strong> <a href="tel:+5804247655582">0424 7655582</a></p>
                </div>
              </div>
            </div>
            <v-divider></v-divider>


            <!-- Contact 4: Departamento de Administración -->
            <div class="contact-card">
              <div class="contact-info">
                <div class="teacher-photo">
                  <!-- Placeholder image for Nieves Uribe -->
                  <img :src="userPng" alt="Nieves Uribe" />
                </div>
                <div class="contact-details">
                  <p class="section-subtitle">Departamento de Administración</p>
                  <ul>
                    <li><strong>Nieves Uribe:</strong> <a href="tel:+5804246455555">0424 6455555</a></li>
                    <li><strong>Verónica Martínez:</strong> <a href="tel:+5804143933375">0414 3933375</a></li>
                    <li><strong>María Guerrero:</strong> <a href="tel:+5804121602584">0412 1602584</a></li>
                  </ul>
                </div>
              </div>
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

.additional-contact-info {
  margin-top: 20px;
}

.contact-card {
  margin-bottom: 15px;
}

.contact-card ul {
  list-style-type: none;
  padding-left: 0;
}

.contact-card a {
  color: #1976d2;
  /* Color del enlace */
  text-decoration: none;
}

.contact-card a:hover {
  text-decoration: underline;
}

/* Estilos para títulos */
.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1976d2;
  margin-bottom: 15px;
  text-align: center;
  /* Centrar el título */
}

.section-subtitle {
  font-size: 1.2rem;
  font-weight: 600;
  color: #424242;
  margin-top: 10px;
  margin-bottom: 5px;
}
</style>
