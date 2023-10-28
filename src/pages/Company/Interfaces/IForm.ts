import IDetail from "./IDetail"

export default interface IForm {
  id?: number | null
  name: string | null
  slogan?: string | null
  arrayDetails: Array<IDetail>
}
