const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'

function register(req, res) {
  const { username, password } = req.body || {}

  if (!username || !password) {
    return res.status(400).type('text').send('Missing username or password')
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' })

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000
  })

  res.type('text').send('Registered and logged in')
}

function login(req, res) {
  const { username, password } = req.body || {}

  if (!username || !password) {
    return res.status(400).type('text').send('Missing username or password')
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' })

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000
  })

  res.type('text').send('Logged in')
}

function logout(req, res) {
  res.clearCookie('token')
  res.type('text').send('Logged out')
}

function protectedRoute(req, res) {
  res.type('text').send(`Protected route. Hello, ${req.user.username}`)
}

function loginDemo(req, res) {
  res.type('text').send(
    'Demo:\n' +
      'POST /auth/register body: {"username":"test","password":"123"}\n' +
      'POST /auth/login    body: {"username":"test","password":"123"}\n' +
      'POST /auth/logout\n' +
      'GET  /auth/protected (needs token cookie)\n'
  )
}

module.exports = { register, login, logout, protectedRoute, loginDemo }
