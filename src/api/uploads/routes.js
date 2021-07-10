const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/upload/pictures',
    handler: handler.postPictureHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 500000,
      },
    },
  },
  {
    method: 'GET',
    path: '/upload/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, '../../../public'),
      },
    },
  },
];

module.exports = routes;
