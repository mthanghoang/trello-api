import { StatusCodes } from 'http-status-codes'
// import ApiError from '~/utils/ApiError'

const createNew = async(req, res, next) => {
  try {
    // console.log('request body: ', req.body)

    // throw new ApiError(502)

    res.status(StatusCodes.CREATED).json({ message: 'POST from Controller: API create new board' })
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //   errors: error.message
    // })
  }
}

export const boardController = {
  createNew
}
