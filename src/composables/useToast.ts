import type { ToastType } from 'mosha-vue-toastify'
import { createToast } from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'

export function useToast() {
  const toast = (title: string, description: string, type: ToastType) => {
    createToast({
      title,
      description,
    }, {
      type, // 'info', 'danger', 'warning', 'success', 'default'
      timeout: 5000,
      showCloseButton: true,
      position: 'bottom-center', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
      transition: 'slide',
      hideProgressBar: false,
      showIcon: true,
      swipeClose: true,

      // toastBackgroundColor: '#FF5733',
      onClose: undefined,
    })
  }

  return {
    toast,
  }
}
