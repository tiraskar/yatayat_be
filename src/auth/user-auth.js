const createHttpError = require('http-errors');
const jwtGenerator = require('../utils/jwt_generator');
const UserAccountService = require('../service/user/user-account');
const { COOKIE_NAMES } = require('../constant');

const userAuth = async (req, res, next) => {
  const { MEMBERSHIP_USER_ACCESS: access, MEMBERSHIP_USER_REFRESH: refresh } = req.cookies;
  try {
    if (!refresh) {
      throw createHttpError.Forbidden('JWT token expired.');
    }

    const { payload } = jwtGenerator.verifyUserAccessToken(access);
    if (payload === null) {
      const { refreshPayload } = jwtGenerator.verifyUserRefreshToken(refresh);

      if (refreshPayload === null) {
        // removing cookie from browser if refresh token is also invalid
        res.cookie(COOKIE_NAMES.MEMBERSHIP_USER_ACCESS, '', {
          expires: new Date(0)
        });
        res.cookie(COOKIE_NAMES.MEMBERSHIP_USER_REFRESH, '', {
          expires: new Date(0)
        });
        throw createHttpError.Forbidden('JWT token expired.');
      } else {
        // if refresh token is valid
        const newAccessToken = jwtGenerator.generateUserAccessToken(refreshPayload.id);
        if (newAccessToken) {
          // setting new access cookie in response
          res.cookie(COOKIE_NAMES.MEMBERSHIP_USER_ACCESS, newAccessToken, {
            httpOnly: true,
            secure: req.secure,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
          });
          // req.user = { _id: refreshPayload.id };
          req.user = await UserAccountService.userDetailsById(refreshPayload.id);
          next();
        } else {
          throw createHttpError.Forbidden('JWT token expired');
        }
      }
    } else {
      // calling next middleware
      // req.user = { _id: payload.id };
      req.user = await UserAccountService.userDetailsById(payload.id);
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = userAuth;
