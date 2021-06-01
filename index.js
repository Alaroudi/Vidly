const express = require("express");
const Joi = require("joi");

const app = express();
app.use(express.json());

// hard coded genres
const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Horror" },
];

// Input validation schema
const schema = Joi.object({
  name: Joi.string().min(3).required(),
});

//Get request handlers
app.get("/", (req, res) => {
  res.send("Welcome to Vidly");
});

app.get("/api/genres", (req, res) => {
  res.send(genres);
});

app.get("/api/genres/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const genre = genres.find((element) => element.id === id);

  if (!genre) {
    return res.status(404).send("Genre with given id is not found.");
  }

  res.send(genre);
});

// Post request handlers
app.post("/api/genres", (req, res) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };

  genres.push(genre);
  res.send(genre);
});

// Put requests handlers
app.put("/api/genres/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const genre = genres.find((element) => element.id === id);

  if (!genre) {
    return res.status(404).send("Genre with given id is not found.");
  }

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.message);
  }

  Object.assign(genre, req.body);
  res.send(genre);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening to port ${port}`));
