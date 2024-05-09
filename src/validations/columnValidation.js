import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    boardId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).message('BoardId fails to match the Object Id pattern!'),
    title: Joi.string().required().min(3).max(256).trim().strict()
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
    // Nếu làm thêm tính năng chuyển column sang board khác thì mới validate boardId
    // boardId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).message('BoardId fails to match the Object Id pattern!'),
    title: Joi.string().min(3).max(256).trim().strict(),
    cardOrderIds: Joi.array().items(
      Joi.string().pattern(/^[0-9a-fA-F]{24}$/).message('CardId fails to match the Object Id pattern!')
    ).default([])
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

const deleteCol = async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).message('ColumnId fails to match the Object Id pattern!')
  })

  try {
    await correctCondition.validateAsync(req.params) // validateAsync phải truyền vào object (req.params là {id:....})
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY,
      new Error(error).message
    ))
  }
}

export const columnValidation = {
  createNew,
  update,
  deleteCol
}