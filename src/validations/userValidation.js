import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const signupUser = async (req, res, next) => {
  const correctPayload = Joi.object({
    username: Joi.string().required().min(3).max(30),
    password: Joi.string().required().min(6)
  })

  try {
    await correctPayload.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY,
      new Error(error).message
    ))
  }
}

const loginUser = async (req, res, next) => {
  const correctPayload = Joi.object({
    username: Joi.string().required().min(3).max(30),
    // email: Joi.string().email(),
    password: Joi.string().required().min(6)
  })
  // .or('username', 'email')
  // .required()

  try {
    await correctPayload.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY,
      new Error(error).message
    ))
  }
}

export const userValidation = {
  loginUser,
  signupUser
}