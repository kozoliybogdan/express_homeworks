const Article = require('../models/Article')

// POST /api/articles/one  (insertOne)
async function insertOne(req, res, next) {
  try {
    const { title, description } = req.body || {}
    if (!title || !description) {
      return res.status(400).json({ ok: false, error: 'title and description are required' })
    }

    const created = await Article.create({ title, description })
    return res.status(201).json({ ok: true, insertedId: String(created._id), document: { ...created.toObject(), _id: String(created._id) } })
  } catch (err) {
    next(err)
  }
}

// POST /api/articles/many  (insertMany)
async function insertMany(req, res, next) {
  try {
    const { articles } = req.body || {}
    if (!Array.isArray(articles) || articles.length === 0) {
      return res.status(400).json({ ok: false, error: 'articles must be a non-empty array' })
    }

    const docs = articles.map((a) => ({
      title: a?.title,
      description: a?.description
    }))

    const invalid = docs.find((d) => !d.title || !d.description)
    if (invalid) {
      return res.status(400).json({ ok: false, error: 'each article must have title and description' })
    }

    const created = await Article.insertMany(docs)
    const insertedIds = created.map((d) => String(d._id))

    return res.status(201).json({ ok: true, insertedCount: insertedIds.length, insertedIds })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/articles/:articleId  (updateOne)
async function updateOne(req, res, next) {
  try {
    const { articleId } = req.params

    const { title, description } = req.body || {}
    const $set = {}
    if (typeof title === 'string') $set.title = title
    if (typeof description === 'string') $set.description = description
    $set.updatedAt = new Date()

    if (Object.keys($set).length === 1) {
      return res.status(400).json({ ok: false, error: 'Provide title and/or description to update' })
    }

    const result = await Article.updateOne({ _id: articleId }, { $set }, { runValidators: true })

    return res.json({
      ok: true,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    })
  } catch (err) {
    if (err?.name === 'CastError') {
      return res.status(400).json({ ok: false, error: 'Invalid articleId' })
    }
    next(err)
  }
}

// PATCH /api/articles  (updateMany)
async function updateMany(req, res, next) {
  try {
    const { filter, update } = req.body || {}

    if (!filter || typeof filter !== 'object') {
      return res.status(400).json({ ok: false, error: 'filter object is required' })
    }
    if (!update || typeof update !== 'object') {
      return res.status(400).json({ ok: false, error: 'update object is required' })
    }

    const $set = { ...update }
    const result = await Article.updateMany(filter, { $set }, { runValidators: true })

    return res.json({
      ok: true,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    })
  } catch (err) {
    next(err)
  }
}

// PUT /api/articles/:articleId  (replaceOne)
async function replaceOne(req, res, next) {
  try {
    const { articleId } = req.params

    const { title, description } = req.body || {}
    if (!title || !description) {
      return res.status(400).json({ ok: false, error: 'title and description are required' })
    }

    const existing = await Article.findById(articleId).select('createdAt').lean()
    if (!existing) return res.status(404).json({ ok: false, error: 'Article not found' })

    const replacement = { title, description, createdAt: existing.createdAt }

    const result = await Article.replaceOne({ _id: articleId }, replacement, { runValidators: true })

    return res.json({
      ok: true,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      replacement: { ...replacement, _id: String(articleId) }
    })
  } catch (err) {
    if (err?.name === 'CastError') {
      return res.status(400).json({ ok: false, error: 'Invalid articleId' })
    }
    next(err)
  }
}

// DELETE /api/articles/:articleId  (deleteOne)
async function deleteOne(req, res, next) {
  try {
    const { articleId } = req.params
    const result = await Article.deleteOne({ _id: articleId })
    return res.json({ ok: true, deletedCount: result.deletedCount })
  } catch (err) {
    if (err?.name === 'CastError') {
      return res.status(400).json({ ok: false, error: 'Invalid articleId' })
    }
    next(err)
  }
}

// DELETE /api/articles  (deleteMany)
async function deleteMany(req, res, next) {
  try {
    const { filter } = req.body || {}
    if (!filter || typeof filter !== 'object') {
      return res.status(400).json({ ok: false, error: 'filter object is required' })
    }

    const result = await Article.deleteMany(filter)
    return res.json({ ok: true, deletedCount: result.deletedCount })
  } catch (err) {
    next(err)
  }
}

// GET /api/articles  (find + projection)
async function find(req, res, next) {
  try {
    const q = (req.query?.q || '').toString().trim()
    const limit = Math.min(Number(req.query?.limit || 50), 200)
    const fields = (req.query?.fields || '').toString().trim() // "title,description"
    const withId = (req.query?.withId || 'true').toString() !== 'false'

    const filter = q
      ? {
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ]
      }
      : {}

    // Build select string for Mongoose
    let select = ''
    if (fields) {
      select = fields
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .join(' ')
    } else {
      select = 'title description createdAt'
    }
    if (!withId) select = `${select} -_id`

    const docs = await Article.find(filter)
      .select(select)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    const normalized = docs.map((d) => (d._id ? { ...d, _id: String(d._id) } : d))

    return res.json({ ok: true, count: normalized.length, items: normalized, filter, select })
  } catch (err) {
    next(err)
  }
}


// GET /api/articles/cursor/stream
async function cursorStream(req, res, next) {
  try {
    const q = (req.query?.q || '').toString().trim()
    const limit = Math.min(Number(req.query?.limit || 0), 5000)
    const fields = (req.query?.fields || '').toString().trim()
    const withId = (req.query?.withId || 'true').toString() !== 'false'
    const batchSize = Math.min(Number(req.query?.batchSize || 500), 2000)

    const filter = q
      ? {
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ]
      }
      : {}

    let select = ''
    if (fields) {
      select = fields
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .join(' ')
    } else {
      select = 'title description createdAt'
    }
    if (!withId) select = `${select} -_id`

    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8')
    res.setHeader('X-Content-Type-Options', 'nosniff')

    const query = Article.find(filter).select(select).sort({ createdAt: -1 }).lean()
    if (limit && Number.isFinite(limit) && limit > 0) query.limit(limit)
    const cursor = query.cursor({ batchSize })

    let sent = 0

    let aborted = false
    req.on('close', () => {
      aborted = true
    })

    for await (const doc of cursor) {
      if (aborted) break
      const normalized = doc._id ? { ...doc, _id: String(doc._id) } : doc
      res.write(JSON.stringify(normalized) + '\n')
      sent++
    }

    if (!aborted) res.end()
  } catch (err) {
    next(err)
  }
}

