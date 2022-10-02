const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist(songId, playlistId) {
    const id = `pls-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3)',
      values: [id, playlistId, songId],
    };

    await this._pool.query(query);
  }

  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
        FROM playlist_songs AS pls
        JOIN songs ON songs.id = pls.song_id
        WHERE pls.playlist_id = $1`,
      values: [playlistId],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }

  async deleteSongFromPlaylist(songId, playlistId) {
    const query = {
      text: `DELETE FROM playlist_songs WHERE song_id = $1
        AND playlist_id = $2 RETURNING id`,
      values: [songId, playlistId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError(
        'Gagal menghapus lagu dari playlist, lagu tidak ditemukan'
      );
    }
  }
}

module.exports = PlaylistSongsService;
