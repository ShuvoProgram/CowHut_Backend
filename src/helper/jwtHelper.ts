/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import { IAdmin } from '../app/modules/admin/admin.interface'
import config from '../config'

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime,
  })
}

// Function to generate refresh token
export const generateRefreshToken = (admin: IAdmin): string => {
  const refreshToken = jwt.sign(
    { _id: admin._id, role: admin.role },
    config.jwt.refresh_secret as string,
    { expiresIn: config.jwt.refresh_expires_in } // Set the refresh token expiry time, e.g., '7d'
  )
  return refreshToken
}

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload
}

// Function to verify the token
export const verifyTokens = (token: string, secret: string): any => {
  return jwt.verify(token, secret)
}

export const jwtHelpers = {
  createToken,
  verifyToken,
}
