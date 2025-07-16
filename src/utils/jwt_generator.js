const jwt = require('jsonwebtoken');

// user related jwt token code

const generateUserAccessToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.USER_ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: '1h'
  });

  return token;
};

const generateUserRefreshToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.USER_REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: '30d'
  });

  return token;
};

const verifyUserAccessToken = (accessToken) => {
  try {
    const decoded = jwt.verify(accessToken, process.env.USER_ACCESS_TOKEN_SECRET_KEY);
    return { payload: decoded, expired: false };
  } catch (errors) {
    return { payload: null, expired: errors.message.includes('jwt expired') };
  }
};

const verifyUserRefreshToken = (refreshToken) => {
  try {
    const docoded = jwt.verify(refreshToken, process.env.USER_REFRESH_TOKEN_SECRET_KEY);
    return { refreshPayload: docoded, expired: false };
  } catch (error) {
    return {
      refreshPayload: null,
      epxired: error.message.includes('jwt expired')
    };
  }
};

const generateAdminAccessToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.ADMIN_ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: '1h'
  });

  return token;
};

const generateAdminRefreshToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.ADMIN_REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: '1d'
  });

  return token;
};

const verifyAdminAccessToken = (accessToken) => {
  // const decoded = jwt.verify(
  //   accessToken,
  //   process.env.ADMIN_ACCESS_TOKEN_SECRET_KEY
  // );
  // console.log(decoded, "docoded");
  // return { payload: decoded, expired: false };
  try {
    const decoded = jwt.verify(accessToken, process.env.ADMIN_ACCESS_TOKEN_SECRET_KEY);
    return { payload: decoded, expired: false };
  } catch (errors) {
    // throw createHttpError.Unauthorized("jwt")
    return { payload: null, expired: errors.message.includes('jwt expired') };
  }
};

const verifyAdminRefreshToken = (refreshToken) => {
  try {
    const docoded = jwt.verify(refreshToken, process.env.ADMIN_REFRESH_TOKEN_SECRET_KEY);
    return { refreshPayload: docoded, expired: false };
  } catch (error) {
    return {
      refreshPayload: null,
      epxired: error.message.includes('jwt expired')
    };
  }
};

const jwtGenerator = {
  generateUserAccessToken,
  generateUserRefreshToken,
  generateAdminAccessToken,
  generateAdminRefreshToken,
  verifyUserAccessToken,
  verifyUserRefreshToken,
  verifyAdminAccessToken,
  verifyAdminRefreshToken
};

module.exports = jwtGenerator;
