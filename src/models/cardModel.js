import Joi from 'joi'

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).message('Your string fails to match the Object Id pattern!'),
  columnId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/).message('Your string fails to match the Object Id pattern!'),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA
}