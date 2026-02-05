const router = require('express').Router()

const { getRoot, getProtected } = require('../controllers/index.controller')
const requireAuth = require('../middlewares/requireAuth')

router.get('/', getRoot)
router.get('/protected', requireAuth, getProtected)

module.exports = router
