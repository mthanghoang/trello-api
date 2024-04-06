/* eslint-disable no-console */
import express from 'express'
import { CONNECT_DB, GET_DB } from './config/mongodb'
import { CLOSE_DB } from './config/mongodb'

const exitHook = require('async-exit-hook')
const START_SERVER = () => {
  const app = express()

  const hostname = 'localhost'
  const port = 8017

  app.get('/', async (req, res) => {
    console.log(await GET_DB().listCollections().toArray())
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(port, hostname, () => {
    console.log(`Server running at http://${ hostname }:${ port }/`)
  })

  exitHook(() => {
    // console.log(`Exiting with signal: ${signal}`)
    console.log('Disconnecting from MongoDB Cloud Atlas')
    CLOSE_DB()
    console.log('Disconnected from MongoDB Cloud Atlas')
  })
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