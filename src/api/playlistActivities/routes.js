const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{playlistId}/activities',
    handler: handler.getActivitiesHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
];

module.exports = routes;
