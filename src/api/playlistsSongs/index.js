const PlaylistsSongsHandler = require('./handler');
const routes = require('./routes');

const playlistsSongsPlugin = {
  name: 'playlistsSongs',
  version: '1.0.0',
  register: async (server, { playlistsSongsService, playlistsService, validator }) => {
    const playlistsSongsHandler = new PlaylistsSongsHandler(
      playlistsSongsService,
      playlistsService,
      validator,
    );
    server.route(routes(playlistsSongsHandler));
  },
};

module.exports = playlistsSongsPlugin;
