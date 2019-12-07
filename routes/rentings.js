const express = require("express");
const router = express.Router();
const data = require("../data");
const rentings = data.rentings;

router.get("/", async (req, res) => {
  try {
    const allrentings = await rentings.getAllRentings();
    if(allrentings.length === 0) { res.status(200).send("No Rentings to display")}
    else {res.json(allrentings);}
    }
    catch (e) {res.status(404).json({ error: e });}
});

router.get("/:id", async (req, res) => {
  try {
    const list = await rentings.getRentingById(req.params.id);
    res.json(list);
  }
  catch (e) {res.status(404).json({ error: e });}
});

router.post("/:id", async (req, res) => {
  const rentingData = req.body;
  try {
    const {locationName, details, startTime, endTime} = rentingData;
    const newRenting = await rentings.addRenting(req.params.id, locationName, details, startTime, endTime);
    res.json(newRenting);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.delete("/:rentingId", async (req, res) => {
  // try {
  //   await rentings.getrentingById(req.params.id);
  // } catch (e) {
  //   res.status(404).json({ error: "renting not found" });
  // }
  try {
    const deletedRenting = await rentings.removeRenting(req.params.rentingId);
    res.json(deletedRenting);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;