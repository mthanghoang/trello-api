/* eslint-disable no-useless-catch */
import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'

const createNew = async (reqBody) => {
  try {
    const data = {
      ...reqBody
    }

    // Gọi tới tầng model để xử lý lưu bản ghi newcolumn vào DB
    const createdColumn = await columnModel.createNew(data)
    // console.log(createdcolumn)

    // Trả về bản ghi mới cho phía client
    const result = await columnModel.findOneById(createdColumn.insertedId)

    //xử lí dữ liệu cho chuẩn với FE
    if (result) {
      result.cards = []
      await boardModel.pushColumnOrderIds(result)
    }
    return result
  } catch (error) { throw error }
}

const update = async (columnId, reqBody) => {
  try {
    const dataToUpdate = {
      ...reqBody,
      updatedAt: Date.now()
    }

    const result = await columnModel.update(columnId, dataToUpdate)

    return result
  } catch (error) { throw error }
}

export const columnService = {
  createNew,
  update
}