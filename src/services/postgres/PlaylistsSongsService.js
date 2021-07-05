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
        FROM playlists_songs
        LEFT JOIN songs ON songs.id = playlists_songs.song_id
        WHERE playlists_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = PlaylistsSongsService;
