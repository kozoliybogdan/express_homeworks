function getArticles(req, res) {
    res.type('text').send('Get articles route')
}

function postArticles(req, res) {
    res.type('text').send('Post articles route')
}

function getArticleById(req, res) {
    const { articleId } = req.params
    res.type('text').send(`Get article by Id route: ${articleId}`)
}

function putArticleById(req, res) {
    const { articleId } = req.params
    res.type('text').send(`Put article by Id route: ${articleId}`)
}

function deleteArticleById(req, res) {
    const { articleId } = req.params
    res.type('text').send(`Delete article by Id route: ${articleId}`)
}

module.exports = {
    getArticles,
    postArticles,
    getArticleById,
    putArticleById,
    deleteArticleById
}