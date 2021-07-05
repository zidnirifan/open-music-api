const CollaborationsHandler = require('./handler');
const routes = require('./routes');

const collaborationsPlugin = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { collaborationsService, playlistsService }) => {
    const collaborationsHandler = new CollaborationsHandler(
      collaborationsService,
      playlistsService,
    );
    server.route(routes(collaborationsHandler));
  },
};

module.exports = collaborationsPlugin;
