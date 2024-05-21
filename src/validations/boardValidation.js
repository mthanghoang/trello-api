import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'

const getListBoards = async (req, res, next) => {
  next()
}

const createNew = async (req, res, next) => {
  const correctPayload = Joi.object({
    title: Joi.string().required().min(3).max(256).trim().strict(),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
  })

  try {
    // console.log('request body: ', req.body)

    await correctPayload.validateAsync(req.body, { abortEarly: false })

    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY,
      new Error(error).message
    ))
  }
}

const getDetails = async (req, res, next) => {
  try {
    const correctBoardId = Joi.object({
      id: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).message('BoardId fails to match the Object Id pattern!')
    })
    await correctBoardId.validateAsync(req.params)
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY), new Error(error).message)
  }
}

const update = async (req, res, next) => {
  const correctBoardId = Joi.object({
    id: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).message('BoardId fails to match the Object Id pattern!')
  })
  const correctPayload = Joi.object({
    title: Joi.string().min(3).max(256).trim().strict(),
    description: Joi.string().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE),
    columnOrderIds: Joi.array().items(
      Joi.string().pattern(/^[0-9a-fA-F]{24}$/).message('ColumnId fails to match the Object Id pattern!')
    )
  })

  try {
    await correctBoardId.validateAsync(req.params)
    await correctPayload.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY,
      new Error(error).message
    ))
  }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  const correctPayload = Joi.object({
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
    await correctPayload.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY,
      new Error(error).message
    ))
  }
}

export const boardValidation = {
  getListBoards,
  getDetails,
  createNew,
  update,
  moveCardToDifferentColumn
}