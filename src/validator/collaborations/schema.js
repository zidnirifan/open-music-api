const Joi = require('joi');

const CollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().max(30).required(),
  userId: Joi.string().max(30).required(),
});

module.exports = { CollaborationPayloadSchema };
