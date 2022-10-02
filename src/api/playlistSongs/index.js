const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

const playlistSongsPlugin = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (
    server,
    {
      playlistSongsService,
      playlistsService,
      songsService,
      playlistActivitiesService,
      cacheService,
      validator,
    }
  ) => {
    const playlistSongsHandler = new PlaylistSongsHandler({
      playlistSongsService,
      playlistsService,
      songsService,
      playlistActivitiesService,
      cacheService,
      validator,
    });
    server.route(routes(playlistSongsHandler));
  },
};

module.exports = playlistSongsPlugin;
