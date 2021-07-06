class PlaylistsSongsHandler {
  constructor({ playlistsSongsService, playlistsService, validator }) {
    this._playlistsSongsService = playlistsSongsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
  }

  async postSongToPlaylistHandler({ payload, params, auth }, h) {
    const { playlistId } = params;
    const { id: userId } = auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

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
    const { id: userId } = auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

    const songs = await this._playlistsSongsService.getSongsFromPlaylist(playlistId);

    return {
      status: 'success',
      data: { songs },
    };
  }

  async deleteSongFromPlaylistHandler({ params, payload, auth }) {
    const { playlistId } = params;
    const { id: userId } = auth.credentials;

    await this._validator.validatePlaylistSongPayload(payload);
    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

    const { songId } = payload;

    await this._playlistsSongsService.deleteSongFromPlaylist(songId);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistsSongsHandler;
