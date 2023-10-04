import httpStatus from 'http-status'
import mongoose, { ClientSession } from 'mongoose'
import ApiError from '../../../error/ApiError'
import { Cow } from '../cows/cow.model'
import { User } from '../users/users.model'
import { IOrder } from './order.interface'
import { Order } from './order.model'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { paginationHelpers } from '../../../helper/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import { UserRole } from '../../../enums/users'
import { getOrderDetailsForSeller, getOrderForBuyer, getOrderWithDefaultPopulation } from './order.utils'

const createOrder = async (payload: IOrder): Promise<IOrder | null> => {
  const session: ClientSession = await mongoose.startSession()
  session.startTransaction()
  const { ...orderData } = payload

  try {
    const cowData = await Cow.findById(orderData.cow).session(session)
    if (!cowData) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Cow not found !')
    }

    const BuyerData = await User.findById(payload.buyer).session(session)
    if (!BuyerData) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Buyer not found !')
    }
    if (BuyerData && BuyerData.role !== 'buyer') {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Sellers can not make orders !'
      )
    }

    if (BuyerData.budget < cowData.price) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Buyer needs more money to complete order'
      )
    }
    if (cowData.label !== 'for sale') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'The cow is already sold out')
    }

    cowData.label = 'sold out'
    await cowData.save()

    BuyerData.budget -= cowData.price
    await BuyerData.save()

    const sellerData = await User.findById(cowData.seller).session(session)
    if (!sellerData) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Seller does not exist in the UserData'
      )
    }

    // Increasing sellers income
    sellerData.income += cowData.price
    await sellerData.save()

    // Create an entry in the orders collection
    const order = {
      cow: payload.cow,
      buyer: payload.buyer,
    }
    const newOrder = await Order.create(order)
    await session.commitTransaction()
    session.endSession()
    return newOrder
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}

//Get all user
const getAllOrder = async (userId: string, role: string, paginationOptions: IPaginationOptions): Promise<IGenericResponse<IOrder[]> | null> => {
  const {page, limit, skip, sortBy, sortOrder} = paginationHelpers.calculatePagination(paginationOptions);

  const sortCondition = {[sortBy]: sortOrder};

  let data: IOrder[];

  if (role === "seller") {
    data = await Order.aggregate([
      {
        $lookup: {
          from: "cows",
          localField: "cow",
          foreignField: "_id",
          as: "cow",
        },
      },
      {
        $unwind: "$cow",
      },
      {
        $match: { "cow.seller": userId },
      },
      {
        $lookup: {
          from: "users",
          localField: "cow.seller",
          foreignField: "_id",
          as: "cow.seller",
        },
      },
      {
        $unwind: "$cow.seller",
      },
      {
        $lookup: {
          from: "users",
          localField: "buyer",
          foreignField: "_id",
          as: "buyer",
        },
      },
      {
        $unwind: "$buyer",
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
  } else if (role === "buyer") {
    data = await Order.find({ buyer: userId })
      .populate("buyer")
      .populate({ path: "cow", populate: { path: "seller" } })
      .sort(sortCondition)
      .skip(skip)
      .limit(limit);
  } else {
    data = await Order.find()
      .populate("buyer")
      .populate({ path: "cow", populate: { path: "seller" } })
      .sort(sortCondition)
      .skip(skip)
      .limit(limit);
  }

  const total = await Order.countDocuments();
  const meta = { page, limit, total };
  return { meta: meta, data };
}

const getOrder = async (_id: string, role: string, userId: string): Promise<IOrder | null> => {
  // Find the order by _id and populate the "cow" field
  const order = await Order.findById(_id).populate("cow");

  if (!order) {
    throw new ApiError(400, "Order not found!");
  }

  // Convert _id to a mongoose ObjectId
  const orderId = new mongoose.Types.ObjectId(_id);

  let data: IOrder | null;

  if (role === UserRole.Seller) {
    // For Sellers, perform aggregation to fetch the order details
    data = await getOrderDetailsForSeller(orderId, userId);
  } else if (role === UserRole.Buyer) {
    // For Buyers, fetch the order with buyer matching
    data = await getOrderForBuyer(_id, userId);
  } else {
    // For other roles, fetch the order with default population
    data = await getOrderWithDefaultPopulation(_id);
  }

  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unauthorized access!");
  }

  return data;
};




export const OrderService = {
  createOrder,
  getAllOrder,
  getOrder
}
