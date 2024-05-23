/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import bcrypt from 'bcrypt'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import e from 'express'


// Define Collection (Name & Schema)
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().trim().strict(),
  username: Joi.string().required().min(3).max(30).trim().strict(),
  password: Joi.string().required().min(6).trim().strict(),
  name: Joi.string().required().min(3).max(256).trim().strict(),
  // avatar: Joi.string().uri().trim().strict().default(null),
  // role: Joi.string().valid('user', 'admin').required().default('user'),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

// Chỉ định những Fields ko cho phép cập nhật
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const signupUser = async (data) => {
  try {
    const userExists = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      username: data.username
    })
    if (userExists) {
      throw new ApiError(StatusCodes.CONFLICT, 'User already exists')
    }
    await GET_DB().collection(USER_COLLECTION_NAME).insertOne(data)
    return { username: data.username }
  } catch (error) {
    throw error
  }
}

const loginUser = async (data) => {
  try {
    const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      username: data.username
    })
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Access denied')
    }
    const isValid = await bcrypt.compare(data.password, user.password)
    if (!isValid) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Access denied')
    }
    return { username: user.username }
  } catch (error) {
    throw error
  }
}

export const userModel = {
  loginUser,
  signupUser
}