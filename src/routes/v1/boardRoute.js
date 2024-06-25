import express from 'express'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()
Router.route('/')
  .get(authMiddleware.isAuthorized, boardController.getListBoards)
  .post(boardValidation.createNew, boardController.createNew)

Router.route('/:id')
  .get(boardValidation.getDetails, boardController.getDetails)
  .put(boardValidation.update, boardController.update)

Router.route('/supports/moving_card')
  .put(boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

export const boardRoute = Router