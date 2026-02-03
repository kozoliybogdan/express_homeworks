const router = require('express').Router()
const {
    getUsers,
    postUsers,
    getUserById,
    putUserById,
    deleteUserById
} = require('../controllers/users.controller')

router.get('/', getUsers)
router.post('/', postUsers)

router.get('/:userId', getUserById)
router.put('/:userId', putUserById)
router.delete('/:userId', deleteUserById)

module.exports = router