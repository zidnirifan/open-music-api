const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: handler.postExportPlaylistSongsHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
];

module.exports = routes;
