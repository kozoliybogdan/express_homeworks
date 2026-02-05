const router = require('express').Router()

const { setTheme } = require('../controllers/theme.controller')

router.get('/set', setTheme)

module.exports = router
