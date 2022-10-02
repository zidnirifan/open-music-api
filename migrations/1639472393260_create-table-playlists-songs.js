exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(30)',
      notNull: true,
      references: '"playlists"',
      onDelete: 'cascade',
    },
    song_id: {
      type: 'VARCHAR(30)',
      notNull: true,
      references: '"songs"',
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint(
    'playlist_songs',
    'unique_playlist_id_and_song_id',
    'UNIQUE(playlist_id, song_id)'
  );
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
