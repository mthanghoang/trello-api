import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
  })

  try {
    // console.log('request body: ', req.body)

    await correctCondition.validateAsync(req.body, { abortEarly: false })

    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY,
      new Error(error).message
    ))
  }
}

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE)
    // columnOrderIds:
  })

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true //cho phép đẩy lên các field chưa biết (vd trong case này là columnOrderIds)
    })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY,
      new Error(error).message
    ))
  }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  const correctCondition = Joi.object({
    activeCardId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).message('Active CardId fails to match the Object Id pattern!'),

    activeColumnId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).message('Active ColumnId fails to match the Object Id pattern!'),

    activeCardOrderIds: Joi.array().required().items(
      Joi.string().pattern(/^[0-9a-fA-F]{24}$/).message('Active CardId fails to match the Object Id pattern!')
    ),

    overColumnId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).message('Active ColumnId fails to match the Object Id pattern!'),

    overCardOrderIds: Joi.array().required().items(
      Joi.string().pattern(/^[0-9a-fA-F]{24}$/).message('Active CardId fails to match the Object Id pattern!')
    )
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

export const boardValidation = {
  createNew,
  update,
  moveCardToDifferentColumn
}