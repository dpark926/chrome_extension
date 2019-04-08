const express = require("express");
const router = express.Router();

// Task Model
const Task = require("../../models/Task");

// @route   GET api/tasks
// @desc    Get all tasks
// @access  Public
router.get("/", (req, res) => {
  console.log("hey");
  Task.find()
    .sort({ date: -1 })
    .then(tasks => res.json(tasks));
});

// @route   POST api/tasks
// @desc    Create an task
// @access  Public
router.post("/", (req, res) => {
  const newTask = new Task({
    name: req.body.name,
    goalDate: req.body.goalDate
  });

  newTask.save().then(task => res.json(task));
});

// @route   DELETE api/tasks/:id
// @desc    Delete an task
// @access  Public
router.delete("/:id", (req, res) => {
  Task.findById(req.params.id)
    .then(task => task.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
