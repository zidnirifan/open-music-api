class PlaylistsHandler {
  constructor(service) {
    this._service = service;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { name } = request.payload;

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
