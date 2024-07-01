import jwt from 'jsonwebtoken'

export const generateToken = async (payload, secret, tokenLife) => {
  try {
    return jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: tokenLife })
  } catch (error) {
    throw new Error(error)
  }
}

export const verifyToken = async (token, secret) => {
  try {
    return jwt.verify(token, secret, { algorithms: ['HS256'] })
  } catch (error) {
    throw new Error(error)
  }
}