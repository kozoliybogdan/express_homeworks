const router = require('express').Router()
const passport = require('passport')

const requireAuth = require('../middlewares/requireAuth')
const { register, loginOk, loginFail, logout, protectedRoute, authInfo } = require('../controllers/auth.controller')

router.get('/', authInfo)

router.post('/register', register)

router.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/auth/login-fail' }),
  loginOk
)

router.get('/login-fail', loginFail)

router.post('/logout', logout)

// залишаємо для сумісності, але основний захист тепер /protected
router.get('/protected', requireAuth, protectedRoute)

module.exports = router
