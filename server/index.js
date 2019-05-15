require("dotenv").config();
const express = require("express");
const next = require("next");
const cors = require("cors");
const bodyParser = require("body-parser");
const tasks = require("./routes/api/tasks");
const dailyGoals = require("./routes/api/dailyGoals");
const PORT = process.env.PORT || 3001;
const dev = process.env.NODE_DEV !== "production"; //true false
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler(); //part of next config
const mongoose = require("mongoose");

nextApp.prepare().then(() => {
  const app = express();
  const db = mongoose
    .connect(
      process.env.mongoURI,
      { useNewUrlParser: true }
    )
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/api/tasks", tasks);
  app.use("/api/dailyGoals", dailyGoals);
  app.get("*", (req, res) => {
    return handle(req, res); // for all the react stuff
  });
  app.listen(PORT, err => {
    if (err) throw err;
    console.log(`ready at http://localhost:${PORT}`);
  });
});
