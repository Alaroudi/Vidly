const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const {
  Customer,
  validateCustomer,
  validateParams,
} = require("../models/customer");

// Get route handlers
router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const { error } = validateParams(req.params);
  if (error) {
    return res.status(400).send(error.message);
  }

  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return res.status(400).send("Customer with given ID is not found");
  }

  res.send(customer);
});

// Post route handlers
router.post("/", auth, async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) {
    return res.status(400).send(error.message);
  }

  const customer = new Customer({
    ...req.body,
  });

  await customer.save();
  res.send(customer);
});

// Put route handlers
router.put("/:id", auth, async (req, res) => {
  let result = validateParams(req.params);
  if (result.error) {
    return res.status(400).send(result.error.message);
  }

  result = validateCustomer(req.body);
  if (result.error) {
    return res.status(400).send(result.error.message);
  }

  const id = req.params.id;

  const customer = await Customer.findByIdAndUpdate(
    id,
    {
      $set: {
        ...req.body,
      },
    },
    {
      new: true,
    }
  );
  if (!customer) {
    return res.status(404).send("Customer with given ID is not found!");
  }

  res.send(customer);
});

// Delete route handler
router.delete("/:id", auth, async (req, res) => {
  const { error } = validateParams(req.params);
  if (error) {
    return res.status(400).send(error.message);
  }

  const id = req.params.id;

  const customer = await Customer.findByIdAndRemove(id);
  if (!customer) {
    return res.status(404).send("Customer with given ID is not found!");
  }

  res.send(customer);
});

module.exports = router;
