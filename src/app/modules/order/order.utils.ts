import mongoose from "mongoose";
import { Order } from "./order.model";

// Helper function for fetching order details for Sellers
export const getOrderDetailsForSeller = async (orderId: mongoose.Types.ObjectId, userId: string) => {
  const result = await Order.aggregate([
    {
      $match: { _id: orderId },
    },
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
  ]);

  return result[0];
};

// Helper function for fetching order details for Buyers
export const getOrderForBuyer = async (_id: string, userId: string) => {
  return await Order.findOne({ _id, buyer: userId })
    .populate("buyer")
    .populate({ path: "cow", populate: { path: "seller" } });
};

// Helper function for fetching order details with default population
export const getOrderWithDefaultPopulation = async (_id: string) => {
  return await Order.findById(_id)
    .populate("buyer")
    .populate({ path: "cow", populate: { path: "seller" } });
};