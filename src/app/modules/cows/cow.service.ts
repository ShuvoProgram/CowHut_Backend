import httpStatus from 'http-status'
import { SortOrder } from 'mongoose'
import ApiError from '../../../error/ApiError'
import { paginationHelpers } from '../../../helper/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { User } from '../users/users.model'
import { cowSearchableFields } from './cow.constant'
import { ICow, ICowFilters } from './cow.interface'
import { Cow } from './cow.model'

//Create Cow
const createCow = async (cow: ICow): Promise<ICow | null> => {
  if (!cow.label) {
    cow.label = 'for sale'
  }
  const seller = await User.findById(cow.seller)
  if (!seller) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Seller Does Not Exist in the UserData'
    )
  }
  if (seller && seller.role !== 'seller') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Try with seller Id, It is an buyer Id'
    )
  }
  const newCow = (await Cow.create(cow)).populate('seller')
  return newCow
}

//Get All Cows
const getAllCow = async (
  filters: ICowFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICow[]>> => {
  const { query, minPrice, maxPrice, ...filtersData } = filters
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions)
  const andConditions = []
  if (query) {
    andConditions.push({
      $or: cowSearchableFields.map(field => ({
        [field]: {
          $regex: query,
          $options: 'i',
        },
      })),
    })
  }
  if (minPrice !== undefined) {
    andConditions.push({
      price: {
        $gte: minPrice,
      },
    })
  }
  if (maxPrice !== undefined) {
    andConditions.push({
      price: {
        $lte: maxPrice,
      },
    })
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    })
  }

  const sortConditions: { [key: string]: SortOrder } = {}

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {}

  const result = await Cow.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)

  const total = await Cow.countDocuments(whereConditions)

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}

//Get single user
const getSingleCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findById(id)
  return result
}

//Update user
const updateCow = async (
  id: string,
  payload: Partial<ICow>
): Promise<ICow | null> => {
  const isExist = await Cow.findById(id)
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow not found!')
  }
  if (payload.seller) {
    const seller = await User.findById(payload.seller)
    if (seller) {
      if (seller.role !== 'seller') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Id should be seller id !')
      }
    } else {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Seller with Provided Id not found'
      )
    }
  }

  const updatedLabel = payload.label

  if (updatedLabel) {
    if (updatedLabel !== 'for sale' && updatedLabel !== 'sold out') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Label value should be valid!')
    }
  }

  const result = await Cow.findByIdAndUpdate(id, payload, {
    new: true,
  })
  return result
}

//Delete user
const deleteCow = async (id: string): Promise<ICow | null> => {
  const isExist = await Cow.findById(id)
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow not found !')
  }
  const result = await Cow.findByIdAndDelete(id)
  return result
}

export const CowService = {
  createCow,
  getAllCow,
  getSingleCow,
  updateCow,
  deleteCow,
}
