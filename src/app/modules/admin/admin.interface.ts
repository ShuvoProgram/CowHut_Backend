import { Model, Types } from 'mongoose'

export type UserName = {
  firstName: string
  lastName: string
}

export type IAdmin = {
  phoneNumber: string
  name: UserName
  role: string
  password: string
  needsPasswordChange?: boolean
  passwordChangedAt: Date
  address: string
  admin?: Types.ObjectId | IAdmin
}

export type AdminModel = Model<IAdmin, Record<string, unknown>>
