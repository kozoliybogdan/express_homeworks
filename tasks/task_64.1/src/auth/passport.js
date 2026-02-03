const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const crypto = require('crypto')

// Просте in-memory "сховище" користувачів (для навчального завдання)
const users = []

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
}

function findByEmail(email) {
  return users.find((u) => u.email === email) || null
}

function findById(id) {
  return users.find((u) => u.id === id) || null
}

function createUser(email, password) {
  const normalized = String(email).toLowerCase().trim()
  if (!normalized) return null
  if (findByEmail(normalized)) return null

  const salt = crypto.randomBytes(16).toString('hex')
  const passwordHash = hashPassword(String(password), salt)

  const user = { id: String(Date.now()), email: normalized, salt, passwordHash }
  users.push(user)
  return user
}

function verifyPassword(user, password) {
  const computed = hashPassword(String(password), user.salt)
  return computed === user.passwordHash
}

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    (email, password, done) => {
      try {
        const user = findByEmail(String(email).toLowerCase().trim())
        if (!user) return done(null, false)

        if (!verifyPassword(user, password)) return done(null, false)

        return done(null, user)
      } catch (err) {
        return done(err)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  done(null, findById(id))
})

module.exports = { users, createUser }
