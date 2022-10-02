const PlaylistActivitiesHandler = require('./handler');
const routes = require('./routes');

const playlistActivitiesPlugin = {
  name: 'playlistActivities',
  version: '1.0.0',
  register: async (server, { playlistActivitiesService, playlistsService }) => {
    const playlistActivitiesHandler = new PlaylistActivitiesHandler(
      playlistActivitiesService,
      playlistsService
    );
    server.route(routes(playlistActivitiesHandler));
  },
};

module.exports = playlistActivitiesPlugin;
