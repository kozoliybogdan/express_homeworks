function getRoot(req, res) {
  res.render('home.pug', { title: 'Home' })
}

function getProtected(req, res) {
  res.type('text').send(`Protected route. Hello, ${req.user.email}`)
}

module.exports = { getRoot, getProtected }
