module.exports = function basicAuth(req, res, next) {
    const authHeader = req.headers['authorization']

    if (!authHeader) {
        return res.status(401).type('text').send('Access denied. No credentials sent.')
    }

    next()
}