const express = require('express')
const session = require('express-session')
const path = require('path')
const pug = require('pug')
const ejs = require('ejs')
const cookieParser = require('cookie-parser')
const passport = require('passport')

require('./auth/passport')

const indexRoutes = require('./routes/index.routes')
const usersRoutes = require('./routes/users.routes')
const articlesRoutes = require('./routes/articles.routes')
const articlesApiRoutes = require('./routes/articles.api.routes')
const themeRoutes = require('./routes/theme.routes')
const authRoutes = require('./routes/auth.routes')

const logRequests = require('./middlewares/logRequests')
const notFound = require('./middlewares/notFound')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000
    }
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(logRequests)

app.use(express.static(path.join(__dirname, '../public')))

app.set('views', path.join(__dirname, '../views'))

app.engine('pug', pug.__express)
app.engine('ejs', ejs.__express)
app.set('view engine', 'pug')

app.use((req, res, next) => {
  res.locals.theme = req.cookies?.theme || 'dark'
  res.locals.user = req.user || null
  next()
})

app.use('/', indexRoutes)
app.use('/users', usersRoutes)
app.use('/articles', articlesRoutes)
app.use('/api/articles', articlesApiRoutes)
app.use('/theme', themeRoutes)
app.use('/auth', authRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = app