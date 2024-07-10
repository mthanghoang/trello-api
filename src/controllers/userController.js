import { userService } from '~/services/userService'
import bcrypt from 'bcrypt'
import ms from 'ms'
import { StatusCodes } from 'http-status-codes'
import { generateToken } from '~/utils/jwtProvider'
import { env } from '~/config/environment'
import { verifyToken } from '~/utils/jwtProvider'
import ApiError from '~/utils/ApiError'

//signup user
const signupUser = async (req, res, next) => {
  try {
    const username = req.body.username
    const password = await bcrypt.hash(req.body.password, 10)
    const user = await userService.signupUser({ username, password })
    const token = generateToken(user)
    res.status(StatusCodes.CREATED).json({ token })
  } catch (error) {
    next(error)
  }
}

// login user
const loginUser = async (req, res, next) => {
  try {
    const username = req.body.username
    const password = req.body.password
    const user = await userService.loginUser({ username, password })
    const accessToken = await generateToken(
      user,
      env.ACCESS_TOKEN_SECRET,
      // '5s' // access token expires in 5 seconds
      '5m'
      // '1h'
    )
    const refreshToken = await generateToken(
      user,
      env.REFRESH_TOKEN_SECRET,
      // refresh token expires in 7 days (longer than access token)
      '14d'
      // '15s'
    )
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: env.BUILD_MODE === 'production',
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.BUILD_MODE === 'production',
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    //Trả về access token, refresh token và thông tin user
    res.status(StatusCodes.OK).json({
      ...user })
  } catch (error) {
    next(error)
  }
}

const logoutUser = async (req, res, next) => {
  try {
    // Clear cookies
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.status(StatusCodes.OK).json({ message: 'Logout API success' })
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    // Solution 1: Get refresh token from request cookies
    const refreshToken = req.cookies?.refreshToken

    // Solution 2: Get refresh token from request body (FE sends refresh token in request body)
    // const refreshToken = req.body?.refreshToken

    // Verify refresh token
    const decoded = await verifyToken(refreshToken, env.REFRESH_TOKEN_SECRET)
    const user = { username: decoded.username }
    const accessToken = await generateToken(
      user,
      env.ACCESS_TOKEN_SECRET,
      // '5s' // access token expires in 5 seconds
      '5m'
    )

    // Set access token to cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: env.BUILD_MODE === 'production',
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    // Return response
    res.status(StatusCodes.OK).json({ accessToken: accessToken })

  } catch (error) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token expired / invalid'))
  }
}

export const userController = {
  loginUser,
  signupUser,
  logoutUser,
  refreshToken
}