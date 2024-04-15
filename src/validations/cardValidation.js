import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    boardId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).message('BoardId fails to match the Object Id pattern!'),
    columnId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).message('ColumnId fails to match the Object Id pattern!'),
    title: Joi.string().required().min(3).max(256).trim().strict()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY,
      new Error(error).message
    ))
  }
}

const deleteCard = async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).message('CardId fails to match the Object Id pattern!')
  })
  try {
    await correctCondition.validateAsync(req.params)
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY,
      new Error(error).message
    ))
  }
}

export const cardValidation = {
  createNew,
  deleteCard
}