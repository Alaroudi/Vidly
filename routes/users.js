const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.send(user);
});

// Post rout handler
router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("User already registered.");
  }

  user = new User({
    ...req.body,
  });

  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);
  try {
    await user.save();

    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .send(_.pick(user, ["_id", "name", "email"]));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;
