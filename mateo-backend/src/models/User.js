const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    objective: { type: String, default: '' },
    role: { type: String, enum: ['client', 'admin'], default: 'client' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
