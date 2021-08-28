const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler({ payload }, h) {
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
  }

  async getSongsHandler() {
    const songs = await this._service.getSongs();

    return {
      status: 'success',
      data: { songs },
    };
  }

  async getSongByIdHandler({ params }) {
    const { id } = params;

    const song = await this._service.getSongById(id);

    return {
      status: 'success',
      data: { song },
    };
  }

  async putSongByIdHandler({ payload, params }, h) {
    this._validator.validateSongPayload(payload);
    const { id } = params;

    await this._service.editSongById(id, payload);

    const response = h.response({
      status: 'success',
      message: 'lagu berhasil diperbarui',
    });
    return response;
  }

  async deleteSongByIdHandler({ params }) {
    const { id } = params;
    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
