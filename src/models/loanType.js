const mongoose = require('mongoose');

const loanTypeSchema = new mongoose.Schema({
  loanType: {
    type: String,
    required: true,
  },
  // Add other fields as needed
});

const LoanType = mongoose.model('LoanType', loanTypeSchema);

module.exports = LoanType;
