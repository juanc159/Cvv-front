import IDetail from "./IDetail"

export default interface IForm {
  id?: number | null
  name: string | null
  slogan?: string | null
  image_principal: File | null
  iframeGoogleMap?: string | null
  arrayDetails: Array<IDetail>
}
