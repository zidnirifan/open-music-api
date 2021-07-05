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
}

module.exports = PlaylistsSongsService;
