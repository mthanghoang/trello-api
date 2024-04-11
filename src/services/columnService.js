/* eslint-disable no-useless-catch */
import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'

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
      //await
      boardModel.pushColumnOrderIds(result)
      //await
      boardModel.update(result.boardId, { updatedAt: Date.now() })
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
    if (result) {
      boardModel.update(result.boardId, { updatedAt: Date.now() })
    }
    return result
  } catch (error) { throw error }
}

const deleteCol = async (columnId) => {
  try {
    const columnToDelete = await columnModel.findOneById(columnId)
    // Xóa card(s) trong column
    await cardModel.deleteManyByColumnId(columnId)
    // Xóa column
    await columnModel.deleteOneById(columnId)
    // Update columnOrderIds array for board
    await boardModel.removeFromColumnOrderIds(columnToDelete)

    // Update updatedAt field for board
    await boardModel.update(columnToDelete.boardId, {
      updatedAt: Date.now()
    })

    return { deleteResult: 'List deleted successfully' }
  } catch (error) { throw error }
}

export const columnService = {
  createNew,
  update,
  deleteCol
}