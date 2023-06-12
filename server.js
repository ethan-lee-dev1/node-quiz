const express = require("express");
const path = require("path");
const PORT = 8080;
const promisePool = require("./dbConnection.js").promisPool;

const app = express();
// parses JSON from incoming request
app.use(express.json());

// Do not edit
const options = {
  lemon: "yellow",
  lime: "limegreen",
  tangerine: "orange",
  grapefruit: "lightcoral",
};

// #3 helper function 'getColor`
const getColor = (fruit) => {
  return options[fruit];
};
//console.log(getColor("lemon"));

// #1 serve the colors.html page when /colors is visited
// DO NOT USE express.static
app.get("/colors", (req, res) => {
  const ABSOLUTE_PATH = path.join(__dirname, "./client/colors.html");
  res.status(200).sendFile(ABSOLUTE_PATH);
});

// #2 & #4 handle POST requests to /colors
app.post("/colors", (req, res) => {
  try {
    const { fruit } = req.body;
    const result = getColor(fruit);
    result
      ? res.send({ color: result })
      : res.status(404).send("Fruit not found!");
  } catch (error) {
    res.status(404).send("Error!");
  }
});

// #6 serve styles.css - DO NOT use express.static()
app.get("/styles.css", (req, res) => {
  const ABSOLUTE_PATH = path.join(__dirname, "./client/styles.css");
  res.status(200).sendFile(ABSOLUTE_PATH);
});

// #5 Update functionality to database
app.put("/colors/:id/:fruit", async (req, res) => {
  const carId = req.params.id;
  const fruit = req.params.fruit;
  const color = getColor(fruit);
  //console.log(carId, color);
  const [result] = await promisePool.execute(
    "update car set color = ? where car_id = ?",
    [color, carId]
  );
  result
    ? res.send({ "message ": result.info + "Updated Color!" })
    : res.status(404).send("Unable to update!");
});

// #7 unknown routes - 404 handler
// research what route to serve this for
app.get("*", (req, res) => {
  const ABSOLUTE_PATH = path.join(__dirname, "./client/404.html");
  res.status(404).sendFile(ABSOLUTE_PATH);
});

// Global error handling middleware
// You can leave this alone
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 400,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});
