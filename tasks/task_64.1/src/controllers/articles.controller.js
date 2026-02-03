const articles = [
  { id: '1', title: 'First article', description: 'Short introduction to the project.' },
  { id: '2', title: 'Middleware basics', description: 'How middlewares work in Express.' },
  { id: '3', title: 'Templates', description: 'Using PUG and EJS for rendering pages.' }
]

function getArticles(req, res) {
  res.render('articles/articles.ejs', {

    title: 'Articles',
    theme: res.locals.theme,
    articles
  
  })
}

function postArticles(req, res) {
  res.type('text').send('Post articles route')
}

function getArticleById(req, res) {
  const { articleId } = req.params
  const article = articles.find(a => a.id === String(articleId))

  res.render('articles/article.ejs', {

    title: 'Article details',
    theme: res.locals.theme,
    articleId: String(articleId),
    article: article || null
  
  })
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
