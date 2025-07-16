const hasPermission = (permission) => {
  return function (req, res, next) {
    if (
      req.admin.role &&
      req.admin.role.permissions &&
      req.admin.role.permissions.includes(permission)
    ) {
      next();
    } else {
      return res.status(403).json({
        message: "You don't have sufficient permission to perform this action.",
      });
    }
  };
};

module.exports = hasPermission;
