/* eslint-disable no-console */
/* eslint-disable no-undef */
import httpStatus from 'http-status'
import { Secret } from 'jsonwebtoken'
import config from '../../../config'
import ApiError from '../../../error/ApiError'
import { jwtHelpers } from '../../../helper/jwtHelper'
import { IUser } from '../users/users.interface'
import { User } from '../users/users.model'
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface'

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
  const { id: userId, role, needsPasswordChange } = isUserExist

  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  )
  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  )

  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  }
}

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null

  try {
    // Verify the refresh token using the jwtHelpers.verifyToken function.
    // If the verification fails, an error will be thrown.
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    )
  } catch (err) {
    // If the refresh token is invalid or has expired, throw an ApiError with status 403 (FORBIDDEN).
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token')
  }

  console.log(verifiedToken)

  // Extract the userId from the verifiedToken.
  const { userId } = verifiedToken

  // Check if the user with the extracted userId exists in the database.
  const isUserExist = await User.findById(userId)

  console.log(isUserExist)

  if (!isUserExist) {
    // If the user does not exist, throw an ApiError with status 404 (NOT_FOUND).
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  // Generate a new access token using the jwtHelpers.createToken function.
  const newAccessToken = jwtHelpers.createToken(
    {
      // id: isUserExist.id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  )

  // Return the new access token in the response.
  return {
    accessToken: newAccessToken,
  }
}

export const AuthService = {
  createUser,
  loginUser,
  refreshToken,
}
