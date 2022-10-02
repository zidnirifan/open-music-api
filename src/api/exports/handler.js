const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistSongsHandler({ payload, auth, params }, h) {
    const { playlistId } = params;
    const { id: userId } = auth.credentials;

    await this._validator.validateExportPlaylistSongsPayload(payload);
    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

    const { targetEmail } = payload;
    const message = { targetEmail, playlistId };
    const quequeName = 'export:playlistSongs';

    await this._producerService.sendMessage(
      quequeName,
      JSON.stringify(message)
    );

    return h
      .response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      })
      .code(201);
  }
}

module.exports = ExportsHandler;
