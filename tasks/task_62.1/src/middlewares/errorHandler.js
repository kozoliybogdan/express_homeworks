module.exports = function errorHandler(err, req, res, next) {
    console.error('Server error:', err)

    res.status(500).type('text').send('Server error')
}