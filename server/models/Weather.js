const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const WeatherSchema = new Schema({
  zipcode: {
    type: String,
    required: true
  }
});

module.exports = Weather = mongoose.model("weather", WeatherSchema);
