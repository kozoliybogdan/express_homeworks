const router = require('express').Router()
const {
    getArticles,
    postArticles,
    getArticleById,
    putArticleById,
    deleteArticleById
} = require('../controllers/articles.controller')

router.get('/', getArticles)
router.post('/', postArticles)

router.get('/:articleId', getArticleById)
router.put('/:articleId', putArticleById)
router.delete('/:articleId', deleteArticleById)

module.exports = router