const usersRoutes = require('./users');
const listingsRoutes = require('./listings');
const bookingsRoutes = require ('./bookings');

const constructorMethod = (app) => {
  app.use("/users", usersRoutes);
  app.use("/listings", listingsRoutes);
  app.use("/bookings", bookingsRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ ERROR: "Not Found" });
  });
};

module.exports = constructorMethod;