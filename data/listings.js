const mongoCollections = require("../config/mongoCollection");
const listings = mongoCollections.listings;
//const users = mongoCollections.users;
//const userData = require("./users");
const uuid = require("uuid/v4");

const exportedMethods = {
  async getAllListings() {
    const listingCollection = await listings();
    return await listingCollection.find({}).toArray();
  },
  async getListingById(id) {
    const listingCollection = await listings();
    const listing = await listingCollection.findOne({ _id: id });
    if (!listing) throw "Listing not found";
    return listing;
  },

  async addListing(userID, location, details, availability, price, image) 
  {
    const listingCollection = await listings();
    const newListing = {
      location: location,
      details: details, 
      availability: availability,
      price: price, 
      image: image, 
      owner: userID, 
      _id: uuid()
    };
    const newList = await listingCollection.insertOne(newListing); 
    const newId = newList.insertedId; 
    return await this.getListingById(newId); 
  },

  async updateListing(listingid,patchData) {
    const listingCollection = await listings();
    let updatedData = {};
    //Error checking
    if(patchData.location === undefined && patchData.details === undefined && patchData.availability === undefined && patchData.price === undefined && patchData.image === undefined)
    {
      throw "Please provide atleast one of the field";
    }
    
    if(patchData.location) 
    {
      if(typeof(patchData.location) !== "string") {throw "Please provide a valid location in text format";}
      else {updatedData.location = patchData.location;}
    }
    if(patchData.details) 
    {
      if(typeof(patchData.details) !== "string") {throw "Please provide valid details in text format";}
      else {updatedData.details = patchData.details;}
    }
    if(patchData.availability) 
    {
      if(typeof(patchData.availability) !== "number") {throw "Please provide a valid availability in number format";}
      else {updatedData.availability = patchData.availability;}
    }
    if(patchData.price) 
    {
      if(typeof(patchData.price) !== "number") {throw "Please provide a valid price in number format";}
      else {updatedData.price = patchData.price;}
    }
    
    const query = {_id: listingid};
    await listingCollection.updateOne(query, {
        $set: {listings: updatedData}
    });
    return await this.getListingById(listingid);
  },

  async removeListing(listingId) {
    const listCollection = await listings();
    const deletionInfo = await listCollection.removeOne({ _id: listingId });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete listing with id of ${listingId}`;
    }
    else{
      return "Listing Successfully Deleted";
    } 
  }
};

module.exports = exportedMethods;