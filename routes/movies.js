const express = require("express");
const router = express.Router();
const { Movie, validateMovie, validateParams } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");

// Get router handlers
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().sort("name");
    res.send(movies);
  } catch (e) {
    console.log("Error", e.message);
    res.status(500).send(e.message);
  }
});

router.get("/:id", async (req, res) => {
  const { error } = validateParams(req.params);

  if (error) {
    return res.status(400).send(error.message);
  }

  try {
    const id = req.params.id;
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).send("Movie with the given ID is not found!");
    }

    res.send(movie);
  } catch (e) {
    console.log("Error", e.message);
    res.status(500).send(e.message);
  }
});

// Post route handler
router.post("/", auth, async (req, res) => {
  const { error } = validateMovie(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  try {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) {
      return res.status(400).send("Invalid genre.");
    }

    const movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });

    await movie.save();

    res.send(movie);
  } catch (e) {
    console.log("Error", e.message);
    res.status(500).send(e.message);
  }
});

// Put route handler
router.put("/:id", auth, async (req, res) => {
  let result = validateParams(req.params);
  if (result.error) {
    return res.status(400).send(result.error.message);
  }

  result = validateMovie(req.body);
  if (result.error) {
    return res.status(400).send(result.error.message);
  }

  const id = req.params.id;
  try {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) {
      return res.status(404).send("Genre with the given id is not found");
    }

    const movie = await Movie.findByIdAndUpdate(
      id,
      {
        $set: {
          title: req.body.title,
          genre: {
            _id: genre._id,
            name: genre.name,
          },
          numberInStock: req.body.numberInStock,
          dailyRentalRate: req.body.dailyRentalRate,
        },
      },
      {
        new: true,
      }
    );

    if (!movie) {
      return res.status(404).send("Movie with the given ID is not found!");
    }
    res.send(movie);
  } catch (e) {
    console.log("Error", e.message);
    res.status(500).send(e.message);
  }
});

// Delete route handler
router.delete("/:id", auth, async (req, res) => {
  const { error } = validateParams(req.params);

  if (error) {
    return res.status(400).send(error.message);
  }

  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie) {
    return res.status(404).send("Movie with the given ID is not found!");
  }

  res.send(movie);
});

module.exports = router;
