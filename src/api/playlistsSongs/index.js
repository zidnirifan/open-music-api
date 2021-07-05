const PlaylistsSongsHandler = require('./handler');
const routes = require('./routes');

const playlistsSongsPlugin = {
  name: 'playlistsSongs',
  version: '1.0.0',
  register: async (server, { playlistsSongsService, playlistsService }) => {
    const playlistsSongsHandler = new PlaylistsSongsHandler(
      playlistsSongsService,
      playlistsService,
    );
    server.route(routes(playlistsSongsHandler));
  },
};

module.exports = playlistsSongsPlugin;
