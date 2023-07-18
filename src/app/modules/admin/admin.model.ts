/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt'
import { Schema, model } from 'mongoose'
import config from '../../../config'
import { AdminRole } from '../../../enums/users'
import { AdminModel, IAdmin } from './admin.interface'

const AdminSchema: Schema<IAdmin> = new Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    role: {
      type: String,
      enum: [AdminRole.Admin],
      default: AdminRole.Admin,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

AdminSchema.pre('save', async function (next) {
  //hashing user password
  const user = this
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bycrypt_salt_rounds)
  )

  if (!user.needsPasswordChange) {
    user.passwordChangedAt = new Date()
  }
  next()
})

export const Admin = model<IAdmin, AdminModel>('Admin', AdminSchema)
