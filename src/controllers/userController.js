import { userService } from '~/services/userService'
import bcrypt from 'bcrypt'
import ms from 'ms'
import { StatusCodes } from 'http-status-codes'
import { generateToken } from '~/utils/generateToken'
import { env } from '~/config/environment'

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
      '1h'
    )
    const refreshToken = await generateToken(
      user,
      env.REFRESH_TOKEN_SECRET,
      // refresh token expires in 7 days (longer than access token)
      '14d')
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
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

export const userController = {
  loginUser,
  signupUser,
  logoutUser
}