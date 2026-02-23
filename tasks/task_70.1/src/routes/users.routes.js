const router = require('express').Router()

const basicAuth = require('../middlewares/basicAuth')
const validateUserBody = require('../middlewares/validateUserBody')
const validateIdParam = require('../middlewares/validateIdParam')

const {
  getUsers,
  postUsers,
  getUserById,
  putUserById,
  deleteUserById
} = require('../controllers/users.controller')

router.get('/', getUsers)
router.get('/:userId', validateIdParam('userId'), getUserById)

router.post('/', basicAuth, validateUserBody, postUsers)
router.put('/:userId', basicAuth, validateIdParam('userId'), validateUserBody, putUserById)
router.delete('/:userId', basicAuth, validateIdParam('userId'), deleteUserById)

module.exports = router