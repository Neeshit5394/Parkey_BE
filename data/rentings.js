const mongoCollections = require("../config/mongoCollection");
const listings = mongoCollections.listings;

const exportedMethods = {
  async getUserRentings(id) {
    const listingCollection = await listings();
    let data = await listingCollection.find({ rentedBy: id }).toArray();
    return data;
  }
};

module.exports = exportedMethods;
