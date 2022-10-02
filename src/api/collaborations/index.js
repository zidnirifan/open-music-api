const CollaborationsHandler = require('./handler');
const routes = require('./routes');

const collaborationsPlugin = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (
    server,
    {
      collaborationsService,
      playlistsService,
      usersService,
      cacheService,
      validator,
    }
  ) => {
    const collaborationsHandler = new CollaborationsHandler({
      collaborationsService,
      playlistsService,
      usersService,
      cacheService,
      validator,
    });
    server.route(routes(collaborationsHandler));
  },
};

module.exports = collaborationsPlugin;
