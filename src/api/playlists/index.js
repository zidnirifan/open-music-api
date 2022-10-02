const PlaylistsHandler = require('./handler');
const routes = require('./routes');

const playlistsPlugin = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, { playlistsService, cacheService, validator }) => {
    const playlistsHandler = new PlaylistsHandler({
      playlistsService,
      cacheService,
      validator,
    });
    server.route(routes(playlistsHandler));
  },
};

module.exports = playlistsPlugin;
