// models/pivotLoanApplication.js
const mongoose = require('mongoose');

const pivotLoanApplicationSchema = new mongoose.Schema({
  transactionId: String, // _id of the loan application
  variableType: String, // Key in the LoanApplication entry
  variableValue: String, // Value of the key
});

module.exports = mongoose.model('PivotLoanApplication', pivotLoanApplicationSchema);
