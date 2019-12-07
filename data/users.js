const mongoCollection = require("../config/mongoCollection");
const users = mongoCollection.users;
const uuid = require('uuid/v4');
const errorChecking = require("../helpers").errorChecking;

//Display all Users
const getAllUsers = async () => {
    const userCollection = await users();
    return await userCollection.find({}).toArray();
}

//Display Specific user by id
const getUserByID = async (id) => {
    const userCollection = await users();
    const user = await userCollection.findOne({_id: id});
    if (!user) throw "User not found! Please provide a valid User ID";
    return user;
}

//Adding a user 
//Need to add specific error checking
//Need to check if user already exists!
const addUser = async (name, email, phnumber) => {
    if (!errorChecking.dataValidString(name)) {
        throw "Invalid Name"
    }
    if (!errorChecking.dataValidString(email)) { 
        throw "Invalid Email"
    }
    if (!errorChecking.dataValidInteger(phnumber)) {
        throw "Invalid Phone Number"
    }

    const userCollection = await users();
    //Change uuid to the Firebase UID on user creation 
    const newUser = {
        name: name,
        email: email,
        phnumber: phnumber,
        // password: password, 
        _id: uuid()
    };
    const newInfo = await userCollection.insertOne(newUser);
    const newId = newInfo.insertedId;
    return await this.getUserByID(newId);

}

//Update Whole User
const updateUser = async (id, name, email, phnumber) => {
    const userCollection = await users();
    if (!errorChecking.dataValidString(name)) {
        throw `Invalid Name`
    }
    if (!errorChecking.dataValidString(email)) {
        throw `Invalid Email`
    }
    if (!errorChecking.dataValidInteger(phnumber)) {
        throw `Invalid Phone Number`
    }
    
    const updateUserData = {
        name: name,
        email: email,
        phnumber: phnumber,
        // password: password, 
    };
    const query = {
        _id: id
    };
    await userCollection.updateOne(query, {
        $set: updateUserData
    });
    return await this.getUserByID(id);
    
}

//Patching Update Specific User Field
const updateSpecificFields = async (id, updateUserData) => {

    // if (!errorChecking.dataValidString(name)) {
    //     throw `Invalid Name`
    // }
    // if (!errorChecking.dataValidString(email)) {
    //     throw `Invalid Email`
    // }
    // if (!errorChecking.dataValidInteger(phnumber)) {
    //     throw `Invalid Phone Number`
    // }
    
    const query = {
        _id: id
    };
    const userCollection = await users();
    await userCollection.updateOne(query, {
        $set: updateUserData
    });
    return await this.getUserByID(id);
    
}

const removeUser = async (id) => {
    const userCollection = await users();
    const deletionInfo = await userCollection.removeOne({ _id: id });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete user with id of ${id}`;
    } 
}

module.exports = {
    getAllUsers,
    addUser,
    getUserByID,
    updateUser,
    updateSpecificFields,
    removeUser
}