/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'CHAR(25)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(70)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(70)',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlists');
};
