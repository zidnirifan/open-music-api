require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const handleError = require('./utils/handleError');

// Songs
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');
const songsPlugin = require('./api/songs');

// Users
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');
const usersPlugin = require('./api/users');

// Authentications
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const authenticationsPlugin = require('./api/authentications');
const TokenManager = require('./Tokenize/TokenManager');
const AuthenticationValidator = require('./validator/authentications');

const init = async () => {
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('open_music_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // Handling error
  server.ext('onPreResponse', handleError);

  await server.register([
    {
      plugin: songsPlugin,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: usersPlugin,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authenticationsPlugin,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
