/* eslint-disable no-useless-catch */
import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
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
    const result = await columnModel.createNew(data)

    // Trả về column mới cho phía client
    const createdColumn = await columnModel.findOneById(result.insertedId)

    //xử lí dữ liệu cho chuẩn với FE
    if (createdColumn) {
      createdColumn.cards = []
      //await
      boardModel.pushColumnOrderIds(createdColumn)
      //await
      boardModel.update(createdColumn.boardId, { updatedAt: Date.now() })
    }
    return createdColumn
  } catch (error) { throw error }
}

const update = async (columnId, reqBody, userInfo) => {
  try {
    const columnToUpdate = await columnModel.findOneById(columnId)
    if (!columnToUpdate) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found')
    }
    // const board = await boardModel.findOneById(columnToUpdate.boardId)
    // if (userInfo.username !== board.owner) {
    //   throw new ApiError(StatusCodes.FORBIDDEN, 'User is unauthorized')
    // }
    if (userInfo.username !== columnToUpdate.owner) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'User is unauthorized')
    }

    const dataToUpdate = {
      ...reqBody,
      updatedAt: Date.now()
    }

    const updatedColumn = await columnModel.update(columnId, dataToUpdate)
    boardModel.update(updatedColumn.boardId, { updatedAt: Date.now() })
    return updatedColumn
  } catch (error) { throw error }
}

const deleteCol = async (columnId, userInfo) => {
  try {
    const columnToDelete = await columnModel.findOneById(columnId)
    if (!columnToDelete) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found')
    }

    // const board = await boardModel.findOneById(columnToDelete.boardId)
    // if (userInfo.username !== board.owner) {
    //   throw new ApiError(StatusCodes.FORBIDDEN, 'User is unauthorized')
    // }
    if (userInfo.username !== columnToDelete.owner) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'User is unauthorized')
    }
    // Xóa card(s) trong column
    cardModel.deleteManyByColumnId(columnId)
    // Xóa column
    columnModel.deleteOneById(columnId)
    // Update columnOrderIds array for board
    boardModel.pullColumnOrderIds(columnToDelete)

    // Update updatedAt field for board
    boardModel.update(columnToDelete.boardId, {
      updatedAt: Date.now()
    })

    return { deleteResult: 'List deleted successfully' }
  } catch (error) { throw error }
}

export const columnService = {
  createNew,
  update,
  deleteCol
}