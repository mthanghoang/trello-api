import express from 'express'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()
// login
Router.route('/login')
  .post(userValidation.loginUser, userController.loginUser)

// signup
Router.route('/signup')
  .post(userValidation.signupUser, userController.signupUser)

export const userRoute = Router