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

router.get('/', getArticles)
router.get('/:articleId', validateIdParam('articleId'), getArticleById)

router.post('/', checkArticleAccess, postArticles)
router.put('/:articleId', checkArticleAccess, validateIdParam('articleId'), putArticleById)
router.delete('/:articleId', checkArticleAccess, validateIdParam('articleId'), deleteArticleById)

module.exports = router