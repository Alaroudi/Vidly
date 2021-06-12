const mongoose = require("mongoose");
const Joi = require("joi");

const { genreSchema } = require("./genre");

const movieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 50,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

// Input validation schema
const schema = Joi.object({
  title: Joi.string().min(1).max(50).required(),
  genreId: Joi.objectId().required(),
  numberInStock: Joi.number().min(0).max(255).required(),
  dailyRentalRate: Joi.number().min(0).max(255).required(),
});

function validateMovie(movie) {
  return schema.validate(movie);
}

// Parameter validation schema
const paramSchema = Joi.object({
  id: Joi.objectId().required(),
});

function validateParams(params) {
  return paramSchema.validate(params);
}
module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;
module.exports.validateParams = validateParams;
