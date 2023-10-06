import  bcrypt  from 'bcrypt';
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import ApiError from '../../../error/ApiError'
import { IUser } from './users.interface'
import { User } from './users.model'
import isUserFound from './users.utilis'
import config from '../../../config';

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

const updateUser = async (
  id: string,
  payload: IUser
): Promise<IUser | null> => {
  // Check if the user exists
  const existingUser = await User.findById(id);
  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const {name, ...userData} = payload;
  

  // Ensure the role is either 'buyer' or 'seller'
  if (!['buyer', 'seller'].includes(payload.role || existingUser.role)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Role should be "buyer" or "seller".'
    );
  }

  // Validate the income and budget based on the role
  if (payload.role === 'buyer' && payload.income !== undefined && payload.income > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Buyer income should be 0.');
  } else if (payload.role === 'seller' && payload.budget !== undefined && payload.budget > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Seller budget should be 0.');
  }

  // Update user data including the name
  if (name) {
    existingUser.name = { ...existingUser.name, ...name };
  }

  // Update other user data
  if (userData.password) {
    // Hash the updated password if provided
    userData.password = await bcrypt.hash(
    userData.password,
      Number(config.bycrypt_salt_rounds)
    );
  }

  // Save the updated user
  const updatedUser = await User.findByIdAndUpdate(id, userData, {
    new: true,
    runValidators: true
  })
  return updatedUser;
};


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

const updateProfile = async (userId: string, payload: IUser): Promise<IUser | null> => {
  if(!(await isUserFound(userId))) {
    throw new ApiError(400, "User not found");
  };

  const {name, ...userData} = payload;
  if (name && Object.keys(name).length) {
    Object.keys(name).map((field) => {
      const nameKey = `name.${field}`;
      (userData as any)[nameKey] = name[field as keyof typeof name];
    });
  }

  userData.password = await bcrypt.hash(
    userData.password,
    Number(config.bycrypt_salt_rounds)
  )

  const data = await User.findByIdAndUpdate(userId, userData, {
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
