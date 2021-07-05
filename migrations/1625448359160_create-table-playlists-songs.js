/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlists_songs', {
    id: {
      type: 'CHAR(20)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'CHAR(25)',
      notNull: true,
      references: '"playlists"',
      onDelete: 'cascade',
    },
    song_id: {
      type: 'CHAR(21)',
      notNull: true,
      references: '"songs"',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlists_songs');
};
