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
