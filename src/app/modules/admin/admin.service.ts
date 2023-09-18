import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../error/ApiError';
import { jwtHelpers } from '../../../helper/jwtHelper';
import { ILoginUser, IRefreshTokenResponse } from '../auth/auth.interface';
import { IAdmin, ILoginAdminResponse } from './admin.interface';
import { Admin } from './admin.model';

const createAdmin = async (admin: IAdmin): Promise<IAdmin | null> => {
  // Ensure a password is provided or handle this requirement explicitly.
  if (!admin.password) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password is required for admin creation');
  }

  const result = await Admin.create(admin);
  return result;
}

const loginAdmin = async (
  payload: ILoginUser
): Promise<ILoginAdminResponse> => {
  const { phoneNumber, password } = payload;
  const isUserExist = await Admin.isUserExist(phoneNumber);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }

  if (!(await Admin.isPasswordMatched(password, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password');
  }

  const { _id: userId, role, needsPasswordChange } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  };
}

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );

    const { userId } = verifiedToken;
    const isUserExist = await Admin.findById(userId);

    if (!isUserExist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
    }

    const newAccessToken = jwtHelpers.createToken(
      {
        id: isUserExist.id,
        role: isUserExist.role,
      },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );

    return {
      accessToken: newAccessToken,
    };
    
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }
  
}

const getSingleAdmin = async (id: string): Promise<IAdmin | null> => {
  const result = await Admin.findById(id);
  return result;
}

export const AdminService = {
  createAdmin,
  loginAdmin,
  getSingleAdmin,
  refreshToken,
};
