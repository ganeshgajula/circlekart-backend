const mongoose = require("mongoose");

const initializeDbConnection = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("successfully connected"))
    .catch((error) =>
      console.error(
        "mongoose connection failed, kindly check connectivity",
        error
      )
    );
};

module.exports = { initializeDbConnection };
