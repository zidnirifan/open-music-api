const AlbumsHandler = require('./handler');
const routes = require('./routes');

const albumsPlugin = {
  name: 'albums',
  version: '1.0.0',
  register: async (
    server,
    { albumsService, songsService, storageService, cacheService, validator }
  ) => {
    const albumsHandler = new AlbumsHandler({
      albumsService,
      songsService,
      storageService,
      cacheService,
      validator,
    });
    server.route(routes(albumsHandler));
  },
};

module.exports = albumsPlugin;
