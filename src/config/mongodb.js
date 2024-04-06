import { env } from './environment'

// const MONGODB_URI = 'mongodb+srv://thanghoang:oE0SCVIS4lV22PQa@cluster0-thanghoang.lvhvqak.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0-ThangHoang'

// const DB_NAME = 'trello-mern-stack'

import { MongoClient, ServerApiVersion } from 'mongodb'

let trelloDBInstance = null

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect()

  trelloDBInstance = mongoClientInstance.db(env.DB_NAME)
}

export const GET_DB = () => {
  if (!trelloDBInstance) throw new Error('Must connect to DB first')
  return trelloDBInstance
}

export const CLOSE_DB = async () => {
  console.log('code chay vao CLOSE_DB')
  await mongoClientInstance.close()
}