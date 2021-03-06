/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'CHAR(25)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(120)',
      notNull: true,
    },
    owner: {
      type: 'CHAR(21)',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlists');
};
