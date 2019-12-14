const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users;

//Redis
const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

//Check to see if Redis is connected
client.on('connect', function(){
  console.log("Connected to Redis....");
});

router.get("/", async (req, res) => {
  try {
    const allusers = await usersData.getAllUsers();
    if (allusers.length === 0) {
      res.status(200).send("No Users to display");
    } else {
      res.json(allusers);
    }
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.post("/", async (req, res) => {
  const usersPostData = req.body;
  console.log(usersPostData);
  const { firstName, lastName, email, phnumber, id } = usersPostData;
  try {
    const newUser = await usersData.addUser(
      firstName,
      lastName,
      email,
      phnumber,
      id
    );


    //Cache the user entry for 1 hour only 
    var r = JSON.stringify(usersPostData);
    const userSet = await client.setexAsync(id,3600,r);
    if(userSet)
            console.log("User Successfully Stored in Cache");

    res.status(200).json(newUser);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: e
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let user = null;
    const userExists = await client.getAsync(req.params.id);
    if(userExists === null)
    {
      console.log("Not in Redis!");
      user = await usersData.getUserByID(req.params.id);
    }
    else
    {
      console.log("User found in Redis");
      user  = JSON.parse(userExists);
    }
    res.status(200).json(user);
  } catch (e) {
    res.status(404).json({
      error: "User not found"
    });
  }
});

router.patch("/:id", async (req, res) => {
  const userID = req.params.id;
  try {
    await usersData.getUserByID(userID);
  } catch (e) {
    res.status(404).json({
      error: "User not found"
    });
    return;
  }
  const updatedUserData = {};
  let errorMessage = "";
  try {
    if (req.body.hasOwnProperty("name")) {
      updatedUserData.name = req.body.name;
    }
    if (req.body.hasOwnProperty("email")) {
      updatedUserData.ingredients = req.body.email;
    }
    if (req.body.hasOwnProperty("phnumber")) {
      updatedUserData.phnumber = req.body.phnumber;
    }
    if (errorMessage) {
      res.status(500).json({
        error: errorMessage
      });
    } else {
      const updatedUser = await usersData.updateSpecificFields(
        userID,
        updatedUserData.phnumber
      );

      //Cache the updated user entry
      var r = JSON.stringify(updatedUser);
      const userSet = await client.setexAsync(id,3600,r);
      if(userSet)
              console.log("User Successfully Updated in Cache");

      res.json(updatedUser);
    }
  } catch (e) {
    console.log(`Error in patch ${e}`);
    res.status(500).json({
      error: e
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await usersData.getUserByID(req.params.id);
    await usersData.removeUser(req.params.id);
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json({ error: e });
    return;
  }
});

module.exports = router;
