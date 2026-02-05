const { createUser } = require('../auth/passport')

function register(req, res) {
  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.status(400).type('text').send('Missing email or password')
  }

  const user = createUser(email, password)
  if (!user) {
    return res.status(409).type('text').send('User already exists')
  }

  req.login(user, (err) => {
    if (err) return res.status(500).type('text').send('Server error')
    return res.type('text').send('Registered and logged in')
  })
}

function loginOk(req, res) {
  res.type('text').send('Logged in')
}

function loginFail(req, res) {
  res.status(401).type('text').send('Invalid credentials')
}

function logout(req, res) {
  req.logout(() => {
    res.type('text').send('Logged out')
  })
}

function protectedRoute(req, res) {
  res.type('text').send(`Protected route. Hello, ${req.user.email}`)
}

function authInfo(req, res) {
  res.type('text').send(
    'Auth routes:\n' +
      'POST /auth/register (email, password)\n' +
      'POST /auth/login    (email, password)\n' +
      'POST /auth/logout\n' +
      'GET  /protected (requires session)\n'
  )
}

module.exports = { register, loginOk, loginFail, logout, protectedRoute, authInfo }
