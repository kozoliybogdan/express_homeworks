const express = require('express')
const session = require('express-session')

const indexRoutes = require('./routes/index.routes')
const usersRoutes = require('./routes/users.routes')
const articlesRoutes = require('./routes/articles.routes')

const logRequests = require('./middlewares/logRequests')
const notFound = require('./middlewares/notFound')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

app.use(express.json())

app.use(
    session({
        secret: 'dev_secret_key',
        resave: false,
        saveUninitialized: true,
        cookie: { httpOnly: true }
    })
)

app.use(logRequests)

app.use('/', indexRoutes)
app.use('/users', usersRoutes)
app.use('/articles', articlesRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = app