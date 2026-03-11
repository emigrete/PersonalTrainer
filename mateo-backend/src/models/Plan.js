const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sets: { type: Number, default: 3 },
    reps: { type: String, default: '10' }, // '8-12', '30s', 'AMRAP'
    weight: { type: String, default: '' },  // '60kg', 'Corporal', etc.
    notes: { type: String, default: '' },
  },
  { _id: false }
)

const daySchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // 'Lunes', 'Martes', ...
    focus: { type: String, default: '' },   // 'Tren superior', 'Piernas', etc.
    exercises: [exerciseSchema],
  },
  { _id: false }
)

const planSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    days: [daySchema],
    generalNotes: { type: String, default: '' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Plan', planSchema)
