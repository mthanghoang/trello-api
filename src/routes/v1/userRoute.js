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

// logout
Router.route('/logout')
  .delete(userController.logoutUser)
export const userRoute = Router

// refresh token
Router.route('/refresh-token')
  .put(userController.refreshToken)