const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
const tasks = require("./routes/api/tasks");
const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_DEV !== "production"; //true false
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler(); //part of next config
const mongoose = require("mongoose");

const db = mongoose.connect(
  "mongodb://dpark926:learnc0de@ds145574.mlab.com:45574/chrome_extension"
);

nextApp.prepare().then(() => {
  // express code here
  // express code here
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/api/tasks", tasks);
  app.get("*", (req, res) => {
    return handle(req, res); // for all the react stuff
  });
  app.listen(PORT, err => {
    if (err) throw err;
    console.log(`ready at http://localhost:${PORT}`);
  });
});
