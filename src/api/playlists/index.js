const PlaylistsHandler = require('./handler');
const routes = require('./routes');

const playlistsPlugin = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, { service }) => {
    const playlistsHandler = new PlaylistsHandler(service);
    server.route(routes(playlistsHandler));
  },
};

module.exports = playlistsPlugin;
