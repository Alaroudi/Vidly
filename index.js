const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const genresRouter = require("./routes/genres");
const customersRouter = require("./routes/cutomers");
const moviesRouter = require("./routes/movies");
const retalsRouter = require("./routes/rentals");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.etia7.mongodb.net/Vidly?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch(() => console.log("Could not connect to MongoDB!"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/genres", genresRouter);
app.use("/api/customers", customersRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/rentals", retalsRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));
