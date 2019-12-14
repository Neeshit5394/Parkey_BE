const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const configRoutes = require("./routes");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

app.use(cors());
app.use(bodyParser.json());

configRoutes(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:8080");
});
