const express = require('express')

const indexRoutes = require('./routes/index.routes')
const usersRoutes = require('./routes/users.routes')
const articlesRoutes = require('./routes/articles.routes')

const app = express()

app.use(express.json())

app.use('/', indexRoutes)
app.use('/users', usersRoutes)
app.use('/articles', articlesRoutes)

module.exports = app