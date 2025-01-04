import { useToast } from '@/composables/useToast';
import { router } from '@/plugins/1.router';
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
  const sendId = user_id

  console.log("sendId", sendId);


  const projectData = ref<IProjectDetail>({} as IProjectDetail);

  async function getProjectDetail() {
    try {
      loading.value = true;


      const { data, response } = await useApi<any>(
        createUrl(`/miro/details`, {
          query: {
            code: project_code,
            send_id: sendId,
          },
        })
      );

      if (!Array.isArray(data.value.project)) {
        projectData.value = data.value.project;
        knowWhoIsTyping()
      } else {
        router.push({ name: "Login" })
      }

      loading.value = false;
    } catch (error) {
      toast((error as Error).message, "", "danger");
      loading.value = false;
    }
  }


  function knowWhoIsTyping() {


    window.Echo.private(`typing.${sendId}`)
      .listen("UserTypingEvent", (e: any) => {
        console.log("message here :", e);

      })
      .listenForWhisper("typing", (e: any) => {
        yDocStore.cursor.typingUser = e.name
        console.log(e, " is typing...");
      }).error((error: any) => {
        console.log(error);
        localStorage.clear();
        router.push({ name: "Login" })
      });

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



  function trackJoinAndLeavingUsers() {
    window.Echo.join(`project.room.${project_code}`)
      .here((users: userResponseType[]) => {
        yDocStore.joinees = [...users];
        console.log("users here", users);


      })
      .joining((user: userResponseType) => {
        joiningUsers(user);
        console.log("user joining", user);

      })
      .leaving((user: userResponseType) => {
        leavingUsers(user);
        console.log("user leaving", user);

      })
      .error((error: any) => {
        console.log(error);
        localStorage.clear();
        router.push({ name: "Login" })
      });
  }


  return {
    getProjectDetail,
    projectData,
    loading,
    trackJoinAndLeavingUsers,

  };
}
