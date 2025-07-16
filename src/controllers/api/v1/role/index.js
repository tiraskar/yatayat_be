const RoleDTO = require('../../../../models/role/role-dto');
const RoleService = require('../../../../service/role');
const logger = require('../../../../utils/logger');

const postCreateRole = async (req, res, next) => {
  let value = RoleDTO.CreateRoleDTO.validate(req.body);

  if (value.error) {
    return res.status(422).json({
      message: 'Validation error',
      error: value.error
    });
  }

  value = value.value;

  try {
    let role = await RoleService.createRole(value);

    res.status(201).json({
      message: 'Role Created',
      role
    });
  } catch (error) {
    logger.error('Error on Role creation', error);

    res.status(500).json({
      message: 'Error on role creation'
    });
  }
};

const getRoles = async (req, res, next) => {
  try {
    let roles = await RoleService.getRoles();
    res.status(200).json({
      message: 'Roles in the system',
      roles
    });
  } catch (error) {
    logger.error('Error on getting roles', error);
    res.status(500).json({
      message: 'Error on fetching roles'
    });
  }
};

const getRoleByRoleId = async (req, res, next) => {
  let roleId = req.params.roleId;
  try {
    let role = await RoleService.getRoleByRoleId(roleId);
    res.status(200).json({
      message: 'Role details',
      role
    });
  } catch (error) {
    logger.error('Error on getting role', error);
    res.status(500).json({
      message: 'Error on fetching role'
    });
  }
};

const patchUpdateRole = async (req, res, next) => {
  let roleId = req.params.roleId; // this is not the login admin
  // but the id of admin whose role is to set

  let value = RoleDTO.CreateRoleDTO.validate(req.body, {
    abortEarly: false
  });

  if (value.error) {
    return res.status(422).json({
      message: 'validation Error',
      error: value.error
    });
  }

  value = value.value;

  try {
    let role = await RoleService.patchUpdateRole(roleId, value);

    return res.status(200).json({
      message: 'Role Updated',
      role
    });
  } catch (error) {
    logger.error('Error on updating role', error);

    return res.status(500).json({
      message: 'Error on updating role '
    });
  }
};

const getRoleById = (req, res, next) => {};

module.exports = {
  postCreateRole,
  getRoles,
  getRoleByRoleId,
  patchUpdateRole,
  getRoleById
};
