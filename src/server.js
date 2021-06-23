require('dotenv').config();
const Hapi = require('@hapi/hapi');
const songsPlugin = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');

const init = async () => {
  const songsService = new SongsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
  });

  await server.register({
    plugin: songsPlugin,
    options: {
      service: songsService,
    },
  });

  await server.start();
  // eslint-disable-next-line no-console
  console.log(`Server running on ${server.info.uri}`);
};

init();
