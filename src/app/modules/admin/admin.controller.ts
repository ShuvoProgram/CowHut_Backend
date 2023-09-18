/* eslint-disable no-console */
import { Request, Response } from 'express'
import httpStatus from 'http-status'
import config from '../../../config'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IRefreshTokenResponse } from '../auth/auth.interface'
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
  const { refreshToken, ...others } = result
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }

  res.cookie('refreshToken', refreshToken, cookieOptions)
  // Attach the access token to the response headers
  // res.header('Authorization', `Bearer ${refreshToken}`)

  sendResponse<ILoginAdminResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: others,
  })
})

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.cookies)
  const { refreshToken } = req.cookies
  const result = await AdminService.refreshToken(refreshToken)

  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }

  res.cookie('refreshToken', refreshToken, cookieOptions)

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'New access token generated successfully !',
    data: result,
  })
})

const getSingleAdmin = catchAsync(async (req: Request, res: Response) => {
  console.log(req.headers.authorization)
  const id = req.params.id
  const result = await AdminService.getSingleAdmin(id)

  sendResponse<IAdmin>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin fetched successfully',
    data: result,
  })
})

export const AdminController = {
  createAdmin,
  loginAdmin,
  refreshToken,
  getSingleAdmin,
}
