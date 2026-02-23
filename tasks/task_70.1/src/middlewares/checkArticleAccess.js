module.exports = function checkArticleAccess(req, res, next) {
    const role = req.headers['x-role']

    if (role !== 'admin') {
        return res.status(403).type('text').send('Access denied. Not enough permissions.')
    }

    next()
}