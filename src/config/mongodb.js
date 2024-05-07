import { env } from './environment'
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
  trelloDBInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

export const GET_DB = () => {
  if (!trelloDBInstance) throw new Error('Must connect to DB first')
  return trelloDBInstance
}

export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}