/* eslint-disable no-console */
import { Request, Response } from 'express'
import httpStatus from 'http-status'
import config from '../../../config'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IAdmin, ILoginAdminResponse } from './admin.interface'
import { AdminService } from './admin.service'

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...adminData } = req.body
  const result = await AdminService.createAdmin(adminData)
  sendResponse<IAdmin>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin created successfully',
    data: result,
  })
})

const loginAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body
  const result = await AdminService.loginAdmin(loginData)
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }

  res.cookie('accessToken', cookieOptions)

  sendResponse<ILoginAdminResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: result,
  })
})

export const AdminController = {
  createAdmin,
  loginAdmin,
}
