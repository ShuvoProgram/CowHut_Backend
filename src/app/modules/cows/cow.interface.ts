import { Model, Types } from 'mongoose'
import { IUser } from '../users/users.interface'

export type ICow = {
  name: string
  age: number
  price: number
  location:
    | 'Dhaka'
    | 'Chattogram'
    | 'Barishal'
    | 'Rajshahi'
    | 'Sylhet'
    | 'Comilla'
    | 'Rangpur'
    | 'Mymensingh'
  breed: string
  weight: number
  label: 'for sale' | 'sold out'
  category: 'Dairy' | 'Beef' | 'Dual Purpose'
  seller: Types.ObjectId | IUser
}

export type CowModel = Model<ICow, Record<string, unknown>>

export type ICowFilters = {
  query?: string
  minPrice?: string
  maxPrice?: string
  location?: string
}
