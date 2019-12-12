const mongoCollections = require("../config/mongoCollection");
const rentings = mongoCollections.rentings;
//const users = mongoCollections.users;
//const userData = require("./users");
const uuid = require("uuid/v4");

const exportedMethods = {
  async getAllRentings() {
    const rentingCollection = await rentings();
    return await rentingCollection.find({}).toArray();
  },
  async getRentingById(id) {
    const rentingCollection = await rentings();
    const renting = await rentingCollection.findOne({ _id: id });
    if (!renting) throw "Renting not found";
    return renting;
  },

  async addRenting(owner, renter, locationName, details, startTime, endTime) {
    const rentingCollection = await rentings();
    const newRenting = {
      locationName: locationName,
      details: details,
      startTime: startTime,
      endTime: endTime,
      owner: userID,
      _id: uuid()
    };
    const newRent = await rentingCollection.insertOne(newRenting);
    const newId = newRent.insertedId;
    return await this.getRentingById(newId);
  },

  async removeRenting(rentingId) {
    const rentingCollection = await rentings();
    /*
    First check if renting exists then only try to delete it
    add error checking code here
    */
    const deletionInfo = await rentingCollection.removeOne({ _id: rentingId });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete Renting with id of ${rentingId}`;
    } else {
      return "Renting Successfully Deleted";
    }
  }
};

module.exports = exportedMethods;
