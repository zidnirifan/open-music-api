class PlaylistsSongsHandler {
  constructor(playlistsSongsService, playlistsService) {
    this._playlistsSongsService = playlistsSongsService;
    this._playlistsService = playlistsService;

    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
  }

  async postSongToPlaylistHandler({ payload, params, auth }, h) {
    const { playlistId } = params;
    const { id: owner } = auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);

    const { songId } = payload;
    await this._playlistsSongsService.addSongToPlaylist(songId, playlistId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);

    return response;
  }
}

module.exports = PlaylistsSongsHandler;
