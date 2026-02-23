const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    name: { type: String, trim: true, maxlength: 120, default: '' },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    // For LocalStrategy auth
    salt: { type: String, required: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
)

// Indexes
userSchema.index({ email: 1 }, { unique: true })

module.exports = model('User', userSchema)
