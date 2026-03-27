import { useApi } from '@/composables/useApi'
import { useAuthenticationStore } from '@/stores/useAuthenticationStore'
import { storeToRefs } from 'pinia'
import { computed, reactive, ref } from 'vue'

type Option = { value: string; label: string }

export function useTeacherActivityForm() {
  const authenticationStore = useAuthenticationStore()
  const { user } = storeToRefs(authenticationStore)
  const companyId = computed(() => user.value?.company_id)

  const open = ref(false)
  const loading = ref(false)
  const saving = ref(false)
  const isEditing = ref(false)

  const options = reactive({
    subjects: [] as Option[],
    grades: [] as Option[],
    sections: [] as Option[],
  })

  const form = reactive({
    id: null as string | null,
    title: '',
    description: '',
    subject_id: null as string | null,
    grade_id: null as string | null,
    section_id: null as string | null,
    deadline_at: null as string | null, // datetime-local string
    status: 'draft',
  })

  const reset = () => {
    form.id = null
    form.title = ''
    form.description = ''
    form.subject_id = null
    form.grade_id = null
    form.section_id = null
    form.deadline_at = null
    form.status = 'draft'
  }

  const loadOptions = async () => {
    if (!companyId.value) return
    loading.value = true
    try {
      const url = `/activity/create?company_id=${companyId.value}`
      const { data } = await useApi(url).get()
      if (data?.code === 200) {
        options.subjects = data.data?.subjects ?? []
        options.grades = data.data?.grades ?? []
        options.sections = data.data?.sections ?? []
      }
    } finally {
      loading.value = false
    }
  }

  const openCreate = async () => {
    isEditing.value = false
    reset()
    open.value = true
    await loadOptions()
  }

  const openEdit = async (item: any) => {
    isEditing.value = true
    reset()

    form.id = item.id
    form.title = item.title ?? ''
    form.description = item.description ?? ''
    form.status = item.status ?? 'draft'

    // deadline_at viene ISO en el resource, lo pasamos a datetime-local:
    form.deadline_at = item.deadline_at ? item.deadline_at.slice(0, 16) : null

    open.value = true
    await loadOptions()

    // Si ya tienes subject_id/grade_id/section_id en backend, aquí los asignas:
    // form.subject_id = item.subject_id ?? null
    // form.grade_id = item.grade_id ?? null
    // form.section_id = item.section_id ?? null
  }

  const save = async () => {
    if (!companyId.value) return
    if (!form.title) return

    saving.value = true
    try {
      const payload = {
        company_id: companyId.value,
        title: form.title,
        description: form.description,
        status: form.status,
        deadline_at: form.deadline_at,

        // Estos campos solo si ya existen en activities (si no, luego los activamos)
        subject_id: form.subject_id,
        grade_id: form.grade_id,
        section_id: form.section_id,
      }

      if (!isEditing.value) {
        const { data } = await useApi('/activity/store').post(payload)
        return data
      } else {
        const { data } = await useApi(`/activity/update/${form.id}`).post(payload)
        return data
      }
    } finally {
      saving.value = false
    }
  }

  return {
    open,
    loading,
    saving,
    isEditing,
    form,
    options,
    openCreate,
    openEdit,
    save,
  }
}
