const Joi = require('joi');

const AuthenticationSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = { AuthenticationSchema };
