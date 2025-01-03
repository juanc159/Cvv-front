import { useToast } from '@/composables/useToast';
import { yDocStore } from '../../Store/yDocStore';
import { userResponseType } from '../../types/tokenTypes';
const { toast } = useToast()

export interface IProjectDetail {
  id: string;
  name: string;
  image: string;
  code: string;
  user_id: string;
}
export function useGetProjectDetail(code: string, user_id: any | undefined) {
  const project_code = code;
  const loading = ref(false);
  const showJoinneesModal = ref(false);
  const sendId = user_id

  const projectData = ref<IProjectDetail>({} as IProjectDetail);

  async function getProjectDetail() {
    try {
      loading.value = true;


      const { data, response } = await useApi<any>(
        createUrl(`/miro/details`, {
          query: {
            code: project_code,
            user_id: sendId,
          },
        })
      );

      if (!Array.isArray(data.value.project)) {
        projectData.value = data.value.project;
        knowWhoIsTyping()
      } else {
        window.location.href = "/app/projects";
      }

      loading.value = false;
    } catch (error) {
      toast((error as Error).message, "", "danger");
      loading.value = false;
    }
  }


  function knowWhoIsTyping() {


    // window.Echo.private(`typing.${sendId}`)
    //   .listen("UserTypingEvent", (e: any) => {
    //     console.log("message here :", e);

    //   })
    //   .listenForWhisper("typing", (e: any) => {
    //     yDocStore.cursor.typingUser = e.name
    //     console.log(e.name, " is typing...");
    //   }).error((error: any) => {
    //     console.log(error);
    //     localStorage.clear();
    //     window.location.href = "/app/login";
    //   });

  }


  function leavingUsers(joinee: userResponseType) {
    const filteredArray = yDocStore.joinees.filter(
      (user) => user.id !== joinee.id
    );
    yDocStore.joinees = [];
    yDocStore.joinees = [...filteredArray];
  }

  function joiningUsers(joinee: userResponseType) {
    const filteredArray = yDocStore.joinees.filter(
      (user) => user.id === joinee.id
    );
    if (filteredArray.length === 0) {
      yDocStore.joinees.push(joinee);
    }
  }

  function showJoiningUsersModal() {
    showJoinneesModal.value = true;
  }
  function hideJoiningUsersModal() {
    showJoinneesModal.value = false;
  }



  function trackJoinAndLeavingUsers() {
    console.log("project_code", project_code);

    // window.Echo.join(`project.room`)
    //   .here((users: userResponseType[]) => {
    //     yDocStore.joinees = [...users];
    //     console.log("users here", users);

    //   })
    //   .joining((user: userResponseType) => {
    //     joiningUsers(user);
    //     console.log("users joining", user);

    //   })
    //   .leaving((user: userResponseType) => {
    //     leavingUsers(user);
    //     console.log("users joining", user);

    //   })
    //   .error((error: any) => {
    //     toast("Something went wrong", "", "danger");
    //     // localStorage.clear();
    //     console.log(error);

    //     // window.location.href = "/app/login";
    //   });
  }

  return {
    getProjectDetail,
    projectData,
    showJoiningUsersModal,
    hideJoiningUsersModal,
    loading,
    showJoinneesModal,
    trackJoinAndLeavingUsers,

  };
}
