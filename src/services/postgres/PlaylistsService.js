const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsService {
  constructor(collaborationsService, cacheService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
    this._cacheService = cacheService;
  }

  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new InvariantError('Playlist gagal ditambahkan');

    await this._cacheService.delete(`playlist:${owner}`);

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    try {
      const result = await this._cacheService.get(`playlist:${owner}`);
      return JSON.parse(result);
    } catch {
      const query = {
        text: `SELECT playlists.id, playlists.name, users.username
        FROM playlists
        JOIN users ON users.id = playlists.owner
        LEFT JOIN collaborations ON collaborations.user_id = $1
        WHERE playlists.owner = $1 OR playlists.id = collaborations.playlist_id`,
        values: [owner],
      };

      const result = await this._pool.query(query);

      await this._cacheService.set(`playlist:${owner}`, JSON.stringify(result.rows));

      return result.rows;
    }
  }

  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING owner',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus playlist, playlist tidak ditemukan');
    }

    const { owner } = result.rows[0];
    await this._cacheService.delete(`playlist:${owner}`);
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Playlist tidak ditemukan');

    const playlistOwner = result.rows[0].owner;

    if (playlistOwner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses playlist ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;

      try {
        await this._collaborationsService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
