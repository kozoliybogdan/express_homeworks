module.exports = function logRequests(req, res, next) {
    const now = new Date().toISOString()

    if (req.session) {
        req.session.requestsCount = (req.session.requestsCount || 0) + 1
    }

    console.log(`${now} - ${req.method} ${req.originalUrl}`)
    next()
}