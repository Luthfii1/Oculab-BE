const mongoose = require("mongoose");

exports.connectDB = async function () {
  const URI = process.env.MONGODB_URI;

  mongoose.set("strictQuery", false);

  mongoose
    .connect(URI)
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      console.error(`Error connecting to the database. \n${err}`);
    });
};
