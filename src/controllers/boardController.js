import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const getListBoards = async(req, res) => {
  const userInfo = { ...req.jwtDecoded }
  const listBoards = await boardService.getListBoards(userInfo)
  res.status(StatusCodes.OK).json(listBoards)
}

const createNew = async(req, res, next) => {
  try {
    const userInfo = { ...req.jwtDecoded }
    // Navigate to service layer
    const result = await boardService.createNew(req.body, userInfo)

    // có kết quả thì trả về phái client
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //   errors: error.message
    // })
  }
}

const getDetails = async(req, res, next) => {
  try {
    const boardId = req.params.id
    const userInfo = { ...req.jwtDecoded }

    const board = await boardService.getDetails(boardId, userInfo)
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //   errors: error.message
    // })
  }
}

const update = async (req, res, next) => {
  try {
    const userInfo = { ...req.jwtDecoded }

    const boardId = req.params.id

    const updatedBoard = await boardService.update(boardId, req.body, userInfo)
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //   errors: error.message
    // })
  }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const userInfo = { ...req.jwtDecoded }

    const result = await boardService.moveCardToDifferentColumn(req.body, userInfo)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //   errors: error.message
    // })
  }
}

export const boardController = {
  getListBoards,
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
}
