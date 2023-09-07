// routes/loanApplication.js
const express = require('express');
const router = express.Router();
const loanApplicationController = require('../controllers/loanApplication');

router.post('/', loanApplicationController.createLoanApplication);

module.exports = router;
