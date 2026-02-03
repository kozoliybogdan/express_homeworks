const express = require('express')
const session = require('express-session')
const path = require('path')
const pug = require('pug')
const ejs = require('ejs')

const indexRoutes = require('./routes/index.routes')
const usersRoutes = require('./routes/users.routes')
const articlesRoutes = require('./routes/articles.routes')

const logRequests = require('./middlewares/logRequests')
const notFound = require('./middlewares/notFound')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(
    session({
        secret: 'dev_secret_key',
        resave: false,
        saveUninitialized: true,
        cookie: { httpOnly: true }
    })
)

app.use(logRequests)

app.use('/styles.css', express.static(path.join(__dirname, '../public/styles.css')))

app.set('views', path.join(__dirname, '../views'))

app.engine('pug', pug.__express)
app.engine('ejs', ejs.__express)

app.set('view engine', 'pug')

app.use('/', indexRoutes)
app.use('/users', usersRoutes)
app.use('/articles', articlesRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = app