module.exports = function notFound(req, res) {
    res.status(404).type('text').send('Route not found')
}