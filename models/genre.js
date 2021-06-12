const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

// Input validation schema
const schema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
});

function validateGenre(genre) {
  return schema.validate(genre);
}

// Parameters validation schema
const paramSchema = Joi.object({
  id: Joi.objectId().required(),
});

function validateParams(params) {
  return paramSchema.validate(params);
}

module.exports.Genre = Genre;
module.exports.validateGenre = validateGenre;
module.exports.genreSchema = genreSchema;
module.exports.validateParams = validateParams;
