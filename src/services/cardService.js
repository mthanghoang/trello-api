/* eslint-disable no-useless-catch */
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) => {
  try {
    const data = {
      ...reqBody
    }

    // Gọi tới tầng model để xử lý lưu bản ghi newcolumn vào DB
    const createdCard = await cardModel.createNew(data)
    // console.log(createdcolumn)

    // Trả về bản ghi mới cho phía client
    const result = await cardModel.findOneById(createdCard.insertedId)

    //xử lí dữ liệu cho chuẩn với FE
    if (result) {
      columnModel.pushCardOrderIds(result)
      columnModel.update(result.columnId, { updatedAt: Date.now() })
      boardModel.update(result.boardId, { updatedAt: Date.now() })
    }
    return result
  } catch (error) { throw error }
}

const deleteCard = async (cardId) => {
  try {
    const cardToDelete = await cardModel.findOneById(cardId)
    if (!cardToDelete) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found')
    }
    // Xóa card
    await cardModel.deleteOneById(cardId)
    // Update cardOrderIds array for column
    await columnModel.pullCardOrderIds(cardToDelete)

    // Update updatedAt field for column and board
    await columnModel.update(cardToDelete.columnId, {
      updatedAt: Date.now()
    })
    await boardModel.update(cardToDelete.boardId, {
      updatedAt: Date.now()
    })

    return { deleteResult: 'Card deleted successfully' }
  } catch (error) { throw error }
}

export const cardService = {
  createNew,
  deleteCard
}