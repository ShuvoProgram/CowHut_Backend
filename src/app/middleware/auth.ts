/* eslint-disable no-console */
import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { Secret } from 'jsonwebtoken'
import config from '../../config'
import ApiError from '../../error/ApiError'
import { jwtHelpers } from '../../helper/jwtHelper'

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const token = req.header('Authorization')?.replace('Bearer ', '') // Extract the token from the request header
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized')
      }

      //verify token
      let verifiedUser = null

      // console.log(token)
      // console.log(req)
      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret)
      req.user = verifiedUser

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Token')
      }
      next()
    } catch (error) {
      next(error)
    }
  }

export default auth
