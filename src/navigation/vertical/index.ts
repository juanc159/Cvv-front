// export default [
//   {
//     title: 'Home',
//     to: { name: 'root' },
//     icon: { icon: 'tabler-smart-home' },
//   },
//   {
//     title: 'Second page',
//     to: { name: 'second-page' },
//     icon: { icon: 'tabler-file' },
//   },
// ]


import type { VerticalNavItems } from '@/@layouts/types';

import { useAuthenticationStore } from '@/stores/useAuthenticationStore';

const { getMenuData } = storeToRefs(useAuthenticationStore())

console.log(getMenuData.value);
export default getMenuData as VerticalNavItems
