function getRoot(req, res) {
    res.type('text').send('Get root route')
}

module.exports = { getRoot }