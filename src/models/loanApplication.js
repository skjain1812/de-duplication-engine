// models/loanApplication.js
const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema({
  name: String,
  fatherName: String,
  phoneNumber: String,
  panNumber: String,
  emailId: String,
  dob: Date,
  address: String,
  deviceId: String,
  location: String,
  ipAddress: String,
  mfsId: String,
  dateTimeStamp: Date,
  clientId: String,
  loanTypeId: String
});

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);
