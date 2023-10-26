export default interface IUserForm {
  id?: number
  email: string
  password?: string
  name: string
  lastName: string
  role_id: number|null
  photo: File | null
  company_id: number | null
  identification:number|string
  phone:number|string
}
