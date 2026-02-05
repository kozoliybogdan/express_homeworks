const Article = require('../models/Article')

function mapArticle(doc) {
  return {
    id: String(doc._id),
    title: doc.title,
    description: doc.description
  }
}

async function getArticles(req, res, next) {
  try {
    const docs = await Article.find().sort({ createdAt: -1 }).lean()
    const articles = docs.map(mapArticle)

    res.render('articles/articles.ejs', {
      title: 'Articles (MongoDB)',
      theme: res.locals.theme,
      articles
    })
  } catch (err) {
    next(err)
  }
}

function postArticles(req, res) {
  res.type('text').send('Post articles route')
}

async function getArticleById(req, res, next) {
  try {
    const { articleId } = req.params
    const doc = await Article.findById(articleId).lean()

    res.render('articles/article.ejs', {
      title: 'Article details (MongoDB)',
      theme: res.locals.theme,
      articleId: String(articleId),
      article: doc ? mapArticle(doc) : null
    })
  } catch (err) {
    // if invalid ObjectId or other error -> show not found page instead of 500
    if (err.name === 'CastError') {
      res.render('articles/article.ejs', {
        title: 'Article details (MongoDB)',
        theme: res.locals.theme,
        articleId: String(req.params.articleId),
        article: null
      })
      return
    }
    next(err)
  }
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
