import jwt from 'jsonwebtoken'

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, { algorithm: 'HS256', expiresIn: '1d' })
}