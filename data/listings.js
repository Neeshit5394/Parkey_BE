const mongoCollections = require("../config/mongoCollection");
const listings = mongoCollections.listings;
const uuid = require("uuid/v4");

//Finding Distance
var distance = require("google-distance");
distance.apiKey = process.env.DISTANCE_API_KEY;

const exportedMethods = {
  async getAllListings() {
    const listingCollection = await listings();
    return await listingCollection.find({}).toArray();
  },

  //Function to get all listing within Radius
  async getAllListingswithRadius(latS, lngS, radius) {
    const listingCollection = await listings();
    r = parseInt(radius);
    alllistArray = await this.getAllListings();
    FinalList = [];
    i = 0;
    while (i < alllistArray.length) {
      var d = 0;
      var latD = alllistArray[i].lat;
      var lngD = alllistArray[i].lon;
      const result = await new Promise(function(resolve, reject) {
        distance.get(
          {
            origin: `${latS},${lngS}`,
            destination: `${latD},${lngD}`,
            mode: "walking",
            units: "imperial"
          },
          function(err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          }
        );
      });
      d = parseInt(result.distance.split(" ")[0]);
      console.log(d);
      console.log(r);
      if (d <= r) {
        FinalList.push(alllistArray[i]);
      }
      i = i + 1;
    }
    return FinalList;
  },
  
  async getListingById(id) {
    const listingCollection = await listings();
    const listing = await listingCollection.findOne({ _id: id });
    if (!listing) throw "Listing not found";
    return listing;
  },

  async getAllListingsForUser(id) {
    const listingCollection = await listings();
    const userListings = await listingCollection.find({ owner: id }).toArray();
    return userListings;
  },

  async addListing(
    userID,
    lat,
    lng,
    locationName,
    details,
    startTime,
    endTime,
    price
  ) {
    const listingCollection = await listings();

    const newListing = {
      lat: lat,
      lng: lng,
      locationName: locationName,
      details: details,
      endTime: endTime,
      startTime: startTime,
      price: price,
      owner: userID,
      _id: uuid()
    };
    console.log(newListing);
    const newList = await listingCollection.insertOne(newListing);
    const newId = newList.insertedId;
    return await this.getListingById(newId);
  },

  async updateListing(listingid, patchData) {
    const listingCollection = await listings();
    let updatedData = {};
    //Error checking
    if (
      patchData.lat === undefined &&
      patchData.lng === undefined &&
      patchData.locationName === undefined &&
      patchData.details === undefined &&
      patchData.startTime === undefined &&
      patchData.endTime === undefined &&
      patchData.price === undefined
    ) {
      throw "Please provide atleast one of the field";
    }

    if (patchData.lat) {
      if (typeof patchData.lat !== "string") {
        throw "Please provide a valid latitude";
      } else {
        updatedData.lat = patchData.lat;
      }
    }
    if (patchData.lng) {
      if (typeof patchData.lng !== "string") {
        throw "Please provide a valid lnggitude";
      } else {
        updatedData.lng = patchData.lng;
      }
    }
    if (patchData.details) {
      if (typeof patchData.details !== "string") {
        throw "Please provide valid details in text format";
      } else {
        updatedData.details = patchData.details;
      }
    }
    if (patchData.price) {
      if (typeof patchData.price !== "number") {
        throw "Please provide a valid price in number format";
      } else {
        updatedData.price = patchData.price;
      }
    }

    const query = { _id: listingid };
    await listingCollection.updateOne(query, {
      $set: { listings: updatedData }
    });
    return await this.getListingById(listingid);
  },

  async removeListing(listingId) {
    const listCollection = await listings();
    const deletionInfo = await listCollection.removeOne({ _id: listingId });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete listing with id of ${listingId}`;
    } else {
      return "Listing Successfully Deleted";
    }
  }
};

module.exports = exportedMethods;
