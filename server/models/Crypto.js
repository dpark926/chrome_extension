const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CryptoSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Crypto = mongoose.model("crypto", CryptoSchema);
