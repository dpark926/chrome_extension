const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const DailyGoalSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = DailyGoal = mongoose.model("dailyGoal", DailyGoalSchema);
