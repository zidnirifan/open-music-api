const Joi = require('joi');

const ExportPlaylistSongsPayloadSchema = Joi.object({
  targetEmail: Joi.string().email().required(),
});

module.exports = { ExportPlaylistSongsPayloadSchema };
