const router = require('express').Router()

const requireJwt = require('../middlewares/requireJwt')
const {
  register,
  login,
  logout,
  protectedRoute,
  loginDemo
} = require('../controllers/auth.controller')

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

router.get('/protected', requireJwt, protectedRoute)
router.get('/login-demo', loginDemo)

module.exports = router
