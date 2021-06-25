/* eslint-disable camelcase */
const mapDBToModel = (data) => {
  const { inserted_at: insertedAt, updated_at: updatedAt, ...rest } = data;
  return {
    ...rest,
    insertedAt,
    updatedAt,
  };
};

module.exports = mapDBToModel;
