const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const configRoutes = require("./routes");
const dotenv = require("dotenv");
dotenv.config();

app.use(bodyParser.json());

configRoutes(app);

app.listen(8080, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:8080");
});
