const mongoose = require("mongoose");
const express = require("express");
const app = express();
const genresRouter = require("./routes/genres");
const customersRouter = require("./routes/cutomers");

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
app.use("/api/genres", genresRouter);
app.use("/api/customers", customersRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));
