const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // Add other fields as needed
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
