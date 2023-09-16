// models/predictor.js
const mongoose = require('mongoose');

const predictorSchema = new mongoose.Schema({
  transactionId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming transactionId is an ObjectId
    ref: 'LoanApplication', // Reference to the LoanApplication model
  },
  predictorName: String,
  predictorValue: Number,
});

module.exports = mongoose.model('Predictor', predictorSchema);
