const router = require('express').Router()
const { getRoot } = require('../controllers/index.controller')

router.get('/', getRoot)

module.exports = router