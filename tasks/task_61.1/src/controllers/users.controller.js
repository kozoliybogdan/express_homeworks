function getUsers(req, res) {
    res.type('text').send('Get users route')
}

function postUsers(req, res) {
    res.type('text').send('Post users route')
}

function getUserById(req, res) {
    const { userId } = req.params
    res.type('text').send(`Get user by Id route: ${userId}`)
}

function putUserById(req, res) {
    const { userId } = req.params
    res.type('text').send(`Put user by Id route: ${userId}`)
}

function deleteUserById(req, res) {
    const { userId } = req.params
    res.type('text').send(`Delete user by Id route: ${userId}`)
}

module.exports = {
    getUsers,
    postUsers,
    getUserById,
    putUserById,
    deleteUserById
}