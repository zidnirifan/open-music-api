const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    const id = `user-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO USERS VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, password, fullname],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new InvariantError('User gagal ditambahkan');

    return result.rows[0].id;
  }
}

module.exports = UsersService;
