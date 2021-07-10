const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');

class CollaborationsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addCollaboration({ playlistId, userId }) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new InvariantError('Gagal menambahkan kolaborasi');

    await this._cacheService.delete(`playlist:${userId}`);

    return result.rows[0].id;
  }

  async deleteCollaboration({ playlistId, userId }) {
    const query = {
      text: `DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 
        RETURNING id`,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new InvariantError('Gagal menghapus kolaborasi');

    await this._cacheService.delete(`playlist:${userId}`);
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new AuthorizationError('Kolaborasi gagal diverifikasi');
  }
}

module.exports = CollaborationsService;
