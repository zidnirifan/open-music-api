const autoBind = require('auto-bind');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler({ payload }, h) {
    await this._validator.validateUserPayload(payload);

    const userId = await this._service.addUser(payload);

    return h
      .response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId,
        },
      })
      .code(201);
  }
}

module.exports = UsersHandler;
