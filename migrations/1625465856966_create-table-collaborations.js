/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'CHAR(23)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'CHAR(25)',
      notNull: true,
      references: '"playlists"',
      onDelete: 'cascade',
    },
    user_id: {
      type: 'CHAR(21)',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint(
    'collaborations',
    'unique_playlist_id_and_user_id',
    'UNIQUE(playlist_id, user_id)',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};
