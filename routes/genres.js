const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../models/genre");

// Get request handlers
router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find().sort();
    res.send(genres);
  } catch (e) {
    console.log("Error:", e.message);
    res.status(500).send(e.message);
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const genre = await Genre.findById(id);
    if (!genre) {
      return res.status(404).send("Genre with given id is not found.");
    }
    res.send(genre);
  } catch (e) {
    console.log("Error:", e.message);
    res.status(500).send(e.message);
  }
});

// Post request handlers
router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  let genre = new Genre({
    name: req.body.name,
  });

  try {
    genre = await genre.save();
    res.send(genre);
  } catch (e) {
    console.log("Error:", e.message);
    res.status(500).send(e.message);
  }
});

// Put requests handlers
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.message);
  }

  const id = req.params.id;
  try {
    const genre = await Genre.findByIdAndUpdate(
      id,
      { name: req.body.name },
      { new: true }
    );
    if (!genre) {
      return res.status(404).send("Genre with given id is not found.");
    }
    res.send(genre);
  } catch (e) {
    console.log("Error:", e.message);
    res.status(500).send(e.message);
  }
});

// Delete request handlers
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const genre = await Genre.findByIdAndRemove(id);
    if (!genre) {
      return res.status(404).send("Genre with given id is not found.");
    }
    res.send(genre);
  } catch (e) {
    console.log("Error:", e.message);
    res.status(500).send(e.message);
  }
});

module.exports = router;
