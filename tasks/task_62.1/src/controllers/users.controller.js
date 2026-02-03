const users = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Alex Brown', email: 'alex@example.com' }
]

function getUsers(req, res) {
  res.render('users/users.pug', {
    title: 'Users',
    users
  })
}

function postUsers(req, res) {
  res.type('text').send('Post users route')
}

function getUserById(req, res) {
  const { userId } = req.params
  const user = users.find(u => u.id === String(userId))

  res.render('users/user.pug', {
    title: 'User details',
    userId: String(userId),
    user: user || null
  })
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
