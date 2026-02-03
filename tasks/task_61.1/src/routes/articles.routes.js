const router = require('express').Router()

const checkArticleAccess = require('../middlewares/checkArticleAccess')
const validateIdParam = require('../middlewares/validateIdParam')

const {
    getArticles,
    postArticles,
    getArticleById,
    putArticleById,
    deleteArticleById
} = require('../controllers/articles.controller')

router.use(checkArticleAccess)

router.get('/', getArticles)
router.post('/', postArticles)

router.get('/:articleId', validateIdParam('articleId'), getArticleById)
router.put('/:articleId', validateIdParam('articleId'), putArticleById)
router.delete('/:articleId', validateIdParam('articleId'), deleteArticleById)

module.exports = router