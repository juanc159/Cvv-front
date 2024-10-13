export default interface IForm {
  id?: number | null
  email: string | null
  password?: string | null
  name: string | null
  last_name: string | null
  photo: File | null
  company_id: string | null
}
