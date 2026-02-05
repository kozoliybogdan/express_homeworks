const { Schema, model } = require('mongoose')

const articleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' }
  },
  { timestamps: true }
)

module.exports = model('Article', articleSchema)