const mongoose = require('mongoose');

const clientPredictorConfigurationSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client', // Reference to the 'Client' collection
    required: true,
  },
  loanTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LoanType', // Reference to the 'LoanType' collection
    required: true,
  },
  config: [
    {
      predictorType: String, // Name of the predictor
      predictorValue: Number, // Threshold value for the predictor
    },
  ],
});

const ClientPredictorConfiguration = mongoose.model(
  'ClientPredictorConfiguration',
  clientPredictorConfigurationSchema
);

module.exports = ClientPredictorConfiguration;
