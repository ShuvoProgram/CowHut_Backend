/* eslint-disable no-console */
import { Request, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IUser } from './users.interface'
import { UserService } from './users.service'

//get all users

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers()

  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully !',
    data: result,
  })
})

//Get single user

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id

  const result = await UserService.getSingleUser(id)

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'An User retrieved successfully',
    data: result,
  })
})

//update User
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const updateData = req.body
  const result = await UserService.updateUser(id, updateData)
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User has been updated successfully !',
    data: result,
  })
})

// Delete user
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await UserService.deleteUser(id)

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User has been deleted successfully !',
    data: result,
  })
})


export const UserController = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
}
