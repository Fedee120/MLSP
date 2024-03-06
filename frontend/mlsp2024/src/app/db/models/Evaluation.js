const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
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

module.exports = mongoose.models.Evaluation || mongoose.model('Evaluation', evaluationSchema);
