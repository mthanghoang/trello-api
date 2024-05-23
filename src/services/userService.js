/* eslint-disable no-useless-catch */
import { userModel } from '~/models/userModel'

const signupUser = async (data) => {
  try {
    return await userModel.signupUser(data)
  } catch (error) {
    throw error
  }
  // res.json({ message: 'Signup user' })
}

const loginUser = async (data) => {
  try {
    return await userModel.loginUser(data)
  } catch (error) {
    throw error
  }
  // res.json({ message: 'Login user' })
}

export const userService = {
  loginUser,
  signupUser
}