// GET /api/articles/cursor/stats
async function cursorStats(req, res, next) {
  try {
    const q = (req.query?.q || '').toString().trim()

    const filter = q
      ? {
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ]
      }
      : {}

    const cursor = Article.find(filter).select('title description').lean().cursor({ batchSize: 1000 })

    let count = 0
    let titleChars = 0
    let descChars = 0

    for await (const doc of cursor) {
      count++
      if (typeof doc.title === 'string') titleChars += doc.title.length
      if (typeof doc.description === 'string') descChars += doc.description.length
    }

    return res.json({
      ok: true,
      filter,
      stats: {
        count,
        avgTitleLength: count ? Number((titleChars / count).toFixed(2)) : 0,
        avgDescriptionLength: count ? Number((descChars / count).toFixed(2)) : 0
      }
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/articles/aggregate/stats
async function aggregateStats(req, res, next) {
  try {
    const q = (req.query?.q || '').toString().trim()

    const match = q
      ? {
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ]
      }
      : {}

    const pipeline = [
      { $match: match },
      {
        $facet: {
          overall: [
            {
              $project: {
                createdAt: 1,
                titleLen: { $cond: [{ $isArray: '$title' }, 0, { $strLenCP: { $ifNull: ['$title', ''] } }] },
                descLen: { $cond: [{ $isArray: '$description' }, 0, { $strLenCP: { $ifNull: ['$description', ''] } }] }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                avgTitleLen: { $avg: '$titleLen' },
                avgDescLen: { $avg: '$descLen' },
                minCreatedAt: { $min: '$createdAt' },
                maxCreatedAt: { $max: '$createdAt' }
              }
            },
            {
              $project: {
                _id: 0,
                count: 1,
                avgTitleLen: { $round: ['$avgTitleLen', 2] },
                avgDescLen: { $round: ['$avgDescLen', 2] },
                minCreatedAt: 1,
                maxCreatedAt: 1
              }
            }
          ],
          uniqueTitles: [
            { $group: { _id: '$title' } },
            { $count: 'value' }
          ]
        }
      },
      {
        $project: {
          overall: { $ifNull: [{ $arrayElemAt: ['$overall', 0] }, { count: 0, avgTitleLen: 0, avgDescLen: 0 }] },
          uniqueTitles: { $ifNull: [{ $arrayElemAt: ['$uniqueTitles.value', 0] }, 0] }
        }
      }
    ]

    const [result] = await Article.aggregate(pipeline).allowDiskUse(true)

    return res.json({
      ok: true,
      match,
      result
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
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
}