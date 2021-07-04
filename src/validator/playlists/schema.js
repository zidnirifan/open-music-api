const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().max(120).required(),
});

module.exports = { PlaylistPayloadSchema };
