import type { ThemeDefinition } from 'vuetify'

// Primary colors for light mode (EscuelaWeb style)
export const staticPrimaryColor = '#498FDD' // Nuevo azul claro para modo claro
export const staticPrimaryDarkenColor = '#3D7CC2' // Azul oscurecido para modo claro

// Primary colors for dark mode (Vuexy style)
export const staticPrimaryColorDark = '#3B82F6' // Azul vibrante para modo oscuro
export const staticPrimaryDarkenColorDark = '#2563EB' // Azul oscurecido para modo oscuro

export const themes: Record<string, ThemeDefinition> = {
  light: {
    dark: false,
    colors: {
      'primary': staticPrimaryColor, // Nuevo azul claro como color principal
      'on-primary': '#fff', // Blanco para texto sobre el primario
      'primary-darken-1': staticPrimaryDarkenColor, // Azul oscurecido
      'secondary': '#F28C38', // Naranja del logo como secundario
      'on-secondary': '#fff', // Blanco para texto sobre el secundario
      'secondary-darken-1': '#D97A30', // Naranja oscurecido
      'success': '#28C76F', // Mantengo el verde original
      'on-success': '#fff',
      'success-darken-1': '#24B364',
      'info': '#4A2C2A', // Marrón del logo como color de info
      'on-info': '#fff',
      'info-darken-1': '#3E2523',
      'warning': '#FF9F43', // Mantengo el amarillo original
      'on-warning': '#fff',
      'warning-darken-1': '#E68F3C',
      'error': '#FF4C51', // Mantengo el rojo original
      'on-error': '#fff',
      'error-darken-1': '#E64449',
      'background': '#F5F7FA', // Fondo gris claro de la imagen
      'on-background': '#1A3C5E', // Texto azul oscuro
      'surface': '#fff', // Superficie blanca
      'on-surface': '#1A3C5E', // Texto azul oscuro
      'grey-50': '#FAFAFA',
      'grey-100': '#F5F5F5',
      'grey-200': '#E8ECEF', // Gris del sidebar
      'grey-300': '#E0E0E0',
      'grey-400': '#BDBDBD',
      'grey-500': '#9E9E9E',
      'grey-600': '#757575',
      'grey-700': '#616161',
      'grey-800': '#424242',
      'grey-900': '#212121',
      'grey-light': '#FAFAFA',
      'perfect-scrollbar-thumb': '#DBDADE',
      'skin-bordered-background': '#fff',
      'skin-bordered-surface': '#fff',
      'expansion-panel-text-custom-bg': '#fafafa',
    },
    variables: {
      'code-color': '#d400ff',
      'overlay-scrim-background': '#1A3C5E', // Azul oscuro para overlays
      'tooltip-background': '#1A3C5E', // Azul oscuro para tooltips
      'overlay-scrim-opacity': 0.5,
      'hover-opacity': 0.06,
      'focus-opacity': 0.1,
      'selected-opacity': 0.08,
      'activated-opacity': 0.16,
      'pressed-opacity': 0.14,
      'dragged-opacity': 0.1,
      'disabled-opacity': 0.4,
      'border-color': '#1A3C5E', // Bordes azul oscuro
      'border-opacity': 0.12,
      'table-header-color': '#EAEAEC',
      'high-emphasis-opacity': 0.9,
      'medium-emphasis-opacity': 0.7,
      'switch-opacity': 0.2,
      'switch-disabled-track-opacity': 0.3,
      'switch-disabled-thumb-opacity': 0.4,
      'switch-checked-disabled-opacity': 0.3,
      'track-bg': '#F1F0F2',
      'shadow-key-umbra-color': '#1A3C5E', // Sombras azul oscuro
      'shadow-xs-opacity': 0.10,
      'shadow-sm-opacity': 0.12,
      'shadow-md-opacity': 0.14,
      'shadow-lg-opacity': 0.16,
      'shadow-xl-opacity': 0.18,
    },
  },
  dark: {
    dark: true,
    colors: {
      'primary': staticPrimaryColorDark, // Azul vibrante para modo oscuro
      'on-primary': '#fff', // Blanco para texto sobre el primario
      'primary-darken-1': staticPrimaryDarkenColorDark, // Azul oscurecido para modo oscuro
      'secondary': '#F28C38', // Naranja del logo como secundario
      'on-secondary': '#fff', // Blanco para texto sobre el secundario
      'secondary-darken-1': '#D97A30', // Naranja oscurecido
      'success': '#28C76F', // Mantengo el verde
      'on-success': '#fff',
      'success-darken-1': '#24B364',
      'info': '#4A2C2A', // Marrón del logo como color de info
      'on-info': '#fff',
      'info-darken-1': '#3E2523',
      'warning': '#FF9F43', // Mantengo el amarillo
      'on-warning': '#fff',
      'warning-darken-1': '#E68F3C',
      'error': '#FF4C51', // Mantengo el rojo
      'on-error': '#fff',
      'error-darken-1': '#E64449',
      'background': '#1E2A3C', // Fondo oscuro tipo Vuexy
      'on-background': '#E5E7EB', // Texto claro para contraste
      'surface': '#26334A', // Superficie tipo Vuexy
      'on-surface': '#E5E7EB', // Texto claro para contraste
      'grey-50': '#161D31', // Sidebar de Vuexy
      'grey-100': '#1E2A3C', // Fondo principal
      'grey-200': '#26334A', // Superficie
      'grey-300': '#2F3B52', // Ligeramente más claro
      'grey-400': '#3A4661', // Más claro aún
      'grey-500': '#5A6987', // Tono medio
      'grey-600': '#7A8AA7', // Más claro
      'grey-700': '#A0AEC0', // Claro
      'grey-800': '#CBD5E0', // Muy claro
      'grey-900': '#E5E7EB', // Casi blanco
      'grey-light': '#26334A', // Superficie
      'perfect-scrollbar-thumb': '#5A6987', // Ajustado al tono medio
      'skin-bordered-background': '#26334A',
      'skin-bordered-surface': '#26334A',
    },
    variables: {
      'code-color': '#d400ff',
      'overlay-scrim-background': '#1E2A3C', // Fondo oscuro tipo Vuexy
      'tooltip-background': '#E5E7EB', // Texto claro para tooltips
      'overlay-scrim-opacity': 0.6,
      'hover-opacity': 0.06,
      'focus-opacity': 0.1,
      'selected-opacity': 0.08,
      'activated-opacity': 0.16,
      'pressed-opacity': 0.14,
      'dragged-opacity': 0.1,
      'disabled-opacity': 0.4,
      'border-color': '#E5E7EB', // Bordes claros para contraste
      'border-opacity': 0.12,
      'table-header-color': '#26334A', // Ajustado a la superficie
      'high-emphasis-opacity': 0.9,
      'medium-emphasis-opacity': 0.7,
      'switch-opacity': 0.4,
      'switch-disabled-track-opacity': 0.4,
      'switch-disabled-thumb-opacity': 0.8,
      'switch-checked-disabled-opacity': 0.3,
      'track-bg': '#26334A', // Ajustado a la superficie
      'shadow-key-umbra-color': '#1E2A3C', // Sombras oscuras
      'shadow-xs-opacity': 0.16,
      'shadow-sm-opacity': 0.18,
      'shadow-md-opacity': 0.2,
      'shadow-lg-opacity': 0.22,
      'shadow-xl-opacity': 0.24,
    },
  },
}

export default themes
