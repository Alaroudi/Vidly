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

module.exports.Genre = Genre;
module.exports.validate = validateGenre;
