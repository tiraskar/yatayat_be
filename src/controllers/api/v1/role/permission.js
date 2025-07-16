const permissions = require("../../../../models/permission");

const getPermissions = (req, res, next) => {
  res.status(200).json({
    message: "Permissions",
    permissions,
  });
};

module.exports = {
  getPermissions,
};
