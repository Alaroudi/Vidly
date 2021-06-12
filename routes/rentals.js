const express = require("express");
const router = express.Router();
const { Rental, validateParams, validateRental } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const mongoose = require("mongoose");

// Get route handlers
router.get("/", async (req, res) => {
  try {
    const rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
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

  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).send("Rental with given id is not found.");
    }

    res.send(rental);
  } catch (e) {
    console.log("Error:", e.message);
    res.status(500).send(e.message);
  }
});

// Post route handlers
router.post("/", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) {
    return res.status(400).send(error.message);
  }

  try {
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
      console.log("Transaction was aborted due to an unxpected error:", e);
      res
        .status(500)
        .send("Transaction was aborted due to an unxpected \n" + e.message);
    } finally {
      await session.endSession();
    }
  } catch (e) {
    console.log("Error:", e.message);
    res.status(500).send(e.message);
  }
});

// Delete routed handler
router.delete("/:id", async (req, res) => {
  const { error } = validateParams(req.params);
  if (error) {
    return res.status(400).send(error.message);
  }

  const rental = await Rental.findByIdAndRemove(req.params.id);
  if (!rental) {
    return res.status(404).send("Rental with given ID is not found.");
  }

  res.send(rental);
});

module.exports = router;
