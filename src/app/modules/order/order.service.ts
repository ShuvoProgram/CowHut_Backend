import httpStatus from 'http-status'
import mongoose, { ClientSession } from 'mongoose'
import ApiError from '../../../error/ApiError'
import { Cow } from '../cows/cow.model'
import { User } from '../users/users.model'
import { IOrder } from './order.interface'
import { Order } from './order.model'

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
const getAllOrder = async (): Promise<IOrder[] | null> => {
  const result = await Order.find({}).populate('cow').populate('buyer')
  return result
}

export const OrderService = {
  createOrder,
  getAllOrder,
}
