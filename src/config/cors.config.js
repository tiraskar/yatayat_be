const corsOption = {
  origin: [
    'http://localhost:4101',
    'http://localhost:4102',
    'http://localhost:4103',

    'http://admin-membership.nagarik.services',
    'https://admin-membership.nagarik.services',

    'http://admin-membership.nagarik.services',
    'https://www.admin-membership.nagarik.services',

    'http://membership.nagarik.services',
    'https://www.membership.nagarik.services',

    'https://membership.nagarik.services',

    'https://4263-110-34-5-157.ngrok-free.app',
    '*'
  ],
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  credentials: true
};

const corsOptionThirdParty = {
  origin(origin, callback) {
    return callback(null, true);
  },
  optionsSuccessStatus: 200,
  credentials: true
};

module.exports = { corsOption, corsOptionThirdParty };
