class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
  }

  async postPlaylistHandler({ payload, auth }, h) {
    await this._validator.validatePlaylistPayload(payload);

    const { id: owner } = auth.credentials;
    const { name } = payload;

    const playlistId = await this._service.addPlaylist({ owner, name });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: { playlistId },
    });
    response.code(201);
    return response;
  }
}

module.exports = PlaylistsHandler;
