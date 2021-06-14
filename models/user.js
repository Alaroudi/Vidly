const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 50,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    minlength: 5,
    maxlength: 100,
    requried: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

// Input validation schema
const schema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().min(5).max(100).required(),
  password: Joi.string().min(5).max(255).required(),
});

function validateUser(user) {
  return schema.validate(user);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
