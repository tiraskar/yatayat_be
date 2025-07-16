// user controller that is to be performed by admin
const logger = require('../../../../utils/logger');
const UserAdminService = require('../../../../service/user/user-admin');
const createHttpError = require('http-errors');

const getUsers = async (req, res, next) => {
  let limit = req.query.limit || 50;
  let getOffSet = req.query.offset || 1;
  const offset = getOffSet - 1;

  let total = await UserAdminService.getTotalUserCount({});
  let users = await UserAdminService.getUsers({
    limit,
    offset
  });

  res.status(200).json({
    message: 'Users',
    total,
    users
  });
};

const getUserByQuery = async (req, res, next) => {
  let query = req.query.query;

  let users = await UserAdminService.getUserByQuery(query);

  res.status(200).json({
    message: 'Users by search',
    users
  });
};

const getUserDetail = async (req, res, next) => {
  let userId = req.params.userId;

  let user = await UserAdminService.getUserById(userId);

  res.status(200).json({
    message: 'Users Profile',
    user
  });
};

const getAllUser = async (req, res, next) => {
  try {
    const users = await UserAdminService.getAllUsers();
    console.log(users, 'users');
    res.status(200).json({ users });
  } catch (error) {
    // console.log("helo");
    next(error);
    // return res.status(400).json({ message: "Failed to get user" });
  }
};

const userAdminController = {
  getUsers,
  getUserByQuery,
  getUserDetail,
  getAllUser
};

module.exports = userAdminController;
