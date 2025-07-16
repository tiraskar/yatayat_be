const fetch = require('node-fetch');

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const redirectURL = `${process.env.BACKEND_URL}/api/v1/user/auth/google/callback`;

const getAuthURL = () => {
  return (
    `${GOOGLE_AUTH_URL}?client_id=${GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${redirectURL}` +
    `&response_type=code` +
    `&scope=email profile` +
    `&access_type=offline`
  );
};

const fetchUser = async (code) => {
  const body = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: redirectURL,
    grant_type: 'authorization_code',
    code
  }).toString();

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body
  });

  const data = await response.json();

  const { access_token } = data;

  const userResponse = await fetch(GOOGLE_USER_INFO_URL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}` // Add the access token to the authorization header
    }
  });

  // Parse the user info response
  const googleUser = await userResponse.json();

  return googleUser;
};

module.exports = {
  getAuthURL,
  fetchUser
};
