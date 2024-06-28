import express from 'express'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'

const Router = express.Router()
Router.route('/')
  .get(boardController.getListBoards)
  .post(boardValidation.createNew, boardController.createNew)

Router.route('/:id')
  .get(boardValidation.getDetails, boardController.getDetails)
  .put(boardValidation.update, boardController.update)

Router.route('/:id/moving_card')
  .put(boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

export const boardRoute = Router