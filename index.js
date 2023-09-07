// index.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const database = require('./src/controllers/database-controller'); // Import the database module

app.use(bodyParser.json());

// Define and use your routes/controllers here (in routes/ and controllers/).
const loanApplicationRoute = require('./src/routes/loanApplication'); // Include the loan application route
app.use('/loan-applications', loanApplicationRoute);

const PORT = process.env.PORT || 3000;

// Connect to the database before starting the server
database.connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });
