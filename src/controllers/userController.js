import { userService } from '~/services/userService'
import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'
import { generateToken } from '~/utils/generateToken'

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
    const token = generateToken(user)
    res.status(StatusCodes.OK).json({ token })
  } catch (error) {
    next(error)
  }
}

export const userController = {
  loginUser,
  signupUser
}