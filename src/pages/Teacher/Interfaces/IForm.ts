export default interface IForm {
  id?: number | null
  company_id: null | number
  type_education_id: null | number
  job_position_id: null | number
  complementaries: Array<object>
  name: null | string
  last_name: null | string
  email: null | string
  phone: null | string
  photo: null | File
}
