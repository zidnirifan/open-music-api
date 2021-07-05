const Joi = require('joi');

const PlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().length(21).required(),
});

module.exports = { PlaylistSongPayloadSchema };
