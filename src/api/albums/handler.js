const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor({
    albumsService,
    songsService,
    storageService,
    cacheService,
    validator,
  }) {
    this._albumsService = albumsService;
    this._songsService = songsService;
    this._storageService = storageService;
    this._cacheService = cacheService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler({ payload }, h) {
    this._validator.validateAlbumPayload(payload);

    const albumId = await this._albumsService.addAlbum(payload);

    return h
      .response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumId,
        },
      })
      .code(201);
  }

  async getAlbumByIdHandler({ params }) {
    const { id } = params;

    const album = await this._albumsService.getAlbumById(id);
    const songs = await this._songsService.getSongsByAlbumId(id);

    return {
      status: 'success',
      data: {
        album: {
          ...album,
          songs,
        },
      },
    };
  }

  async putAlbumByIdHandler({ payload, params }, h) {
    this._validator.validateAlbumPayload(payload);
    const { id } = params;

    await this._albumsService.editAlbumById(id, payload);

    return h.response({
      status: 'success',
      message: 'Album berhasil diperbarui',
    });
  }

  async deleteAlbumByIdHandler({ params }) {
    const { id } = params;
    await this._albumsService.deleteAlbumById(id);
    await this._cacheService.delete(`likes_count:${id}`);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postCoverHandler({ payload, params }, h) {
    const { cover } = payload;
    const { id } = params;
    this._validator.validateCoverAlbumHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/albums/covers/${filename}`;

    await this._albumsService.editCoverAlbum(id, coverUrl);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }

  async likeUnlikeAlbumHandler({ params, auth }, h) {
    const { id: albumId } = params;
    const { id: userId } = auth.credentials;

    await this._albumsService.isAlbumExist(albumId);
    const isAlbumLiked = await this._albumsService.isAlbumLiked(
      albumId,
      userId
    );

    let message;

    if (isAlbumLiked) {
      await this._albumsService.unlikeAlbum(albumId, userId);
      message = 'Batal menyukai album';
    } else {
      await this._albumsService.likeAlbum(albumId, userId);
      message = 'Berhasil menyukai album';
    }

    await this._cacheService.delete(`likes_count:${albumId}`);

    return h
      .response({
        status: 'success',
        message,
      })
      .code(201);
  }

  async getLikesCountHandler({ params }, h) {
    const { id } = params;

    try {
      const likes = await this._cacheService.get(`likes_count:${id}`);

      return h
        .response({
          status: 'success',
          data: { likes: JSON.parse(likes) },
        })
        .header('X-Data-Source', 'cache');
    } catch {
      const likes = await this._albumsService.getLikesCountByAlbumId(id);
      await this._cacheService.set(`likes_count:${id}`, JSON.stringify(likes));

      return {
        status: 'success',
        data: { likes },
      };
    }
  }
}

module.exports = AlbumsHandler;
