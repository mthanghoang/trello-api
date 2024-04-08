import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'
// import ApiError from '~/utils/ApiError'

const createNew = async(req, res, next) => {
  try {
    // Navigate to service layer
    const result = await columnService.createNew(req.body)

    // có kết quả thì trả về phái client
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

export const columnController = {
  createNew
}
