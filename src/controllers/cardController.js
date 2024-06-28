import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'
// import ApiError from '~/utils/ApiError'

const createNew = async(req, res, next) => {
  try {
    const userInfo = { ...req.jwtDecoded }
    // Navigate to service layer
    const result = await cardService.createNew(req.body, userInfo)

    // có kết quả thì trả về phái client
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteCard = async (req, res, next) => {
  try {
    const cardId = req.params.id

    const userInfo = { ...req.jwtDecoded }

    const result = await cardService.deleteCard(cardId, userInfo)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //   errors: error.message
    // })
  }
}

const update = async (req, res, next) => {
  try {
    const cardId = req.params.id

    const userInfo = { ...req.jwtDecoded }

    const updatedCard = await cardService.update(cardId, req.body, userInfo)
    res.status(StatusCodes.OK).json(updatedCard)
  } catch (error) {
    next(error)
  }
}

export const cardController = {
  createNew,
  deleteCard,
  update
}
