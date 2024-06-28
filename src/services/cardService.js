/* eslint-disable no-useless-catch */
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody, userInfo) => {
  try {
    const data = {
      ...reqBody,
      owner: userInfo.username
    }
    // const board = await boardModel.findOneById(data.boardId)
    // if (userInfo.username !== board.owner) {
    //   throw new ApiError(StatusCodes.FORBIDDEN, 'User is unauthorized')
    // }
    // Gọi tới tầng model để xử lý lưu bản ghi newcolumn vào DB
    const result = await cardModel.createNew(data)

    // Trả về bản ghi mới cho phía client
    const createdCard = await cardModel.findOneById(result.insertedId)

    //xử lí dữ liệu cho chuẩn với FE
    if (createdCard) {
      columnModel.pushCardOrderIds(createdCard)
      columnModel.update(createdCard.columnId, { updatedAt: Date.now() })
      boardModel.update(createdCard.boardId, { updatedAt: Date.now() })
    }
    return createdCard
  } catch (error) { throw error }
}

const deleteCard = async (cardId, userInfo) => {
  try {
    const cardToDelete = await cardModel.findOneById(cardId)
    if (!cardToDelete) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found')
    }

    // const board = await boardModel.findOneById(cardToDelete.boardId)
    // if (userInfo.username !== board.owner) {
    //   throw new ApiError(StatusCodes.FORBIDDEN, 'User is unauthorized')
    // }
    if (userInfo.username !== cardToDelete.owner) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'User is unauthorized')
    }

    // Xóa card
    cardModel.deleteOneById(cardId)
    // Update cardOrderIds array for column
    columnModel.pullCardOrderIds(cardToDelete)

    // Update updatedAt field for column and board
    columnModel.update(cardToDelete.columnId, {
      updatedAt: Date.now()
    })
    boardModel.update(cardToDelete.boardId, {
      updatedAt: Date.now()
    })

    return { deleteResult: 'Card deleted successfully' }
  } catch (error) { throw error }
}

const update = async (cardId, reqBody, userInfo) => {
  try {
    const cardToUpdate = await cardModel.findOneById(cardId)
    if (!cardToUpdate) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found')
    }

    // const board = await boardModel.findOneById(cardToUpdate.boardId)
    // if (userInfo.username !== board.owner) {
    //   throw new ApiError(StatusCodes.FORBIDDEN, 'User is unauthorized')
    // }
    if (userInfo.username !== cardToUpdate.owner) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'User is unauthorized')
    }

    const dataToUpdate = {
      ...reqBody,
      updatedAt: Date.now()
    }

    const updatedCard = await cardModel.update(cardId, dataToUpdate)
    if (updatedCard) {
      columnModel.update(updatedCard.columnId, { updatedAt: Date.now() })
      boardModel.update(updatedCard.boardId, { updatedAt: Date.now() })
    }
    return updatedCard
  } catch (error) { throw error }
}

export const cardService = {
  createNew,
  deleteCard,
  update
}