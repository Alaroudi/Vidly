const express = require("express");
const router = express.Router();
const { Rental, validateRental } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const validateId = require("../middleware/validateObjectId");

// Get route handlers
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.get("/:id", validateId, async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) {
    return res.status(404).send("Rental with given id is not found.");
  }

  res.send(rental);
});

// Post route handlers
router.post("/", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) {
    return res.status(400).send(error.message);
  }

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) {
    return res.status(400).send("Invalid Customer.");
  }

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) {
    return res.status(400).send("Invalid Movie.");
  }

  if (movie.numberInStock === 0) {
    return res.status(400).send("Movie not in stock.");
  }

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      genre: movie.genre,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  const session = await mongoose.startSession();

  try {
    const transactionResults = await session.withTransaction(async () => {
      await rental.save({ session });

      await Movie.updateOne(
        { _id: movie._id },
        {
          $inc: {
            numberInStock: -1,
          },
        },
        { session }
      );
    });

    if (transactionResults) {
      res.send(rental);
    } else {
      res.status(500).send("The transaction was intentionally aborted.");
    }
  } catch (e) {
    console.error("Transaction was aborted due to an unxpected error:", e);
    res
      .status(500)
      .send("Transaction was aborted due to an unxpected \n" + e.message);
  } finally {
    await session.endSession();
  }
});

// Delete routed handler
router.delete("/:id", [validateId, auth], async (req, res) => {
  const rental = await Rental.findByIdAndRemove(req.params.id);
  if (!rental) {
    return res.status(404).send("Rental with given ID is not found.");
  }

  res.send(rental);
});

module.exports = router;
