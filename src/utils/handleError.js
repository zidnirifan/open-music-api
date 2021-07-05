const ClientError = require('../exceptions/ClientError');

const handleError = ({ response }, h) => {
  if (response instanceof ClientError) {
    const { message, statusCode } = response;
    const responseError = h.response({
      status: 'fail',
      message,
    });
    responseError.code(statusCode);
    return responseError;
  }

  if (response instanceof Error && response.output.statusCode === 500) {
    const responseError = {
      status: 'fail',
      message: 'Maaf, terjadi kegagalan pada server kami.',
    };

    console.error(response);
    return responseError;
  }

  return response.continue || response;
};

module.exports = handleError;
