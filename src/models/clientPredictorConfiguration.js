const mongoose = require('mongoose');

const clientPredictorConfigurationSchema = new mongoose.Schema({
  clientId: {
    //type: mongoose.Schema.Types.ObjectId,
    //ref: 'Client', // Reference to the 'Client' collection
    type: String,
    required: true,
  },
  loanTypeId: {
    //type: mongoose.Schema.Types.ObjectId,
    //ref: 'LoanType', // Reference to the 'LoanType' collection
    type: String,
    required: true,
  },
  config: [
    {
      predictorType: String, // Name of the predictor
      predictorValue: Number, // Threshold value for the predictor
    },
  ],
});

// Create a static method to find a clientPredictorConfiguration by loanTypeId and clientId
clientPredictorConfigurationSchema.statics.findByLoanTypeAndClient = async function (
  loanTypeId,
  clientId
) {
  return this.findOne({ loanTypeId, clientId });
};

// Create a static method to fetch all clientPredictorConfigurations
clientPredictorConfigurationSchema.statics.findAllConfigurations = async function () {
    return this.find();
  };  

const ClientPredictorConfiguration = mongoose.model(
  'ClientPredictorConfiguration',
  clientPredictorConfigurationSchema
);

module.exports = ClientPredictorConfiguration;
