import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'
// import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()
// Router.use(authMiddleware.isAuthenticated)
Router.route('/')
  .post(cardValidation.createNew, cardController.createNew)

Router.route('/:id')
  .delete(cardValidation.deleteCard, cardController.deleteCard)
  .put(cardValidation.update, cardController.update)
export const cardRoute = Router