const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  const uri =
    "mongodb+srv://" +
    config.get("DB_USER") +
    ":" +
    config.get("DB_PASS") +
    "@cluster0.etia7.mongodb.net/" +
    config.get("DB") +
    "?retryWrites=true&w=majority";

  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => console.log(`Connected to ${config.get("DB")}...`));
};
