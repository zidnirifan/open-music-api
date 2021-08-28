const autoBind = require('auto-bind');

class AuthenticationsHandler {
  constructor({ authenticationsService, usersService, tokenManager, validator }) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    autoBind(this);
  }

  async postAuthenticationHandler({ payload }, h) {
    await this._validator.validatePostAuthenticationPayload(payload);
    const { username, password } = payload;

    const id = await this._usersService.verifyUserCredential(username, password);

    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authenticationsService.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler({ payload }) {
    await this._validator.validatePutAuthenticationPayload(payload);

    const { refreshToken } = payload;

    await this._authenticationsService.verifyRefreshToken(refreshToken);

    const { id } = await this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = await this._tokenManager.generateAccessToken({ id });

    return {
      status: 'success',
      message: 'Authentication berhasil diperbarui',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler({ payload }) {
    await this._validator.validateDeleteAuthenticationPayload(payload);

    const { refreshToken } = payload;

    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    };
  }
}

module.exports = AuthenticationsHandler;
