const mongoose = require('mongoose')
const Article = require('../models/Article')

function toObjectId(id) {
  try {
    return new mongoose.Types.ObjectId(String(id))
  } catch {
    return null
  }
}

// POST /api/articles/one  (insertOne)
async function insertOne(req, res, next) {
  try {
    const { title, description } = req.body || {}
    if (!title || !description) {
      return res.status(400).json({ ok: false, error: 'title and description are required' })
    }

    const now = new Date()
    const doc = { title, description, createdAt: now, updatedAt: now }

    const result = await Article.collection.insertOne(doc)
    return res.status(201).json({ ok: true, insertedId: String(result.insertedId), document: { ...doc, _id: String(result.insertedId) } })
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

    const now = new Date()
    const docs = articles.map((a) => ({
      title: a?.title,
      description: a?.description,
      createdAt: now,
      updatedAt: now
    }))

    const invalid = docs.find((d) => !d.title || !d.description)
    if (invalid) {
      return res.status(400).json({ ok: false, error: 'each article must have title and description' })
    }

    const result = await Article.collection.insertMany(docs)
    const insertedIds = Object.values(result.insertedIds).map((id) => String(id))

    return res.status(201).json({ ok: true, insertedCount: result.insertedCount, insertedIds })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/articles/:articleId  (updateOne)
async function updateOne(req, res, next) {
  try {
    const _id = toObjectId(req.params.articleId)
    if (!_id) return res.status(400).json({ ok: false, error: 'Invalid articleId' })

    const { title, description } = req.body || {}
    const $set = {}
    if (typeof title === 'string') $set.title = title
    if (typeof description === 'string') $set.description = description
    $set.updatedAt = new Date()

    if (Object.keys($set).length === 1) {
      return res.status(400).json({ ok: false, error: 'Provide title and/or description to update' })
    }

    const result = await Article.collection.updateOne({ _id }, { $set })

    return res.json({
      ok: true,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    })
  } catch (err) {
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

    const $set = { ...update, updatedAt: new Date() }
    const result = await Article.collection.updateMany(filter, { $set })

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
    const _id = toObjectId(req.params.articleId)
    if (!_id) return res.status(400).json({ ok: false, error: 'Invalid articleId' })

    const { title, description } = req.body || {}
    if (!title || !description) {
      return res.status(400).json({ ok: false, error: 'title and description are required' })
    }

    const now = new Date()
    const replacement = { title, description, createdAt: now, updatedAt: now }

    const result = await Article.collection.replaceOne({ _id }, replacement)
    return res.json({
      ok: true,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      replacement: { ...replacement, _id: String(_id) }
    })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/articles/:articleId  (deleteOne)
async function deleteOne(req, res, next) {
  try {
    const _id = toObjectId(req.params.articleId)
    if (!_id) return res.status(400).json({ ok: false, error: 'Invalid articleId' })

    const result = await Article.collection.deleteOne({ _id })
    return res.json({ ok: true, deletedCount: result.deletedCount })
  } catch (err) {
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

    const result = await Article.collection.deleteMany(filter)
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

    // projection
    const projection = {}
    if (fields) {
      fields.split(',').map((s) => s.trim()).filter(Boolean).forEach((f) => (projection[f] = 1))
    } else {
      projection.title = 1
      projection.description = 1
      projection.createdAt = 1
    }
    if (!withId) projection._id = 0

    const cursor = Article.collection.find(filter, { projection }).sort({ createdAt: -1 }).limit(limit)
    const docs = await cursor.toArray()

    // normalize _id to string if present
    const normalized = docs.map((d) => (d._id ? { ...d, _id: String(d._id) } : d))

    return res.json({ ok: true, count: normalized.length, items: normalized, filter, projection })
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
  find
}
