const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor({ collaborationsService, playlistsService, validator }) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler({ payload, auth }, h) {
    const { id: owner } = auth.credentials;
    const { playlistId } = payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
    await this._validator.validateCollaborationPayload(payload);

    const collaborationId = await this._collaborationsService.addCollaboration(payload);

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: { collaborationId },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler({ payload, auth }) {
    const { id: owner } = auth.credentials;
    const { playlistId } = payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
    await this._validator.validateCollaborationPayload(payload);
    await this._collaborationsService.deleteCollaboration(payload);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
