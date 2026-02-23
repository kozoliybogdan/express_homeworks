require('dotenv').config()

const connectDB = require('./config/db')
const Article = require('./models/Article');
const User = require('./models/User');
const crypto = require('crypto')

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
}

; (async () => {
  try {
    await connectDB()

    await Article.deleteMany({})
    await User.deleteMany({})
    await Article.insertMany([
      { title: 'First article', description: 'Short introduction to the project (seeded to MongoDB).' },
      { title: 'Middleware basics', description: 'How middlewares work in Express.' },
      { title: 'Templates', description: 'Using PUG and EJS for rendering pages.' }
    ])

    const demoUsers = [
      { name: 'John Doe', email: 'john@example.com', password: 'password123' },
      { name: 'Jane Smith', email: 'jane@example.com', password: 'password123' },
      { name: 'Alex Brown', email: 'alex@example.com', password: 'password123' }
    ]

    await User.insertMany(
      demoUsers.map((u) => {
        const salt = crypto.randomBytes(16).toString('hex')
        return {
          name: u.name,
          email: u.email,
          salt,
          passwordHash: hashPassword(u.password, salt)
        }
      })
    )

    console.log('✅ Seed completed')
    process.exit(0)
  } catch (err) {
    console.error('Seed failed:', err)
    process.exit(1)
  }
})()