const mongoose = require("mongoose");
const express = require("express");
const app = express();
const genres = require("./routes/genres");

mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(() => console.log("Could not connect to MongoDB!"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/genres", genres);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening to port ${port}`));
