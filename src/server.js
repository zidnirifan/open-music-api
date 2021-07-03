require('dotenv').config();
const Hapi = require('@hapi/hapi');
const songsPlugin = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const handleError = require('./utils/handleError');
const SongValidator = require('./validator');

const init = async () => {
  const songsService = new SongsService();

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

  await server.register({
    plugin: songsPlugin,
    options: {
      service: songsService,
      validator: SongValidator,
    },
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
