const { Pool } = require('pg');

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications values($1)',
      values: [token],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;
