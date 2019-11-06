const userRoutes = require("./users");
const rentingRoutes = require("./rentings");
const listingRoutes = require("./listings");

const constructorMethod = app => {
  app.use("/users", userRoutes);
  app.use("/rentings", rentingRoutes);
  app.use("/listings", listingRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ error : "Invalid URL, URL Not Found" });
  });
};

module.exports = constructorMethod;