const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPictureHandler({ payload }, h) {
    const { data } = payload;
    this._validator.validatePictureHeaders(data.hapi.headers);

    const filename = await this._service.writeFile(data, data.hapi);

    const response = h.response({
      status: 'success',
      message: 'Gambar berhasil diunggah',
      data: {
        pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/pictures/${filename}`,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
