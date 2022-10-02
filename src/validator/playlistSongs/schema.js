const Joi = require('joi');

const PlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().max(30).required(),
});

module.exports = { PlaylistSongPayloadSchema };
