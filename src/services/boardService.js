/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'

const getListBoards = async (userInfo) => {
  try {
    const listBoards = await boardModel.getListBoards(userInfo)
    return listBoards
  } catch (error) { throw error }
}

const createNew = async (reqBody, userInfo) => {
  try {
    const data = {
      ...reqBody,
      owner: userInfo.username,
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

const getDetails = async (boardId, userInfo) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }
    if (board.owner !== userInfo.username) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'User is unauthorized')
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

const update = async (boardId, reqBody, userInfo) => {
  try {
    const board = await boardModel.findOneById(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    if (board.owner !== userInfo.username) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'User is unauthorized')
    }

    const dataToUpdate = {
      ...reqBody,
      updatedAt: Date.now()
    }

    if (reqBody.title) {
      dataToUpdate.slug = slugify(reqBody.title)
    }

    const updatedBoard = await boardModel.update(boardId, dataToUpdate)

    return updatedBoard
  } catch (error) { throw error }
}

const moveCardToDifferentColumn = async (reqBody, userInfo) => {
  try {
    /**
     * B1: Check if the user is authorized to modify the board (the owner of the board)
     * B2: Update cardOrderIds array of active column
     * B3: Update cardOrderIds array of over column
     * B4: Update columnId field of active (dragged) card
     * B5: Update updatedAt field of board
     */

    //B1
    // const boardId = (await columnModel.findOneById(reqBody.activeColumnId)).boardId
    // const board = await boardModel.findOneById(boardId)
    // if (board.owner !== userInfo.username) {
    //   throw new ApiError(StatusCodes.FORBIDDEN, 'User is unauthorized')
    // }
    const movedColumn = await columnModel.findOneById(reqBody.activeColumnId)
    if (movedColumn.owner !== userInfo.username) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'User is unauthorized')
    }
    //B2
    columnModel.update(reqBody.activeColumnId, {
      cardOrderIds: reqBody.activeCardOrderIds,
      updatedAt: Date.now()
    })
    //B3
    columnModel.update(reqBody.overColumnId, {
      cardOrderIds: reqBody.overCardOrderIds,
      updatedAt: Date.now()
    })
    //B4:
    cardModel.update(reqBody.activeCardId, {
      columnId: reqBody.overColumnId,
      updatedAt: Date.now()
    })
    //B5:
    boardModel.update(
      reqBody.boardId,
      { updatedAt: Date.now() }
    )

    return { result: 'Success' }
  } catch (error) { throw error }
}

export const boardService = {
  getListBoards,
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
}