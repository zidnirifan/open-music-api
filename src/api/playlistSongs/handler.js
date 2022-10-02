const autoBind = require('auto-bind');

class PlaylistSongsHandler {
  constructor({
    playlistSongsService,
    playlistsService,
    songsService,
    playlistActivitiesService,
    cacheService,
    validator,
  }) {
    this._playlistSongsService = playlistSongsService;
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._playlistActivitiesService = playlistActivitiesService;
    this._cacheService = cacheService;
    this._validator = validator;

    autoBind(this);
  }

  async postSongToPlaylistHandler({ payload, params, auth }, h) {
    const { playlistId } = params;
    const { id: userId } = auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

    await this._validator.validatePlaylistSongPayload(payload);

    const { songId } = payload;

    await this._songsService.isSongExist(songId);
    await this._playlistSongsService.addSongToPlaylist(songId, playlistId);
    await this._playlistActivitiesService.addActivity({
      songId,
      playlistId,
      userId,
      action: 'add',
    });

    await this._cacheService.delete(`playlist_songs:${playlistId}`);

    return h
      .response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      })
      .code(201);
  }

  async getSongsFromPlaylistHandler({ params, auth }, h) {
    const { playlistId } = params;
    const { id: userId } = auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

    try {
      const playlist = await this._cacheService.get(
        `playlist_songs:${playlistId}`
      );

      return h
        .response({
          status: 'success',
          data: { playlist: JSON.parse(playlist) },
        })
        .header('X-Data-Source', 'cache');
    } catch {
      const playlist = await this._playlistsService.getPlaylistById(playlistId);
      const songs = await this._playlistSongsService.getSongsFromPlaylist(
        playlistId
      );
      const playlistSongs = { ...playlist, songs };

      await this._cacheService.set(
        `playlist_songs:${playlistId}`,
        JSON.stringify(playlistSongs)
      );

      return {
        status: 'success',
        data: {
          playlist: playlistSongs,
        },
      };
    }
  }

  async deleteSongFromPlaylistHandler({ params, payload, auth }) {
    const { playlistId } = params;
    const { id: userId } = auth.credentials;

    await this._validator.validatePlaylistSongPayload(payload);
    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

    const { songId } = payload;

    await this._playlistSongsService.deleteSongFromPlaylist(songId, playlistId);
    await this._playlistActivitiesService.addActivity({
      songId,
      playlistId,
      userId,
      action: 'delete',
    });

    await this._cacheService.delete(`playlist_songs:${playlistId}`);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistSongsHandler;
