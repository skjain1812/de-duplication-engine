const mongoose = require('mongoose');

const DB_URI = 'mongodb://127.0.0.1:27017/DeDuplicationEngineDB';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

const create = async (model, data) => {
  try {
    const document = await model.create(data);
    return document;
  } catch (error) {
    throw error;
  }
};

const createMany = async (model, dataArray) => {
  try {
    const documents = await model.insertMany(dataArray);
    return documents;
  } catch (error) {
    throw error;
  }
};

const read = async (model, query) => {
  try {
    const documents = await model.find(query);
    return documents;
  } catch (error) {
    throw error;
  }
};

const update = async (model, query, data) => {
  try {
    const updatedDocument = await model.findOneAndUpdate(query, data, {
      new: true,
    });
    return updatedDocument;
  } catch (error) {
    throw error;
  }
};

const remove = async (model, query) => {
  try {
    await model.deleteOne(query);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  connectToDatabase,
  create,
  createMany, // Add createMany function
  read,
  update,
  remove,
};

