/* eslint-disable no-console */
import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IOrder } from './order.interface';
import { OrderService } from './order.service';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';

//Create Order
const createOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const order = req.body;
    const result = await OrderService.createOrder(order);

    sendResponse<IOrder>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order Placed created successfully!',
      data: result,
    });
  }
);

//Get all user
const getAllOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.user?.userId;
  const role = req?.user?.role;
  const paginationOptions = pick(req.query, paginationFields);
  const result = await OrderService.getAllOrder(userId, role, paginationOptions);

  sendResponse<IOrder[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully !',
    data: result?.data,
    meta: result?.meta
  });
});

const getOrder = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req?.user?.userId;
  const role = req?.user?.role;

  const result = await OrderService.getOrder(id, role, userId);

  sendResponse<IOrder>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order data Retrieved Successfully!",
    data: result
  })
})

export const OrderController = {
  createOrder,
  getAllOrder,
  getOrder
};
