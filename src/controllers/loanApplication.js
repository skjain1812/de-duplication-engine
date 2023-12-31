// controllers/loanApplication.js
const LoanApplication = require('../models/loanApplication');
const PivotLoanApplication = require('../models/pivotLoanApplication');
const Predictor = require('../models/predictor');
const db = require('../controllers/database-controller');
const ClientPredictorConfiguration = require('../models/clientPredictorConfiguration');

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

    // Calculate and save all predictors
    await calculateAndSavePredictors(newLoanApplication, data);

    // Calculate the isFraudApplication based on predictors
    const isFraudApplication = await calculateIsFraudApplication(newLoanApplication._id, newLoanApplication.clientId, newLoanApplication.loanTypeId);

    res.status(201).json({ newLoanApplicationId: newLoanApplication._id, isFraudApplication });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateAndSavePredictors = async (newLoanApplication, data) => {
  try {
    // Calculate and store all predictors
    const emailId = data.emailId;

    // 1. Calculate the number of loan applications with the same email but different phone numbers
    const distinctPhoneNumbersCount = await countDistinct(LoanApplication, {
      emailId: emailId,
      phoneNumber: { $ne: data.phoneNumber }, // Exclude the current application's phone number
    });
    await savePredictor(
      newLoanApplication._id,
      'countDistinctPhoneNumbersLinkedToSameEmailId',
      distinctPhoneNumbersCount
    );

    // 2. Calculate the number of loan applications with the same email but different names
    const distinctNamesCount = await countDistinct(LoanApplication, {
      emailId: emailId,
      name: { $ne: data.name }, // Exclude the current application's name
    });
    await savePredictor(
      newLoanApplication._id,
      'countDistinctNamesLinkedToSameEmailId',
      distinctNamesCount
    );

    // 3. Calculate the number of loan applications with the same email but different father's names
    const distinctFatherNamesCount = await countDistinct(LoanApplication, {
      emailId: emailId,
      fatherName: { $ne: data.fatherName }, // Exclude the current application's father's name
    });
    await savePredictor(
      newLoanApplication._id,
      'countDistinctFathersNamesLinkedToSameEmailId',
      distinctFatherNamesCount
    );

    // 4. Calculate the number of loan applications with the same email but different device IDs
    const distinctDeviceIdsCount = await countDistinct(LoanApplication, {
      emailId: emailId,
      deviceId: { $ne: data.deviceId }, // Exclude the current application's device ID
    });
    await savePredictor(
      newLoanApplication._id,
      'countDistinctDeviceIdsLinkedToSameEmailId',
      distinctDeviceIdsCount
    );

    // 5. Calculate the number of loan applications with the same email but different msf IDs
    const distinctMsfIdsCount = await countDistinct(LoanApplication, {
      emailId: emailId,
      msfId: { $ne: data.msfId }, // Exclude the current application's msf ID
    });
    await savePredictor(
      newLoanApplication._id,
      'countDistinctMsfIdsLinkedToSameEmailId',
      distinctMsfIdsCount
    );

    // 6. Calculate the number of loan applications with the same email but different addresses
    const distinctAddressesCount = await countDistinct(LoanApplication, {
      emailId: emailId,
      address: { $ne: data.address }, // Exclude the current application's address
    });
    await savePredictor(
      newLoanApplication._id,
      'countDistinctAddressesLinkedToSameEmailId',
      distinctAddressesCount
    );

    // 7. Calculate the number of loan applications with the same email but different locations
    const distinctLocationsCount = await countDistinct(LoanApplication, {
      emailId: emailId,
      location: { $ne: data.location }, // Exclude the current application's location
    });
    await savePredictor(
      newLoanApplication._id,
      'countDistinctLocationsLinkedToSameEmailId',
      distinctLocationsCount
    );

    // Repeat the same pattern for other predictors...

  } catch (error) {
    console.error('Error calculating and saving predictors:', error);
  }
};

const countDistinct = async (model, query) => {
  try {
    const distinctValues = await model.distinct('_id', query);
    return distinctValues.length;
  } catch (error) {
    console.error('Error counting distinct values:', error);
    return 0;
  }
};

const savePredictor = async (transactionId, predictorName, predictorValue) => {
  try {
    // Save the predictor in the Predictor collection
    const predictor = new Predictor({
      transactionId: transactionId,
      predictorName: predictorName,
      predictorValue: predictorValue,
    });
    await predictor.save();
  } catch (error) {
    console.error('Error saving predictor:', error);
  }
};

const calculateIsFraudApplication = async (transactionId, clientId, loanTypeId) => {
  try {
    // Fetch all predictors for the given transactionId
    const predictors = await Predictor.find({ transactionId: transactionId });
    // Fetch the client predictor configuration
    const clientPredictorConfig = await ClientPredictorConfiguration.findByLoanTypeAndClient(
      loanTypeId,
      clientId
    );

    // const allConfigurations = await ClientPredictorConfiguration.findAllConfigurations();

    // console.log('allConfigurations : ' + JSON.stringify(allConfigurations));
    // console.log('clientPredictorConfig : ' + JSON.stringify(clientPredictorConfig));
    if (!clientPredictorConfig) {
      //console.log('Absent');
      // No configuration found, assume it's not fraud
      return {
        isFraud: false,
        failedPredictors: [],
      };
    }

    const config = clientPredictorConfig.config;
    const failedPredictors = [];

    for (const configEntry of config) {
      const { predictorType, predictorValue } = configEntry;

      // Find the predictor with the same predictorType
      const matchingPredictor = predictors.find(
        (predictor) => predictor.predictorName === predictorType
      );

      if (matchingPredictor.predictorValue > predictorValue) {
        failedPredictors.push(predictorType);
      }
    }

    const isFraud = failedPredictors.length > 0;

    return {
      isFraud: isFraud,
      failedPredictors: failedPredictors,
    };
  } catch (error) {
    console.error('Error calculating isFraudApplication:', error);
    return {
      isFraud: true, // Assume it's a fraud application on error
      failedPredictors: [],
    };
  }
};

module.exports = {
  createLoanApplication,
};

