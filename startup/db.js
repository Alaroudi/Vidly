const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function () {
  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.etia7.mongodb.net/Vidlyd?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }
    )
    .then(() => winston.info("Connected to MongoDB..."));
};
