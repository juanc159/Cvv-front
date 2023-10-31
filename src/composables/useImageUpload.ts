import Swal from "sweetalert2";
import { ref, watch } from "vue";

export function useImageUpload() {
  const imageFile = ref<File | null>(null);
  const imageUrl = ref<string | null | ArrayBuffer>(null);
  const key = ref<number>(1);
  const name = ref<string | null>(null);
  const allowedExtensions = ref<Array<string>>([]);
  const allowedSizeFile = ref<number>(10240);
  const loading = ref<boolean>(false);

  function handleImageSelected() {
    //--------------------------------------------------------------------------------------------
    // Validacion tamaño del archivo
    //--------------------------------------------------------------------------------------------
    var siezekiloByte = parseInt(event.target.files[0].size / 1024);
    if (siezekiloByte > allowedSizeFile.value) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debe registrar máximo 10MB",
        customClass: {
          container: 'my-swal'
        }
      });
      clearData();
      return false;
    }

    //--------------------------------------------------------------------------------------------
    // Validacion del tipo de archivo
    //--------------------------------------------------------------------------------------------
    const extensionArchivo = event.target.files[0].name
      .split(".")
      .pop()
      ?.toLowerCase();
    if (allowedExtensions.value.length > 0 && !allowedExtensions.value.includes(extensionArchivo)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Solo se admite archivos con extensiónes: ${allowedExtensions.value.join(
          ", ",
        )}`,
        customClass: {
          container: 'my-swal'
        }
      });
      clearData();
      return false;
    }

    if (event.target.files.length === 0) {
      clearData();
      return false;
    }

    console.log("event.target.files[0]", event.target.files[0]);

    imageFile.value = event.target.files[0];

    return true;
  }

  watch(imageFile, (imageFile) => {
    if (!(imageFile instanceof File)) return;

    const fileReader = new FileReader();

    fileReader.readAsDataURL(imageFile);

    loading.value = true
    fileReader.addEventListener("load", () => {
      imageUrl.value = fileReader.result;
      loading.value = false

      // console.log('imageUrl.value', imageUrl.value)
    });
  });

  function clearData() {
    imageFile.value = null;
    imageUrl.value = null;
    name.value = null;
    key.value++;
    loading.value = false;
  }

  return {
    imageFile,
    imageUrl,
    handleImageSelected,
    key,
    allowedExtensions,
    clearData,
    name,
    allowedSizeFile,
    loading,
  };
}
