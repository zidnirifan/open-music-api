/* eslint-disable no-console */
const ClientError = require('../../exceptions/ClientError');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
  }

  async postSongHandler({ payload }, h) {
    try {
      this._validator.validateSongPayload(payload);

      const songId = await this._service.addSong(payload);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const { message, statusCode } = error;
        const response = h.response({
          status: 'fail',
          message,
        });
        response.code(statusCode);
        return response;
      }

      const response = h.response({
        status: 'fail',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = SongsHandler;
