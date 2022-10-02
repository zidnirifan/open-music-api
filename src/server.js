require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

// Error Handler
const errorsPlugin = require('./api/errors');

// Albums
const albumsPlugin = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumValidator = require('./validator/albums');

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
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const playlistSongsPlugin = require('./api/playlistSongs');
const PlaylistSongsValidator = require('./validator/playlistSongs');

// Collaborations
const CollaborationsService = require('./services/postgres/CollaborationsService');
const collaborationsPlugin = require('./api/collaborations');
const CollaborationsValidator = require('./validator/collaborations');

// Playlist Activities
const PlaylistActivitiesService = require('./services/postgres/PlaylistActivitiesService');
const playlistActivitiesPlugin = require('./api/playlistActivities');

// Exports
const ProducerService = require('./services/rabbitmq/ProducerService');
const exportsPlugin = require('./api/exports');
const ExportsValidator = require('./validator/exports');

// Upload
const StorageService = require('./services/storage/StorageService');

// Cache
const CacheService = require('./services/redis/CacheService');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const playlistSongsService = new PlaylistSongsService();
  const playlistActivitiesService = new PlaylistActivitiesService();
  const storageService = new StorageService(
    path.resolve(__dirname, '../public/covers')
  );
  const cacheService = new CacheService();

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

  await server.register([
    {
      plugin: errorsPlugin,
    },
    {
      plugin: albumsPlugin,
      options: {
        albumsService,
        songsService,
        storageService,
        cacheService,
        validator: AlbumValidator,
      },
    },
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
        playlistsService,
        cacheService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: playlistSongsPlugin,
      options: {
        playlistSongsService,
        playlistsService,
        songsService,
        playlistActivitiesService,
        cacheService,
        validator: PlaylistSongsValidator,
      },
    },
    {
      plugin: collaborationsPlugin,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        cacheService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: playlistActivitiesPlugin,
      options: {
        playlistActivitiesService,
        playlistsService,
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
  ]);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
