const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsSongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addSongToPlaylist(songId, playlistId) {
    const id = `pls-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists_songs VALUES($1, $2, $3)',
      values: [id, playlistId, songId],
    };

    await this._pool.query(query);
    await this._cacheService.delete(`playlist_songs:${playlistId}`);
  }

  async getSongsFromPlaylist(playlistId) {
    try {
      const result = await this._cacheService.get(`playlist_songs:${playlistId}`);
      return JSON.parse(result);
    } catch {
      const query = {
        text: `SELECT songs.id, songs.title, songs.performer
          FROM playlists_songs AS pls
          JOIN songs ON songs.id = pls.song_id
          WHERE pls.playlist_id = $1`,
        values: [playlistId],
      };

      const result = await this._pool.query(query);

      await this._cacheService.set(
        `playlist_songs:${playlistId}`,
        JSON.stringify(result.rows),
      );

      return result.rows;
    }
  }

  async deleteSongFromPlaylist(songId, playlistId) {
    const query = {
      text: `DELETE FROM playlists_songs WHERE song_id = $1
        AND playlist_id = $2 RETURNING id`,
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus lagu dari playlist, lagu tidak ditemukan');
    }
    await this._cacheService.delete(`playlist_songs:${playlistId}`);
  }
}

module.exports = PlaylistsSongsService;
