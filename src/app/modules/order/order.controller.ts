import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IOrder } from './order.interface';
import { OrderService } from './order.service';

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
  const result = await OrderService.getAllOrder();

  sendResponse<IOrder[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully !',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrder,
};
