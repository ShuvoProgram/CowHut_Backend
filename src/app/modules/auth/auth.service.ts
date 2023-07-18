import httpStatus from 'http-status'
import config from '../../../config'
import ApiError from '../../../error/ApiError'
import { IUser } from '../users/users.interface'
import { User } from '../users/users.model'

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

// const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
//   const {phoneNumber, password} = payload;

//   const isUserExist = await User
// }

export const AuthService = {
  createUser,
}
