const { successResponse, errorResponse } = require('../configs/app.response');

function defaultController(_req, res) {
  try {
    res.status(200).json(successResponse(
      0,
      'SUCCESS',
      'Hotel Booking Backend'
    ));
  } catch (error) {
    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      error
    ));
  }
}

module.exports = defaultController;
