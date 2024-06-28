import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'
// import ApiError from '~/utils/ApiError'

const createNew = async(req, res, next) => {
  try {
    const userInfo = { ...req.jwtDecoded }
    // Navigate to service layer
    const result = await columnService.createNew(req.body, userInfo)

    // có kết quả thì trả về phái client
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const userInfo = { ...req.jwtDecoded }
    const columnId = req.params.id

    const updatedColumn = await columnService.update(columnId, req.body, userInfo)
    res.status(StatusCodes.OK).json(updatedColumn)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //   errors: error.message
    // })
  }
}

const deleteCol = async (req, res, next) => {
  try {
    const columnId = req.params.id

    const userInfo = { ...req.jwtDecoded }

    const result = await columnService.deleteCol(columnId, userInfo)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //   errors: error.message
    // })
  }
}

export const columnController = {
  createNew,
  update,
  deleteCol
}
