class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postExportPlaylistSongsHandler = this.postExportPlaylistSongsHandler.bind(this);
  }

  async postExportPlaylistSongsHandler({ payload, auth, params }, h) {
    await this._validator.validateExportPlaylistSongsPayload(payload);

    const { id: userId } = auth.credentials;
    const { playlistId } = params;
    const { targetEmail } = payload;
    const message = { userId, targetEmail, playlistId };

    await this._service.sendMessage('export:playlistSongs', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
