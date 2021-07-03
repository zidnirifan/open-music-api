const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const mapDBToModel = require('../../utils/mapDBToModel');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  // eslint-disable-next-line object-curly-newline
  async addSong({ title, year, performer, genre, duration }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id',
      values: [id, title, year, performer, genre, duration],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query('SELECT id, title, performer FROM songs');

    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Lagu tidak ditemukan');

    return result.rows.map(mapDBToModel)[0];
  }

  // eslint-disable-next-line object-curly-newline
  async editSongById(id, { title, year, performer, genre, duration }) {
    const query = {
      text: `UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4,
       duration = $5, updated_at = NOW() WHERE id = $6 RETURNING id`,
      values: [title, year, performer, genre, duration, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus lagu, lagu tidak ditemukan');
    }
  }
}

module.exports = SongsService;
