const ClientError = require('../exceptions/ClientError');

const handlerCatchError = (error, h) => {
  if (error instanceof ClientError) {
    const { message, statusCode } = error;
    const response = h.response({
      status: 'fail',
      message,
    });
    response.code(statusCode);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Maaf, terjadi kegagalan pada server kami.',
  });

  response.code(500);
  console.error(error);
  return response;
};

module.exports = handlerCatchError;
