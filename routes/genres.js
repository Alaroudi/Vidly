const express = require("express");
const router = express.Router();
const { Genre, validateGenre } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateId = require("../middleware/validateObjectId");

// Get request handlers
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort();
  res.send(genres);
});

router.get("/:id", validateId, async (req, res) => {
  const id = req.params.id;
  const genre = await Genre.findById(id);
  if (!genre) {
    return res.status(404).send("Genre with given id is not found.");
  }
  res.send(genre);
});

// Post request handlers
router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  const genre = new Genre({
    name: req.body.name,
  });

  await genre.save();
  res.send(genre);
});

// Put requests handlers
router.put("/:id", [validateId, auth], async (req, res) => {
  result = validateGenre(req.body);
  if (result.error) {
    return res.status(400).send(result.error.message);
  }

  const id = req.params.id;
  const genre = await Genre.findByIdAndUpdate(
    id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre) {
    return res.status(404).send("Genre with given id is not found.");
  }

  res.send(genre);
});

// Delete request handlers
router.delete("/:id", [validateId, auth, admin], async (req, res) => {
  const id = req.params.id;

  const genre = await Genre.findByIdAndRemove(id);
  if (!genre) {
    return res.status(404).send("Genre with given id is not found.");
  }
  res.send(genre);
});

module.exports = router;
