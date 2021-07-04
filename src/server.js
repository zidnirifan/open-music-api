require('dotenv').config();
const Hapi = require('@hapi/hapi');
const songsPlugin = require('./api/songs');
const usersPlugin = require('./api/users');
const SongsService = require('./services/postgres/SongsService');
const UsersService = require('./services/postgres/UsersService');
const handleError = require('./utils/handleError');
const SongValidator = require('./validator/songs');
const UsersValidator = require('./validator/users');

const init = async () => {
  const songsService = new SongsService();
  const usersService = new UsersService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Handling error
  server.ext('onPreResponse', handleError);

  await server.register([
    {
      plugin: songsPlugin,
      options: {
        service: songsService,
        validator: SongValidator,
      },
    },
    {
      plugin: usersPlugin,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
