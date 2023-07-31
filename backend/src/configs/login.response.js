
const currentDateTime = require('../lib/current.date.time');

const loginResponse = (res, user, maintenance) => {
  const accessToken = user.getJWTToken();
  const refreshToken = user.getJWTRefreshToken();

  // options for cookie
  const options = {
    expires: new Date(Date.now() +24 * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  res
    .status(200)
    .cookie('AccessToken', accessToken, options)
    .json({
      result_code: 0,
      time: currentDateTime(),
      maintenance_info: maintenance || null,
      access_token: accessToken,
      refresh_token: refreshToken,
      result: {
        title: 'SUCCESS',
        message: 'User login successful',
        data: {
          id: user._id,
          userName: user.userName,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          avatar: process.env.APP_BASE_URL + user.avatar,
          gender: user.gender,
          dob: user.dob,
          address: user.address,
          role: user.role,
          verified: user.verified,
          status: user.status,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
};

module.exports = loginResponse;
