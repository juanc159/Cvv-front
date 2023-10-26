export default interface IMenuList {
  id?: number
  title: string
  to: string
  icon: string
  component: string
  path: string
  requiresAuth: boolean | number
  requiredPermission: string
  pageTitle: string
}
