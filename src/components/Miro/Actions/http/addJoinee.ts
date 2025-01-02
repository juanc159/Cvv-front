import { useToast } from '@/composables/useToast';
import { router } from "@/plugins/1.router";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { ref } from 'vue';
const { toast } = useToast()

const authenticationStore = useAuthenticationStore();


export function useAddJoinees(code: string) {

  const loading = ref(false)
  const userData = authenticationStore
  const projectCode = code

  async function addJoinees() {


    try {
      loading.value = true
      // const data = await makeHttpReq2<{
      //     projectCode:string
      //     userId:string
      // }, {
      //     message:string,
      //     status:boolean
      // }>
      // (`joinees`, 'POST',{
      //     projectCode:projectCode,
      //     userId:userData?.user?.userId as string
      // })

      const { data, response } = await useApi(`/miro/joinees`).post({
        project_code: projectCode,
        user_id: userData?.user?.id,
      });

      if (data.value) {
        // http://127.0.0.1:8000/app/add_joinees?project_code=BJDfgJLrje-1730775993
        // http://127.0.0.1:8000/app/project-boards?project_code=BJDfgJLrje-1730775993
        router.push({ name: "Miro-Board", params: { action: 'create', id: '9ddddfc9-c2e8-422d-8d17-24d400a48df7', code: projectCode } })
        window.location.href = import.meta.env.VITE_API_BASE_URL + '/Project/Miro-Board/miro?project_code=' + projectCode
      }


      loading.value = false
    } catch (error) {
      toast((error as Error).message, "", "danger")
      loading.value = false
    }

  }


  return { addJoinees, loading }
}
