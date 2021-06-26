/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'CHAR(21)',
      primariKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'SMALLINT',
      notNull: true,
    },
    performer: {
      type: 'VARCHAR(70)',
      notNull: true,
    },
    genre: {
      type: 'VARCHAR(30)',
      notNull: true,
    },
    duration: {
      type: 'INTEGER',
      notNull: true,
    },
    inserted_at: {
      type: 'TIMESTAMP',
      notNull: true,
    },
    updated_at: {
      type: 'TIMESTAMP',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
