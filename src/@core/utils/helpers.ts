const { toast } = useToast();
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

// 👉 IsEmpty
export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined || value === '')
    return true

  return !!(Array.isArray(value) && value.length === 0)
}

// 👉 IsNullOrUndefined
export const isNullOrUndefined = (value: unknown): value is undefined | null => {
  return value === null || value === undefined
}

// 👉 IsEmptyArray
export const isEmptyArray = (arr: unknown): boolean => {
  return Array.isArray(arr) && arr.length === 0
}

// 👉 IsObject
export const isObject = (obj: unknown): obj is Record<string, unknown> =>
  obj !== null && !!obj && typeof obj === 'object' && !Array.isArray(obj)

// 👉 IsToday
export const isToday = (date: Date) => {
  const today = new Date()

  return (
    date.getDate() === today.getDate()
    && date.getMonth() === today.getMonth()
    && date.getFullYear() === today.getFullYear()
  )
}




export const descargarArchivo = (path: string, name: string | null = null) => {

  // Divide la URL por las barras diagonales '/' para obtener las partes
  const partesURL = path.split('/');

  // Toma la última parte que debería ser el nombre del archivo
  const nombreArchivo = partesURL[partesURL.length - 1];

  // Dividir el nombre del archivo por el punto '.' para obtener la extensión
  const partesNombreArchivo = nombreArchivo.split('.');
  const extension = partesNombreArchivo[partesNombreArchivo.length - 1];

  let nameComplete = name + '.' + extension
  if (name == null) {
    nameComplete = nombreArchivo
  }

  // Código para descargar el archivo
  const link = document.createElement('a');
  link.href = path;
  link.target = "_blank"
  link.setAttribute('download', nameComplete);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}



export const openPdfBase64 = (pdfBase64: string) => {
  // Crear una nueva ventana
  const newWindow = window.open('', '_blank');

  // Verificar si la ventana emergente fue bloqueada por el navegador
  if (newWindow) {
    // Crear un documento HTML en la ventana emergente
    const html = `
      <html>
        <head>
          <title>PDF Viewer</title>
        </head>
        <body>
          <embed width="100%" height="100%" src="data:application/pdf;base64,${pdfBase64}" type="application/pdf">
        </body>
      </html>
    `;

    // Escribir el contenido HTML en la ventana emergente
    newWindow.document.write(html);
  } else {
    // Mostrar un mensaje de error si la ventana emergente fue bloqueada
    alert('La ventana emergente fue bloqueada por el navegador. Asegúrate de permitir ventanas emergentes.');
  }
}

export const downloadExcelBase64 = (
  base64: string,
  fileName: string = "excel"
) => {
  if (base64) {
    const link = document.createElement("a");
    link.href = `data:application/vnd.ms-excel;base64,${base64}`;
    link.download = fileName + ".xlsx";
    link.click();
  }
};


export function onlyNumbersKeyPress(event: any) {
  if ((!/[0-9,-]/.test(event.key))) {
    event.preventDefault();
  }
}
export function storageBack(path: string) {
  return BASE_BACK_STORAGE + path
}


export const downloadFileV2 = async (
  fileJson: string,
  newFileName: string = "archivo"
) => {
  if (fileJson) {
    try {
      // Codifica el nombre del archivo para usarlo en la URL
      const encodedFileName = encodeURIComponent(fileJson);

      // Realiza una solicitud GET al servidor con el nombre del archivo como parámetro
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_BACK
        }api/file/download?file=${encodedFileName}`
      );

      if (!response.ok) {
        toast("Error", "Error al descargar el archivo", "danger");
      }

      // Convierte la respuesta en un Blob
      const blob = await response.blob();

      // Crea una URL para el Blob
      const url = window.URL.createObjectURL(blob);

      // Crea un enlace y simula un clic para descargar el archivo
      const link = document.createElement("a");
      link.href = url;
      link.download = newFileName; // Nombre del archivo para la descarga

      // Añade el enlace al DOM y simula el clic
      document.body.appendChild(link);
      link.click();

      // Limpieza
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error:", error);
    }
  }
};

export const hasPermission = (permissionName: string) => {
  const authenticationStore = useAuthenticationStore();
  const { permissions } = storeToRefs(authenticationStore);

  return permissions.value.some((permission) => permission === permissionName);
};

export function limitText(text: string, limit: number): string {
  if (text.length <= limit) {
    return text;
  }
  return text.substring(0, limit) + '...';
}
