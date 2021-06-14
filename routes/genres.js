const express = require("express");
const router = express.Router();
const { Genre, validateGenre, validateParams } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

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
  const { error } = validateParams(req.params);

  if (error) {
    return res.status(400).send(error.message);
  }

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
router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  const genre = new Genre({
    name: req.body.name,
  });

  try {
    await genre.save();
    res.send(genre);
  } catch (e) {
    console.log("Error:", e.message);
    res.status(500).send(e.message);
  }
});

// Put requests handlers
router.put("/:id", auth, async (req, res) => {
  let result = validateParams(req.params);
  if (result.error) {
    return res.status(400).send(result.error.message);
  }

  result = validateGenre(req.body);
  if (result.error) {
    return res.status(400).send(result.error.message);
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
router.delete("/:id", [auth, admin], async (req, res) => {
  const { error } = validateParams(req.params);

  if (error) {
    return res.status(400).send(error.message);
  }

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
