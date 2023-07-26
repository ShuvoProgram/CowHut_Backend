/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose'

export type UserName = {
  firstName: string
  lastName: string
}

export type IAdmin = {
  id: string
  name: UserName
  role: string
  phoneNumber: string
  password: string
  needsPasswordChange: boolean
  passwordChangedAt: Date
  address: string
  admin?: Types.ObjectId | IAdmin
}

export type AdminModel = {
  isUserExist(
    phoneNumber: string
  ): Promise<
    Pick<
      IAdmin,
      'id' | 'password' | 'role' | 'phoneNumber' | 'needsPasswordChange'
    >
  >
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>
} & Model<IAdmin>

export type ILoginAdminResponse = {
  accessToken: string
  refreshToken?: string
  needsPasswordChange: boolean
}

// export type AdminModel = Model<IAdmin, Record<string, unknown>>
