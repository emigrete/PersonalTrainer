const mongoose = require('mongoose')

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB Atlas conectado')
  } catch (err) {
    console.error('❌ Error al conectar MongoDB:', err.message)
    process.exit(1)
  }
}

module.exports = connectDB
