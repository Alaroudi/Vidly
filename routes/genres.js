const Joi = require("joi");
const express = require("express");
const router = express.Router();

// hard coded genres
const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Horror" },
];

// Input validation schema
const schema = Joi.object({
  name: Joi.string().min(3).required(),
});

// Get request handlers
router.get("/", (req, res) => {
  res.send(genres);
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const genre = genres.find((element) => element.id === id);

  if (!genre) {
    return res.status(404).send("Genre with given id is not found.");
  }

  res.send(genre);
});

// Post request handlers
router.post("/", (req, res) => {
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
router.put("/:id", (req, res) => {
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

// Delete request handlers
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const genre = genres.find((element) => element.id === id);
  if (!genre) {
    return res.status(404).send("Genre with given id is not found.");
  }

  genres.splice(genres.indexOf(genre), 1);
  res.send(genre);
});

module.exports = router;
