const express = require("express");
const router = express.Router();
const data = require("../data");
const rentings = data.rentings;

router.get("/", async (req, res) => {
  try {
    const allrentings = await rentings.getAllRentings();
    if (allrentings.length === 0) {
      res.status(200).send("No Rentings to display");
    } else {
      res.json(allrentings);
    }
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const list = await rentings.getRentingById(req.params.id);
    res.json(list);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.post("/:userid/:listingid", async (req, res) => {
  const user_id = req.params.userid;
  const listing_id = req.params.listingid;
  try {
    const newRenting = await rentings.addRenting(listing_id,user_id);
    res.json(newRenting);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

//Add EndDate When User clicks "End Reservation"
router.patch("/:rentingid", async (req, res) => {
  const renting_id = req.params.rentingid;
  try {
    const updatedRenting = await rentings.updateRenting(renting_id);
    res.json(updatedRenting);
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
