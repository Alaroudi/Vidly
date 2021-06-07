const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../modules/customer");

// Get route handlers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().sort("name");
    res.send(customers);
  } catch (e) {
    console.log("Error", e.message);
    res.status(500).send(e.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(400).send("Customer with given ID is not found");
    }

    res.send(customer);
  } catch (e) {
    console.log("Error", e.message);
    res.status(500).send(e.message);
  }
});

// Post route handlers
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.message);
  }

  let customer = new Customer({
    ...req.body,
  });

  try {
    customer = await customer.save();
    res.send(customer);
  } catch (e) {
    console.log("Error", e.message);
    res.status(500).send(e.message);
  }
});

// Put route handlers
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.message);
  }

  const id = req.params.id;
  try {
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
  } catch (e) {
    console.log("Error", e.message);
    res.status(500).send(e.message);
  }
});

// Delete route handler
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const customer = Customer.findByIdAndRemove(id);
    if (!customer) {
      return res.status(404).send("Customer with given ID is not found!");
    }

    res.send(customer);
  } catch (e) {
    console.log("Error", e.message);
    res.status(500).send(e.message);
  }
});

module.exports = router;
