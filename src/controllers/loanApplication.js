// controllers/loanApplication.js
const LoanApplication = require('../models/loanApplication');
const PivotLoanApplication = require('../models/pivotLoanApplication'); // Create a Mongoose model for the PivotLoanApplication collection
const db = require('../controllers/database-controller');

const createLoanApplication = async (req, res) => {
    try {
      const data = req.body;
      
      // Create a new loan application
      const newLoanApplication = await db.create(LoanApplication, data);
  
      // Create PivotLoanApplication records for each field in the loan application
      const pivotRecords = [];
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          pivotRecords.push({
            transactionId: newLoanApplication._id,
            variableType: key,
            variableValue: data[key],
          });
        }
      }
      
    // Save the PivotLoanApplication records
    await db.createMany(PivotLoanApplication, pivotRecords);

    res.status(201).json({ newLoanApplication });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
    createLoanApplication,
};

