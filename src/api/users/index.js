const UsersHandler = require('./handler');
const routes = require('./routes');

const usersPlugin = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { service }) => {
    const usersHandler = new UsersHandler(service);
    server.route(routes(usersHandler));
  },
};

module.exports = usersPlugin;
