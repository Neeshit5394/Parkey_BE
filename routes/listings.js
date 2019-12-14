const express = require("express");
const router = express.Router();
const data = require("../data");
const listings = data.listings;
const userData = data.users;
let i=0;
router.get("/", async (req, res) => {
  try {
    const alllistings = await listings.getAllListings();
    if (alllistings.length === 0) {
      res.status(200).send("No Listings to display");
    } else {
      res.status(200).json(alllistings);
    }
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let data = await listings.getAllListingsForUser(req.params.id);
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e });
  }
});
// Radius Function Implemented
router.get("/:lat/:lng/:radius", async (req, res) => {
  console.log("hit",i++)
  console.log(req.param.lat,req.param)
  try {
    const alllistings = await listings.getAllListingswithRadius(
      req.params.lat,
      req.params.lng,
      req.params.radius
    );
    if (alllistings.length === 0) {
     res.status(200).json(null)
    } else {
      console.log(alllistings)
      res.json(alllistings);
    }
  } catch (e) {
    console.log(e)
    res.status(200).json(null)
  }
});

router.get("/:id", async (req, res) => {
  try {
    const list = await listings.getListingById(req.params.id);
    res.json(list);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

//Adding Listing where id is UserId who is posting listing
router.post("/:id", async (req, res) => {
  const listingData = req.body;
  console.log(listingData);
  try {
    const {
      lat,
      lng,
      locationName,
      details,
      startTime,
      endTime,
      price
    } = listingData;
    const newListing = await listings.addListing(
      req.params.id,
      lat,
      lng,
      locationName,
      details,
      startTime,
      endTime,
      price
    );
    res.status(200).json(newListing);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

//Updating Listing where id is UserId
router.patch("/:listingId", async (req, res) => {
  const renter = req.body;
  try {
    await userData.getUserByID(req.params.id);
    try {
      const updatedListing = await listings.updateListing(
        req.params.listingId,
        reqBody
      );
      res.json(updatedListing);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

//Deleting the listing
router.delete("/:listingId", async (req, res) => {
  // try {
  //   await listings.getlistingById(req.params.id);
  // } catch (e) {
  //   res.status(404).json({ error: "listing not found" });
  // }
  try {
    const deletedListing = await listings.removeListing(req.params.listingId);
    res.send(deletedListing);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;
