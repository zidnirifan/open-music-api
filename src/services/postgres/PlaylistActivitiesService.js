const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addActivity({ playlistId, songId, userId, action }) {
    const id = `act-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_activities VALUES($1, $2, $3, $4, $5)',
      values: [id, playlistId, songId, userId, action],
    };

    await this._pool.query(query);
  }

  async getActivities(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, PA.action, PA.time
        FROM playlist_activities AS PA
        JOIN songs ON songs.id = PA.song_id
        JOIN users ON users.id = PA.user_id
        WHERE PA.playlist_id = $1`,
      values: [playlistId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) throw new NotFoundError('Playlist tidak ditemukan');

    return rows;
  }
}

module.exports = PlaylistActivitiesService;
