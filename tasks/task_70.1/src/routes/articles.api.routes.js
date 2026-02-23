const router = require('express').Router()

const {
  insertOne,
  insertMany,
  updateOne,
  updateMany,
  replaceOne,
  deleteOne,
  deleteMany,
  find,
  cursorStream,
  cursorStats,
  aggregateStats
} = require('../controllers/articles.api.controller')

// READ (find + projection)
router.get('/', find)

// CURSORS (iterate without loading all docs)
router.get('/cursor/stream', cursorStream)
router.get('/cursor/stats', cursorStats)

// AGGREGATION (statistics)
router.get('/aggregate/stats', aggregateStats)

// CREATE
router.post('/one', insertOne)      // insertOne
router.post('/many', insertMany)    // insertMany

// UPDATE
router.patch('/:articleId', updateOne) // updateOne
router.patch('/', updateMany)          // updateMany
router.put('/:articleId', replaceOne)  // replaceOne

// DELETE
router.delete('/:articleId', deleteOne) // deleteOne
router.delete('/', deleteMany)          // deleteMany

module.exports = router