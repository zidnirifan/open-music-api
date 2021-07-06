const { nanoid } = require('nanoid');
const { Pool } = require('pg');

class PlaylistsSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist(songId, playlistId) {
    const id = `pls-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists_songs VALUES($1, $2, $3)',
      values: [id, playlistId, songId],
    };

    await this._pool.query(query);
  }

  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
        FROM playlists_songs AS pls
        LEFT JOIN songs ON songs.id = pls.song_id
        WHERE pls.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteSongFromPlaylist(songId) {
    const query = {
      text: 'DELETE FROM playlists_songs WHERE song_id = $1',
      values: [songId],
    };

    await this._pool.query(query);
  }
}

module.exports = PlaylistsSongsService;
