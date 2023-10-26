export default interface IFormCompany {
  user_id:number
  id?: number
  name: string
  email: string
  nit: string
  phone: string
  identification_rep: string
  address_rep: string
  email_rep: string
  address: string
  description: string
  nameLegalRepresentative: string
  phoneLegalRepresentative: string
  startDate: string
  endDate: string
  headerReport: string | null
  footerReport: string | null
  logo: File | null
}
