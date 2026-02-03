module.exports = function validateIdParam(paramName) {
    return (req, res, next) => {
        const value = req.params?.[paramName]

        if (!value || String(value).trim().length === 0) {
            return res.status(400).type('text').send(`Invalid ${paramName}`)
        }

        next()
    }
}