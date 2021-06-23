const auth = require("../middleware/auth");
const { validateRental: validateReturn } = require("../models/rental");
const router = require("express").Router();

// Post request handlers
router.post("/", auth, async (req, res) => {
  // const { error } = validateReturn(req.body);
  // if (error) {
  //     return res.status(400).send(error.message);
  // }
});

module.exports = router;
