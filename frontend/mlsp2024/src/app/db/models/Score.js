const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  oracion: {
    type: String,
    required: true,
  },
  palabraCompleja: {
    type: String,
    required: true,
  },
  evaluacion: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Score || mongoose.model('Score', scoreSchema);
