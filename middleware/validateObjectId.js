const Joi = require("joi");
// Parameters validation schema
const paramSchema = Joi.object({
  id: Joi.objectId().required(),
});

module.exports = function (req, res, next) {
  const { error } = paramSchema.validate(req.params);

  if (error) {
    return res.status(400).send(error);
  }

  next();
};
