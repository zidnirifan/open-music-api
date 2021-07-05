class CollaborationsHandler {
  constructor(collaborationsService, playlistsService) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
  }

  async postCollaborationHandler({ payload, auth }, h) {
    const { id: owner } = auth.credentials;
    const { playlistId } = payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);

    const collaborationId = await this._collaborationsService.addCollaboration(payload);

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: { collaborationId },
    });
    response.code(201);
    return response;
  }
}

module.exports = CollaborationsHandler;
