/* eslint-disable no-undef */
import httpStatus from 'http-status'
import { Secret } from 'jsonwebtoken'
import config from '../../../config'
import ApiError from '../../../error/ApiError'
import { jwtHelpers } from '../../../helper/jwtHelper'
import { IUser } from '../users/users.interface'
import { User } from '../users/users.model'
import { ILoginUser, ILoginUserResponse } from './auth.interface'

const createUser = async (user: IUser): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_user_pass as string
  }

  if (user.role == 'seller' && (user.budget !== 0 || user.income)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Seller initial budget and income should be 0 !'
    )
  }

  if (user.role == 'buyer' && (user.budget === 0 || user.income !== 0)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Buyer initial budget and income more then 0, and income should be 0 !'
    )
  }

  const createdUser = await User.create(user)

  if (!createdUser) {
    throw new ApiError(400, 'Failed to create')
  }
  return createdUser
}

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { phoneNumber, password } = payload

  const isUserExist = await User.isUserExist(phoneNumber)

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect')
  }

  //create access token & refresh token
  const { phoneNumber: ph, role, needsPasswordChange } = isUserExist
  const accessToken = jwtHelpers.createToken(
    { ph, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  )

  return {
    accessToken,
    needsPasswordChange,
  }
}

export const AuthService = {
  createUser,
  loginUser,
}
