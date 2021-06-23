const express = require("express");
const router = express.Router();
const { Movie, validateMovie } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const validateId = require("../middleware/validateObjectId");

// Get router handlers
router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  res.send(movies);
});

router.get("/:id", validateId, async (req, res) => {
  const id = req.params.id;
  const movie = await Movie.findById(id);
  if (!movie) {
    return res.status(404).send("Movie with the given ID is not found!");
  }

  res.send(movie);
});

// Post route handler
router.post("/", auth, async (req, res) => {
  const { error } = validateMovie(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

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
});

// Put route handler
router.put("/:id", [validateId, auth], async (req, res) => {
  const result = validateMovie(req.body);
  if (result.error) {
    return res.status(400).send(result.error.message);
  }

  const id = req.params.id;

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
});

// Delete route handler
router.delete("/:id", [validateId, auth], async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie) {
    return res.status(404).send("Movie with the given ID is not found!");
  }

  res.send(movie);
});

module.exports = router;
