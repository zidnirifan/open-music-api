const Joi = require('joi');

const currentYear = new Date().getFullYear();

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().min(1800).max(currentYear).required(),
});

const PostCoverAlbumSchema = Joi.object({
  'content-type': Joi.string()
    .valid(
      'image/apng',
      'image/avif',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/svg',
      'image/webp'
    )
    .required(),
}).unknown();

module.exports = { AlbumPayloadSchema, PostCoverAlbumSchema };
