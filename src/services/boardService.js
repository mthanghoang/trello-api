/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'

const createNew = async (reqBody) => {
  try {
    const data = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Gọi tới tầng model để xử lý lưu bản ghi newBoard vào DB
    const createdBoard = await boardModel.createNew(data)
    // console.log(createdBoard)

    // Trả về bản ghi mới cho phía client
    const result = await boardModel.findOneById(createdBoard.insertedId)
    return result
  } catch (error) { throw error }
}

export const boardService = {
  createNew
}