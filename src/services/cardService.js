/* eslint-disable no-useless-catch */
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

const createNew = async (reqBody) => {
  try {
    const data = {
      ...reqBody
    }

    // Gọi tới tầng model để xử lý lưu bản ghi newcolumn vào DB
    const createdCard = await cardModel.createNew(data)
    // console.log(createdcolumn)

    // Trả về bản ghi mới cho phía client
    const result = await cardModel.findOneById(createdCard.insertedId)

    //xử lí dữ liệu cho chuẩn với FE
    if (result) {
      columnModel.pushCardOrderIds(result)
      columnModel.update(result.columnId, { updatedAt: Date.now() })
      boardModel.update(result.boardId, { updatedAt: Date.now() })
    }
    return result
  } catch (error) { throw error }
}

export const cardService = {
  createNew
}