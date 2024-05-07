/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'

const createNew = async (reqBody) => {
  try {
    const data = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Gọi tới tầng model để xử lý lưu bản ghi newBoard vào DB
    const createdBoard = await boardModel.createNew(data)
    // console.log(createdBoard)

    // Trả về bản ghi mới cho phía client
    const result = await boardModel.findOneById(createdBoard.insertedId)
    return result
  } catch (error) { throw error }
}

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    const result = cloneDeep(board)
    // đưa card về đúng column
    result.columns.forEach(column => {
      // column.cards = result.cards.filter(card => card.columnId.toString() === column._id.toString())
      // MongoDB provides method equals() for comparing objectid
      column.cards = result.cards.filter(card => card.columnId.equals(column._id))
    })
    delete result.cards
    return result
  } catch (error) { throw error }
}

const update = async (boardId, reqBody) => {
  try {
    const dataToUpdate = {
      ...reqBody,
      updatedAt: Date.now()
    }

    const result = await boardModel.update(boardId, dataToUpdate)

    return result
  } catch (error) { throw error }
}

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    /**
     * B1: Update cardOrderIds array of active column
     * B2: Update cardOrderIds array of over column
     * B3: Update columnId field of active (dragged) card
     * B4: Update updatedAt field of board
     */
    //B1
    columnModel.update(reqBody.activeColumnId, {
      cardOrderIds: reqBody.activeCardOrderIds,
      updatedAt: Date.now()
    })
    //B2
    columnModel.update(reqBody.overColumnId, {
      cardOrderIds: reqBody.overCardOrderIds,
      updatedAt: Date.now()
    })
    //B3:
    cardModel.update(reqBody.activeCardId, {
      columnId: reqBody.overColumnId,
      updatedAt: Date.now()
    })
    //B4:
    boardModel.update(
      await cardModel.findOneById(reqBody.activeCardId).boardId,
      { updatedAt: Date.now() }
    )

    return { result: 'Success' }
  } catch (error) { throw error }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
}