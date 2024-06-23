import jwt from 'jsonwebtoken'

export const generateToken = async (payload, secret, tokenLife) => {
  return jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: tokenLife })
}

export const verifyToken = async (token, secret) => {
  return jwt.verify(token, secret, { algorithms: ['HS256'] })
}