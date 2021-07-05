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

  pgm.addConstraint(
    'playlists_songs',
    'unique_playlist_id_and_song_id',
    'UNIQUE(playlist_id, song_id)',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('playlists_songs');
};
