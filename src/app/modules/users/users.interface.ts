/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose'
import { IAdmin } from '../admin/admin.interface'

export type UserName = {
  firstName: string
  lastName: string
}
export type IUser = {
  id: string
  name: UserName
  role: string
  phoneNumber: string
  password: string
  needsPasswordChange: boolean
  address: string
  budget: number
  income: number
  admin?: Types.ObjectId | IAdmin
}

export type UserModel = {
  isUserExist(
    phoneNumber: string
  ): Promise<
    Pick<
      IUser,
      'id' | 'password' | 'role' | 'phoneNumber' | 'needsPasswordChange'
    >
  >
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>
} & Model<IUser>

export type UserModels = {
  isUserFound(
    id: string
  ): Promise<
    Pick<
      IUser,
      'id' | 'password' | 'role' | 'phoneNumber' | 'needsPasswordChange'
    >
  >
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>
} & Model<IUser>
