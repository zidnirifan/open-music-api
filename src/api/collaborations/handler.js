const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor({
    collaborationsService,
    playlistsService,
    usersService,
    cacheService,
    validator,
  }) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._cacheService = cacheService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler({ payload, auth }, h) {
    const { id: owner } = auth.credentials;
    const { playlistId, userId } = payload;

    await this._usersService.isUserExist(userId);
    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
    await this._validator.validateCollaborationPayload(payload);

    const collaborationId = await this._collaborationsService.addCollaboration(
      payload
    );
    await this._cacheService.delete(`playlists:${userId}`);

    return h
      .response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: { collaborationId },
      })
      .code(201);
  }

  async deleteCollaborationHandler({ payload, auth }) {
    const { id: owner } = auth.credentials;
    const { playlistId, userId } = payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
    await this._validator.validateCollaborationPayload(payload);
    await this._collaborationsService.deleteCollaboration(payload);
    await this._cacheService.delete(`playlists:${userId}`);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
