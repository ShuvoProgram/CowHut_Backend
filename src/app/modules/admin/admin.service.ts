import httpStatus from 'http-status'
import { Secret } from 'jsonwebtoken'
import config from '../../../config'
import ApiError from '../../../error/ApiError'
import { jwtHelpers } from '../../../helper/jwtHelper'
import { ILoginUser, IRefreshTokenResponse } from '../auth/auth.interface'
import { IAdmin, ILoginAdminResponse } from './admin.interface'
import { Admin } from './admin.model'

const createAdmin = async (admin: IAdmin): Promise<IAdmin | null> => {
  // If password is not given,set default password
  if (!admin.password) {
    admin.password = config.default_admin_pass as string
  }
  const result = await Admin.create(admin)
  return result
}

const loginAdmin = async (
  payload: ILoginUser
): Promise<ILoginAdminResponse> => {
  const { phoneNumber, password } = payload

  const isUserExist = await Admin.isUserExist(phoneNumber)

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  if (
    isUserExist.password &&
    !(await Admin.isPasswordMatched(password, isUserExist.password))
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

  // Extract the userId from the verifiedToken.
  const { userId } = verifiedToken

  // Check if the user with the extracted userId exists in the database.
  const isUserExist = await Admin.findById(userId)

  if (!isUserExist) {
    // If the user does not exist, throw an ApiError with status 404 (NOT_FOUND).
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  // Generate a new access token using the jwtHelpers.createToken function.
  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist.id,
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

const getSingleAdmin = async (id: string): Promise<IAdmin | null> => {
  const result = await Admin.findById(id)
  return result
}

export const AdminService = {
  createAdmin,
  loginAdmin,
  getSingleAdmin,
  refreshToken,
}
