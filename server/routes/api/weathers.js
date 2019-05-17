const express = require("express");
const router = express.Router();

// Weather Model
const Weather = require("../../models/Weather");

// @route   GET api/weather
// @desc    Get all weather
// @access  Public
router.get("/", (req, res) => {
  Weather.find()
    .sort({ date: 1 })
    .then(weathers => res.json(weathers));
});

// @route   POST api/weather
// @desc    Create an weather
// @access  Public
router.post("/", (req, res) => {
  const newWeather = new Weather({
    zipcode: req.body.zipcode
  });

  newWeather.save().then(weather => res.json(weather));
});

// @route   UPDATE api/weathers/:id
// @desc    Update an weather
// @access  Public
router.post("/:id", (req, res) => {
  // const found = weathers.some(weather => weather._id === parseInt(req.params.id));

  Weather.findById(req.params.id, (err, zipcode) => {
    if (!zipcode) {
      res.status(404).send("data is not found");
    } else {
      zipcode.zipcode = req.body.zipcode;
      zipcode
        .save()
        .then(zipcode => {
          res.json(zipcode);
        })
        .catch(err => {
          res.status(400).send("Update not possible");
        });
    }
  });

  // Weather.findById(req.params.id)
  //   .then(weather => weather.remove().then(() => res.json({ success: true })))
  //   .catch(err => res.status(404).json({ success: false }));
});

// @route   DELETE api/weathers/:id
// @desc    Delete an weather
// @access  Public
router.delete("/:id", (req, res) => {
  Weather.findById(req.params.id)
    .then(weather => weather.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
