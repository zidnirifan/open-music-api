/* eslint-disable no-console */
const ClientError = require('../../exceptions/ClientError');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
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

  async getSongsHandler(_request, h) {
    try {
      const songs = await this._service.getSongs();

      return {
        status: 'success',
        data: { songs },
      };
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });

      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getSongByIdHandler({ params }, h) {
    try {
      const { id } = params;

      const song = await this._service.getSongById(id);

      return {
        status: 'success',
        data: { song },
      };
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

  async putSongByIdHandler({ payload, params }, h) {
    try {
      this._validator.validateSongPayload(payload);
      const { id } = params;

      await this._service.updateSongById(id, payload);

      const response = h.response({
        status: 'success',
        message: 'lagu berhasil diperbarui',
      });
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

  async deleteSongByIdHandler({ params }, h) {
    try {
      const { id } = params;
      await this._service.deleteSongById(id);

      return {
        status: 'success',
        message: 'lagu berhasil dihapus',
      };
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
