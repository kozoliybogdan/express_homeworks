const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const crypto = require('crypto')
const User = require('../models/User')

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
}

async function findByEmail(email) {
  const normalized = String(email).toLowerCase().trim()
  if (!normalized) return null
  return User.findOne({ email: normalized }).lean()
}

async function findById(id) {
  if (!id) return null
  return User.findById(String(id)).lean()
}

async function createUser(email, password) {
  const normalized = String(email).toLowerCase().trim()
  if (!normalized) return null

  const existing = await User.findOne({ email: normalized }).select('_id').lean()
  if (existing) return null

  const salt = crypto.randomBytes(16).toString('hex')
  const passwordHash = hashPassword(String(password), salt)

  const created = await User.create({ email: normalized, salt, passwordHash })
  return created.toObject()
}

function verifyPassword(user, password) {
  const computed = hashPassword(String(password), user.salt)
  return computed === user.passwordHash
}

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await findByEmail(email)
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
  done(null, String(user._id || user.id))
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findById(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

module.exports = { createUser }