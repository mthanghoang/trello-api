import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
// import ApiError from '~/utils/ApiError'

const createNew = async(req, res, next) => {
  try {
    // console.log('request body: ', req.body)

    // throw new ApiError(502)

    // Navigate to service layer
    const result = await boardService.createNew(req.body)

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

    const board = await boardService.getDetails(boardId)
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //   errors: error.message
    // })
  }
}

export const boardController = {
  createNew,
  getDetails
}
