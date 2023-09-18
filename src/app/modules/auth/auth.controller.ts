/* eslint-disable no-console */
import { Request, Response } from 'express'
import { RequestHandler } from 'express-serve-static-core'
import httpStatus from 'http-status'
import config from '../../../config'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IUser } from '../users/users.interface'
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface'
import { AuthService } from './auth.service'

const createUsers: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.body
    const result = await AuthService.createUser(user)

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user created successfully!',
      data: result,
    })
  }
)

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body
  const result = await AuthService.loginUser(loginData)
  // console.log(result)
  const { refreshToken, ...others } = result
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }

  res.cookie('refreshToken', refreshToken, cookieOptions)

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: others,
  })
})

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.cookies)
  const { refreshToken } = req.cookies
  const result = await AuthService.refreshToken(refreshToken)

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

export const AuthController = {
  createUsers,
  loginUser,
  refreshToken,
}
