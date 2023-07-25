import httpStatus from 'http-status'
import { Secret } from 'jsonwebtoken'
import config from '../../../config'
import ApiError from '../../../error/ApiError'
import { jwtHelpers } from '../../../helper/jwtHelper'
import { ILoginUser } from '../auth/auth.interface'
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

export const AdminService = {
  createAdmin,
  loginAdmin,
}
