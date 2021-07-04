const Joi = require('joi');

const currentYear = new Date().getFullYear();

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1800).max(currentYear).required(),
  performer: Joi.string().max(70).required(),
  genre: Joi.string().max(30).required(),
  duration: Joi.number().integer().required(),
});

module.exports = { SongPayloadSchema };
