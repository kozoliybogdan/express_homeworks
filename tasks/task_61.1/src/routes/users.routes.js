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

router.use(basicAuth)

router.get('/', getUsers)
router.post('/', validateUserBody, postUsers)

router.get('/:userId', validateIdParam('userId'), getUserById)
router.put('/:userId', validateIdParam('userId'), validateUserBody, putUserById)
router.delete('/:userId', validateIdParam('userId'), deleteUserById)

module.exports = router