const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const rentalSchema = mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true,
      },
      phone: {
        type: String,
        minlength: 10,
        maxlength: 16,
        required: true,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
    }),
    required: true,
  },

  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 50,
      },
      genre: {
        type: String,
        required: true,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },

  dateOut: {
    type: Date,
    default: Date.now,
    required: true,
  },

  returnDate: {
    type: Date,
  },

  rentalFee: {
    type: Number,
    min: 0,
  },
});

const Rental = mongoose.model("Rental", rentalSchema);

// Input validation schema
const schema = Joi.object({
  customerId: Joi.objectId().required(),
  movieId: Joi.objectId().required(),
});

function validateRental(movie) {
  return schema.validate(movie);
}

module.exports.Rental = Rental;
module.exports.validateRental = validateRental;
