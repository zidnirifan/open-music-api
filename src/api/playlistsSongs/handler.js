class PlaylistsSongsHandler {
  constructor(playlistsSongsService, playlistsService, validator) {
    this._playlistsSongsService = playlistsSongsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
  }

  async postSongToPlaylistHandler({ payload, params, auth }, h) {
    const { playlistId } = params;
    const { id: owner } = auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);

    await this._validator.validatePlaylistSongPayload(payload);

    const { songId } = payload;

    await this._playlistsSongsService.addSongToPlaylist(songId, playlistId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);

    return response;
  }

  async getSongsFromPlaylistHandler({ params, auth }) {
    const { playlistId } = params;
    const { id: owner } = auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);

    const songs = await this._playlistsSongsService.getSongsFromPlaylist(playlistId);

    return {
      status: 'success',
      data: { songs },
    };
  }
}

module.exports = PlaylistsSongsHandler;
