/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import ApiError from '../../../error/ApiError'
import { IUser } from './users.interface'
import { User } from './users.model'
import isUserFound from './users.utilis'

//get all users

const getAllUsers = async (): Promise<IUser[] | null> => {
  const result = await User.find({})
  return result
}

//get single user
const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id)
  return result
}

//Update user

const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const isExist = await User.findById(id)
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!')
  }
  const { name, ...userData } = payload
  const updateUserData: Partial<IUser> = { ...userData }
  if (updateUserData.role !== 'buyer' && updateUserData.role !== 'seller') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'role should be buyer or seller!'
    )
  }
  if (updateUserData.role === 'buyer') {
    if (updateUserData.income && updateUserData.income > 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Buyer income should be 0')
    }
  } else if (updateUserData.role === 'seller') {
    if (updateUserData.budget && updateUserData.budget > 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Sellers budget should be 0')
    }
  }

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser>
      ;(updateUserData as any)[nameKey] = name[key as keyof typeof name]
    })
  }
  const result = await User.findByIdAndUpdate(id, updateUserData, {
    new: true,
  })
  return result
}

// Delete user
const deleteUser = async (id: string): Promise<IUser | null> => {
  const isExist = await User.findById(id)
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!')
  }
  const result = await User.findByIdAndDelete(id)
  return result
}

const profileUser = async (id: string): Promise<IUser | null> => {
  if(!(await isUserFound(id))) {
    throw new ApiError(400, "User not found");
  };

  const data = await User.findById(id);
  return data;
}

const updateProfile = async (_id: string, payload: IUser): Promise<IUser | null> => {
  if(!(await isUserFound(_id))) {
    throw new ApiError(400, "User not found");
  };

  const {name, ...userData} = payload;
  if (name && Object.keys(name).length) {
    Object.keys(name).map((field) => {
      const nameKey = `name.${field}`;
      (userData as any)[nameKey] = name[field as keyof typeof name];
    });
  }

  const data = await User.findOneAndUpdate({_id}, userData, {
    new: true,
    runValidators: true
  });

  return data;
}

export const UserService = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  profileUser,
  updateProfile
}
