const mongoose = require('mongoose')

const checkInSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    weight: { type: Number },          // kg
    bodyFat: { type: Number },         // %
    completedWorkouts: { type: Number, default: 0 },
    totalWorkouts: { type: Number, default: 0 },
    clientNotes: { type: String, default: '' },
    coachNotes: { type: String, default: '' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('CheckIn', checkInSchema)
