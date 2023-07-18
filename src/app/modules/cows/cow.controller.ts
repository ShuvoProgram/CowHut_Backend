/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { NextFunction, Request, RequestHandler, Response } from 'express'
import httpStatus from 'http-status'
import { paginationFields } from '../../../constants/pagination'
import catchAsync from '../../../shared/catchAsync'
import pick from '../../../shared/pick'
import sendResponse from '../../../shared/sendResponse'
import { cowFilterableFields } from './cow.constant'
import { ICow } from './cow.interface'
import { CowService } from './cow.service'

//Create Cow
const createCow: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cow = req.body
    const result = await CowService.createCow(cow)
    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user created successfully!',
      data: result,
    })
  }
)

const getAllCow = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, cowFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)
  const result = await CowService.getAllCow(filters, paginationOptions)

  sendResponse<ICow[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cows retrieved successfully !',
    meta: result.meta,
    data: result.data,
  })
})

//Get single user
const getSingleCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id

  const result = await CowService.getSingleCow(id)

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'A Cow Data has been retrieved successfully !',
    data: result,
  })
})

//Update User
const updateCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const updatedData = req.body
  const result = await CowService.updateCow(id, updatedData)
  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow has been updated successfully !',
    data: result,
  })
})

//Delete user
const deleteCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await CowService.deleteCow(id)

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow deleted successfully !',
    data: result,
  })
})

export const CowController = {
  createCow,
  getAllCow,
  getSingleCow,
  updateCow,
  deleteCow,
}
