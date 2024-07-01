// Desc: Middleware for checking if token received from client is valid
import { StatusCodes } from 'http-status-codes'
import { verifyToken } from '~/utils/jwtProvider'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'

const isAuthenticated = async (req, res, next) => {
  // Solution 1: Get token from request cookies
  const accessTokenCookie = req.cookies?.accessToken

  if (!accessTokenCookie) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized (Token not found)' })
    return
  }

  // Solution 2: Get token from request headers
  // const accessTokenHeader = req.headers.authorization
  // if (!accessTokenHeader) {
  //   res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized (Token not found' })
  //   return
  // }

  try {
    // Verify token
    // const decoded = await verifyToken(accessTokenHeader.substring('Bearer '.length), env.ACCESS_TOKEN_SECRET)
    const decoded = await verifyToken(accessTokenCookie, env.ACCESS_TOKEN_SECRET)

    // If token is valid, attach user info to req object
    req.jwtDecoded = decoded

    // Move to next middleware
    next()
  } catch (error) {
    // Case 1: Access token is expired. Need to return an error code, having agreed with front-end team, to refresh token
    if (error.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Token expired'))
      // res.status(StatusCodes.GONE).json({ message: 'Token expired' })
      return
    }
    // Case 2: Access token is invalid
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized (Invalid token)'))
    // res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized (Invalid token)' })

  }
}

export const authMiddleware = {
  isAuthenticated
}