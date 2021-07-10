require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
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

// Playlists
const PlaylistsService = require('./services/postgres/PlaylistsService');
const playlistsPlugin = require('./api/playlists');
const PlaylistsValidator = require('./validator/playlists');

// Playlists Songs
const PlaylistsSongsService = require('./services/postgres/PlaylistsSongsService');
const playlistsSongsPlugin = require('./api/playlistsSongs');
const PlaylistsSongsValidator = require('./validator/playlistsSongs');

// Collaborations
const CollaborationsService = require('./services/postgres/CollaborationsService');
const collaborationsPlugin = require('./api/collaborations');
const CollaborationsValidator = require('./validator/collaborations');

// Exports
const ProducerService = require('./services/rabbitmq/ProducerService');
const exportsPlugin = require('./api/exports');
const ExportsValidator = require('./validator/exports');

// Uploads
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');
const uplodsPlugin = require('./api/uploads');

// Cache
const CacheService = require('./services/redis/CacheService');

const init = async () => {
  const cacheService = new CacheService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService(cacheService);
  const playlistsService = new PlaylistsService(collaborationsService, cacheService);
  const playlistsSongsService = new PlaylistsSongsService(cacheService);
  const storageService = new StorageService(
    path.resolve(__dirname, '../public/pictures'),
  );

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
    {
      plugin: Inert,
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
    {
      plugin: playlistsPlugin,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: playlistsSongsPlugin,
      options: {
        playlistsSongsService,
        playlistsService,
        validator: PlaylistsSongsValidator,
      },
    },
    {
      plugin: collaborationsPlugin,
      options: {
        collaborationsService,
        playlistsService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: exportsPlugin,
      options: {
        producerService: ProducerService,
        playlistsService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uplodsPlugin,
      options: {
        service: storageService,
        validator: UploadsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
