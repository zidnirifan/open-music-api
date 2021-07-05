const Joi = require('joi');

const PlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().max(21).required(),
});

module.exports = { PlaylistSongPayloadSchema };
