import { Request, Response } from 'express'
import { RequestHandler } from 'express-serve-static-core'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IUser } from '../users/users.interface'
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

export const AuthController = {
  createUsers,
}
