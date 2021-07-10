class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postExportPlaylistSongsHandler = this.postExportPlaylistSongsHandler.bind(this);
  }

  async postExportPlaylistSongsHandler({ payload, auth, params }, h) {
    await this._validator.validateExportPlaylistSongsPayload(payload);

    const { playlistId } = params;
    const { id: userId } = auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

    const { targetEmail } = payload;
    const message = { userId, targetEmail, playlistId };

    await this._producerService.sendMessage(
      'export:playlistSongs',
      JSON.stringify(message),
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
