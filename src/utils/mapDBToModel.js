const mapSongDBToModel = ({ album_id, ...rest }) => ({
  ...rest,
  albumId: album_id,
});

const mapAlbumDBToModel = ({ cover, ...rest }) => ({
  ...rest,
  coverUrl: cover,
});

module.exports = { mapSongDBToModel, mapAlbumDBToModel };
