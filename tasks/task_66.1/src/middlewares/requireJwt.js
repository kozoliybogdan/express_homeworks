const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'

function requireJwt(req, res, next) {
  const token = req.cookies?.token

  if (!token) {
    return res.status(401).type('text').send('Unauthorized: token missing')
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (error) {
    return res.status(401).type('text').send('Unauthorized: invalid token')
  }
}

module.exports = requireJwt
