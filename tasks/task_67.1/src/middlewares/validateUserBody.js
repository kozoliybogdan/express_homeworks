module.exports = function validateUserBody(req, res, next) {
    const { name, email } = req.body || {}

    if (!name || !email) {
        return res.status(400).type('text').send('Missing required fields: name and email')
    }

    next()
}