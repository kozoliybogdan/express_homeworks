require('dotenv').config()

const connectDB = require('./config/db')
const Article = require('./models/Article');

; (async () => {
  try {
    await connectDB()

    await Article.deleteMany({})
    await Article.insertMany([
      { title: 'First article', description: 'Short introduction to the project (seeded to MongoDB).' },
      { title: 'Middleware basics', description: 'How middlewares work in Express.' },
      { title: 'Templates', description: 'Using PUG and EJS for rendering pages.' }
    ])

    console.log('✅ Seed completed')
    process.exit(0)
  } catch (err) {
    console.error('Seed failed:', err)
    process.exit(1)
  }
})()