const { isAdminActive } = require('../service/admin/admin-account');
const createHttpError = require('http-errors');
const jwtGenerator = require('../utils/jwt_generator');
const { COOKIE_NAMES } = require('../constant');

const adminAuth = async (req, res, next) => {
  const { MEMBERSHIP_ADMIN_ACCESS: access, MEMBERSHIP_ADMIN_REFRESH: refresh } = req.cookies;
  try {
    if (!refresh) {
      throw createHttpError.Unauthorized('JWT token expired.');
    }

    const { payload } = jwtGenerator.verifyAdminAccessToken(access);
    if (payload === null) {
      const { refreshPayload } = jwtGenerator.verifyAdminRefreshToken(refresh);
      if (refreshPayload === null) {
        // removing cookie from browser if refresh token is also invalid
        res.cookie(COOKIE_NAMES.MEMBERSHIP_ADMIN_ACCESS, '', {
          expires: new Date(0)
        });
        res.cookie(COOKIE_NAMES.MEMBERSHIP_ADMIN_REFRESH, '', {
          expires: new Date(0)
        });
        throw createHttpError.Unauthorized('JWT token expired.');
      } else {
        // if refresh token is valid
        const newAccessToken = jwtGenerator.generateAdminAccessToken(refreshPayload.id);
        if (newAccessToken) {
          // setting new access cookie in response
          res.cookie(COOKIE_NAMES.MEMBERSHIP_ADMIN_ACCESS, newAccessToken, {
            httpOnly: true,
            secure: req.secure,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 10 // 10 hours
          });
          // const getAdmin = async () => {
          const getAdmin = await isAdminActive(refreshPayload?.id);
          req.admin = getAdmin;
          next();
        } else {
          throw createHttpError.Unauthorized('JWT token expired');
        }
      }
    } else {
      // calling next middleware
      const getAdmin = await isAdminActive(payload?.id);
      req.admin = getAdmin;
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = adminAuth;
