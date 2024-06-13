/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import { CONNECT_DB } from './config/mongodb'
import { CLOSE_DB } from './config/mongodb'
import { env } from './config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'

const exitHook = require('async-exit-hook')
const START_SERVER = () => {
  const app = express()
  // CORS
  app.use(cors(corsOptions))
  // Enable req.body json data
  app.use(express.json())

  // Use APIs v1
  app.use('/v1', APIs_V1)

  // Middleware error handling
  app.use(errorHandlingMiddleware)

  if (env.BUILD_MODE === 'production') {
    // MÔI TRƯỜNG PRODUCTION
    app.listen(process.env.PORT, () => {
      console.log(`Hi ${env.AUTHOR}, server running in ${ env.BUILD_MODE } mode at port ${ process.env.PORT }`)
    })
    exitHook(() => { // windows ko duoc, mac duoc (windows ko bat duoc kieu thoat Ctrl+C)
      // console.log(`Exiting with signal: ${signal}`)
      console.log('Disconnecting from MongoDB Cloud Atlas')
      CLOSE_DB()
      console.log('Disconnected from MongoDB Cloud Atlas')
    })
  } else {
    // MÔI TRƯỜNG LOCAL DEV
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(`Hi ${env.AUTHOR}, server running in ${ env.BUILD_MODE } mode at http://${ env.LOCAL_DEV_APP_HOST }:${ env.LOCAL_DEV_APP_PORT }/`)
    })
    exitHook(() => { // windows ko duoc, mac duoc (windows ko bat duoc kieu thoat Ctrl+C)
      // console.log(`Exiting with signal: ${signal}`)
      console.log('Disconnecting from MongoDB Cloud Atlas')
      CLOSE_DB()
      console.log('Disconnected from MongoDB Cloud Atlas')
    })
  }
}
// Chỉ khi kết nối đến db thành công mới start con server lên
CONNECT_DB()
  .then(() => console.log('Connected to MongoDB'))
  .then(() => START_SERVER())
  .catch(error => {
    console.error(error)
    process.exit()
  })

// Viết theo kiểu IIFE
// (async () => {
//   try {
//     await CONNECT_DB()
//     console.log('Connected to MongoDB')
//     START_SERVER()
//   } catch (error) {
//     console.error(error)
//     process.exit
//   }
// })()

// new feature