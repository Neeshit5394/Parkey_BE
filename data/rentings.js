const mongoCollections = require("../config/mongoCollection");
const rentings = mongoCollections.rentings;
//const users = mongoCollections.users;
//const userData = require("./users");
const uuid = require("uuid/v4");
const aws = require('aws-sdk');

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

  async verifyemail() {
    var email   = "dangineeshit@outlook.com";
    // Load AWS credentials and try to instantiate the object.
    aws.config.loadFromPath('../config.json');

    aws.config.getCredentials(function(err) {
        if (err) console.log(err.stack);
    });
    var ses = new aws.SES();

    var params = {
      EmailAddress: email
  };

  ses.verifyEmailAddress(params);
  },

  async sendemail(email){
    var destemail   = email;
    var ses_mail = "From: 'AWS Tutorial Series' <" + email + ">\n";
    ses_mail = ses_mail + "To: " + email + "\n";
    ses_mail = ses_mail + "Subject: Parkey Renting Successful\n";
    ses_mail = ses_mail + "MIME-Version: 1.0\n";
    ses_mail = ses_mail + "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
    ses_mail = ses_mail + "--NextPart\n";
    ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
    ses_mail = ses_mail + "Your reservation is successfull. Please check Parkey app to find details.\n\n";
    
    var params = {
        RawMessage: { Data: new Buffer(ses_mail) },
        Destinations: [ destemail ],
        Source: email 
    };
    
    ses.sendRawEmail(params);
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
