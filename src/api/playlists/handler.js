const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor({ playlistsService, cacheService, validator }) {
    this._playlistsService = playlistsService;
    this._cacheService = cacheService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler({ payload, auth }, h) {
    await this._validator.validatePlaylistPayload(payload);

    const { id: owner } = auth.credentials;
    const { name } = payload;

    const playlistId = await this._playlistsService.addPlaylist(name, owner);
    await this._cacheService.delete(`playlists:${owner}`);

    return h
      .response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: { playlistId },
      })
      .code(201);
  }

  async getPlaylistsHandler({ auth }, h) {
    const { id: owner } = auth.credentials;
    try {
      const playlists = await this._cacheService.get(`playlists:${owner}`);

      return h
        .response({
          status: 'success',
          data: { playlists: JSON.parse(playlists) },
        })
        .header('X-Data-Source', 'cache');
    } catch {
      const playlists = await this._playlistsService.getPlaylists(owner);

      await this._cacheService.set(
        `playlists:${owner}`,
        JSON.stringify(playlists)
      );

      return {
        status: 'success',
        data: { playlists },
      };
    }
  }

  async deletePlaylistHandler({ params, auth }) {
    const { id } = params;
    const { id: owner } = auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(id, owner);
    await this._playlistsService.deletePlaylist(id);
    await this._cacheService.delete(`playlists:${owner}`);
    await this._cacheService.delete(`playlist_songs:${id}`);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }
}

module.exports = PlaylistsHandler;
