const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users;

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
    let errorMessage = ``;
    const newUser = await usersData.addUser(
      firstName,
      lastName,
      email,
      phnumber,
      id
    );
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
    const user = await usersData.getUserByID(req.params.id);
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
