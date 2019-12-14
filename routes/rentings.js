const express = require("express");
const router = express.Router();
const data = require("../data");
const rentings = data.rentings;

router.get("/:renterId", async (req, res) => {
  try {
    let data = await rentings.getUserRentings(req.params.renterId);
    if (data) res.status(200).json(data);
  } catch (e) {
    console.log(e);
    res.status(400).send("An error occurred!");
  }
});

module.exports = router;
