const express = require("express");
const router = express.Router();
const data = require("../data");
const listings = data.listings;
const userData = data.users;
let i = 0;
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

//Radius Function Implemented
router.get("/:lat/:lng/:radius", async (req, res) => {
  try {
    const alllistings = await listings.getAllListingswithRadius(
      req.params.lat,
      req.params.lng,
      req.params.radius
    );
    if (alllistings.length === 0) {
      res.status(200).json(null);
    } else {
      console.log(alllistings);
      res.json(alllistings);
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
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

//Adding a renter to listing by patching rentedBy field
router.patch("/:listingId/:renterId/:rentingStartTime", async (req, res) => {
  const renterId = req.params.renterId;
  const listingId = req.params.listingId;
  const rentingStartTime = req.params.rentingStartTime;
  try {
    let rentedListing = await listings.rentListing(
      listingId,
      renterId,
      rentingStartTime
    );
    if (rentedListing) res.status(200).json(rentedListing);
    else throw new Error("could rent listing out!");
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

//Deleting the listing
router.delete("/:listingId", async (req, res) => {
  try {
    const deletedListing = await listings.removeListing(req.params.listingId);
    res.send(deletedListing);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;
