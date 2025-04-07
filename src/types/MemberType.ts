export interface MemberType {
  _id?: string
  username?: string
  email?: string
  password?: string
  phoneNumber?: string
  role?: string
  passive?: boolean
  title?: string
  fullName?: string
  firstName?: string
  lastName?: string
  gender?: '' | 'male' | 'female' | 'other'
  dateOfBirth?: string
  image?: any
  bio?: string
  location?: string
  links?: string[]
  married?: boolean
  children?: number
}