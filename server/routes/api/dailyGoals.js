const express = require("express");
const router = express.Router();

// DailyGoal Model
const DailyGoal = require("../../models/DailyGoal");

// @route   GET api/dailyGoal
// @desc    Get all dailyGoal
// @access  Public
router.get("/", (req, res) => {
  DailyGoal.find()
    .sort({ date: 1 })
    .then(dailyGoals => res.json(dailyGoals));
});

// @route   POST api/dailyGoal
// @desc    Create an dailyGoal
// @access  Public
router.post("/", (req, res) => {
  const newDailyGoal = new DailyGoal({
    name: req.body.name
  });

  newDailyGoal.save().then(dailyGoal => res.json(dailyGoal));
});

// @route   DELETE api/dailyGoals/:id
// @desc    Delete an dailyGoal
// @access  Public
router.delete("/:id", (req, res) => {
  DailyGoal.findById(req.params.id)
    .then(dailyGoal =>
      dailyGoal.remove().then(() => res.json({ success: true }))
    )
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
