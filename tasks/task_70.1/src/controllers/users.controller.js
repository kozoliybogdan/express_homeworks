const crypto = require('crypto')
const User = require('../models/User')

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
}

function mapUser(doc) {
  return {
    id: String(doc._id),
    name: doc.name || '',
    email: doc.email
  }
}

async function getUsers(req, res, next) {
  try {
    const docs = await User.find().sort({ createdAt: -1 }).select('name email').lean()
    const users = docs.map(mapUser)

    res.render('users/users.pug', {
      title: 'Users (MongoDB)',
      theme: res.locals.theme,
      users
    })
  } catch (err) {
    next(err)
  }
}

async function postUsers(req, res, next) {
  try {
    const { name = '', email, password } = req.body || {}

    const normalizedEmail = String(email).toLowerCase().trim()
    const salt = crypto.randomBytes(16).toString('hex')
    const passwordHash = hashPassword(String(password), salt)

    const created = await User.create({ name, email: normalizedEmail, salt, passwordHash })

    res.status(201).json({ ok: true, user: mapUser(created.toObject()) })
  } catch (err) {
    // duplicate email
    if (err?.code === 11000) {
      return res.status(409).json({ ok: false, error: 'User with this email already exists' })
    }
    next(err)
  }
}

async function getUserById(req, res, next) {
  try {
    const { userId } = req.params
    const doc = await User.findById(userId).select('name email').lean()

    res.render('users/user.pug', {
      title: 'User details (MongoDB)',
      theme: res.locals.theme,
      userId: String(userId),
      user: doc ? mapUser(doc) : null
    })
  } catch (err) {
    if (err?.name === 'CastError') {
      return res.status(400).type('text').send('Invalid userId')
    }
    next(err)
  }
}

async function putUserById(req, res, next) {
  try {
    const { userId } = req.params
    const { name = '', email, password } = req.body || {}

    const normalizedEmail = String(email).toLowerCase().trim()
    const salt = crypto.randomBytes(16).toString('hex')
    const passwordHash = hashPassword(String(password), salt)

    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: { name, email: normalizedEmail, salt, passwordHash } },
      { new: true, runValidators: true }
    )
      .select('name email')
      .lean()

    if (!updated) return res.status(404).json({ ok: false, error: 'User not found' })

    res.json({ ok: true, user: mapUser(updated) })
  } catch (err) {
    if (err?.name === 'CastError') {
      return res.status(400).json({ ok: false, error: 'Invalid userId' })
    }
    if (err?.code === 11000) {
      return res.status(409).json({ ok: false, error: 'User with this email already exists' })
    }
    next(err)
  }
}

async function deleteUserById(req, res, next) {
  try {
    const { userId } = req.params
    const result = await User.deleteOne({ _id: userId })
    res.json({ ok: true, deletedCount: result.deletedCount })
  } catch (err) {
    if (err?.name === 'CastError') {
      return res.status(400).json({ ok: false, error: 'Invalid userId' })
    }
    next(err)
  }
}

module.exports = {
  getUsers,
  postUsers,
  getUserById,
  putUserById,
  deleteUserById
}
