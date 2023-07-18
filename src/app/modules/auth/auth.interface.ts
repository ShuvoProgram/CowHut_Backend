import { UserRole } from '../../../enums/users'

export type ILoginUser = {
  phoneNumber: string
  password: string
}

export type ILoginUserResponse = {
  accessToken: string
  refreshToken?: string
  needsPasswordChange: boolean
}

export type IRefreshTokenResponse = {
  accessToken: string
}

export type IVerifiedLoginUser = {
  userId: string
  role: UserRole
}
