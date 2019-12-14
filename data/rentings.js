const mongoCollections = require("../config/mongoCollection");
const rentings = mongoCollections.rentings;
const listings = mongoCollections.listings;
//const users = mongoCollections.users;
//const userData = require("./users");
const uuid = require("uuid/v4");

const exportedMethods = {
  async getAllRentings() {
    const rentingCollection = await rentings();
    return await rentingCollection.find({}).toArray();
  },
  async getUserRentings(id) {
    const listingCollection = await listings();
    let data = await listingCollection.find({ rentedBy: id }).toArray();
    return data;
  },
  async getRentingById(id) {
    const rentingCollection = await rentings();
    const renting = await rentingCollection.findOne({ _id: id });
    if (!renting) throw "Renting not found";
    return renting;
  },

  async addRenting(listingId,user_Id) {
    const rentingCollection = await rentings();
    const listingCollection = await listings();
    const listingData = await listingCollection.findOne({ _id: listingId });
    const ctime = new Date();
    const rentingData = {
      _id: uuid(),
      renter: user_Id,
      listingid : listingData._id,
      active: true,
      lat: listingData.lat,
      lng: listingData.lng,
      locationName: listingData.locationName,
      details: listingData.details,
      price: listingData.price,
      owner: listingData.owner,
      startTime: listingData.startTime,
      endTime: listingData.endTime,
      startDate: ctime,
      endDate: null
    };
    const newRent = await rentingCollection.insertOne(rentingData);
    const newId = newRent.insertedId;
    return await this.getRentingById(newId);
  },

  //Add EndDate When User clicks "End Reservation"
  async updateRenting(rentingId){
    const rentingCollection = await rentings();
    const query = { _id: rentingId };
    const etime = new Date(); 
    await rentingCollection.updateOne(query, {
      $set: { endDate : etime }
    });
    return await this.getRentingById(rentingId);
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
