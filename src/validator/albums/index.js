const InvariantError = require('../../exceptions/InvariantError');
const { AlbumPayloadSchema, PostCoverAlbumSchema } = require('./schema');

const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);

    if (validationResult.error)
      throw new InvariantError(validationResult.error.message);
  },
  validateCoverAlbumHeaders: (headers) => {
    const validationResult = PostCoverAlbumSchema.validate(headers);

    if (validationResult.error)
      throw new InvariantError(validationResult.error.message);
  },
};

module.exports = AlbumValidator;
