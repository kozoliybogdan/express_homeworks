module.exports = function validateUserBody(req, res, next) {
    const { email, password } = req.body || {}

    if (!email || !password) {
        return res.status(400).type('text').send('Missing required fields: email and password')
    }

    next()
}