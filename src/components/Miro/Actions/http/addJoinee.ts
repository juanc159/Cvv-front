import { useToast } from '@/composables/useToast';
import { router } from '@/plugins/1.router';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { ref } from 'vue';
import { RouteLocationNormalizedLoaded } from "vue-router";
const { toast } = useToast()

const authenticationStore = useAuthenticationStore();

export function useAddJoinees(route: RouteLocationNormalizedLoaded) {


  const loading = ref(false)
  const userData = authenticationStore
  const projectCode = route?.query?.project_code as string

  console.log(userData.user.id);

  async function addJoinees() {

    try {
      console.log({
        project_code: projectCode,
        user_id: userData?.user?.id,
      });

      loading.value = true
      const { data, response } = await useApi<any>(
        createUrl(`/miro/addJoinees`, {
          query: {
            project_code: projectCode,
            user_id: userData?.user?.id,
          },
        })
      );


      // const { data, response } = await useApi(`/miro/addJoinees`).post({
      //   project_code: projectCode,
      //   user_id: userData?.user?.id,
      // });

      if (response.value?.ok && data.value) {
        // http://127.0.0.1:8000/app/add_joinees?project_code=BJDfgJLrje-1730775993
        // http://127.0.0.1:8000/app/project-boards?project_code=BJDfgJLrje-1730775993
        router.push({ name: "Miro-Board", params: { action: 'create', id: data.value.project.id, code: projectCode } })
        // window.location.href = import.meta.env.VITE_API_BASE_URL + '/Project/Miro-Board/miro?project_code=' + projectCode
      }


      loading.value = false
    } catch (error) {
      toast((error as Error).message, "", "danger")
      loading.value = false
    }

  }


  return { addJoinees, loading }
}
