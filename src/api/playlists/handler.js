class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
  }

  async postPlaylistHandler({ payload, auth }, h) {
    await this._validator.validatePlaylistPayload(payload);

    const { id: owner } = auth.credentials;
    const { name } = payload;

    const playlistId = await this._service.addPlaylist(name, owner);

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: { playlistId },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler({ auth }) {
    const { id } = auth.credentials;
    const playlists = await this._service.getPlaylists(id);

    return {
      status: 'success',
      data: { playlists },
    };
  }

  async deletePlaylistHandler({ params, auth }) {
    const { id } = params;
    const { id: owner } = auth.credentials;

    await this._service.verifyPlaylistOwner(id, owner);
    await this._service.deletePlaylist(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }
}

module.exports = PlaylistsHandler;
