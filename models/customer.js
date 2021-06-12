const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = mongoose.Schema({
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
});

// Input Validation Schema
const schema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  phone: Joi.string().min(10).max(16).required(),
  isGold: Joi.boolean(),
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  return schema.validate(customer);
}

// Parameter validation schema
const paramSchema = Joi.object({
  id: Joi.objectId().required(),
});

function validateParams(params) {
  return paramSchema.validate(params);
}

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;
module.exports.validateParams = validateParams;
