/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt'
import { Schema, model } from 'mongoose'
import config from '../../../config'
import { role } from './users.constant'
import { IUser, UserModel } from './users.interface'

const userSchema = new Schema(
  {
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
      enum: role,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    address: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      default: 0,
      required: true,
    },
    income: {
      type: Number,
      default: 0,
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

// Pre-save hook for password hashing and other modifications
userSchema.pre('save', async function (next) {
  // If the password has not been modified, continue
  if (!this.isModified("password")) return next();

  const user = this;

  // Hashing user password
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bycrypt_salt_rounds) // Make sure config.bycrypt_salt_rounds is a valid number
  );

  // user.passwordConfirm = undefined;

  // Update passwordChangedAt if it's not set
  if (!user.passwordChangedAt) {
    user.passwordChangedAt = new Date();
  }

  next();
});

userSchema.statics.isUserExist = async function (
  phoneNumber: string
): Promise<IUser | null> {
  return await User.findOne(
    { phoneNumber },
    { id: 1, phoneNumber: 1, password: 1, role: 1, needsPasswordChange: 1 }
  )
}

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword)
}

export const User = model<IUser, UserModel>('User', userSchema)
