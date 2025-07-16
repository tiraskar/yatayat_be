const express = require('express');
const adminAuth = require('../../../auth/admin-auth');
const hasPermission = require('../../../auth/has-permission');

const roleController = require('../../../controllers/api/v1/role');
const rolePermissionController = require('../../../controllers/api/v1/role/permission');
const {
  CREATE_ROLE,
  VIEW_ROLE,
  EDIT_ROLE,
  VIEW_PERMISSION
} = require('../../../models/permission');

const router = express.Router();

router.post('/', adminAuth, hasPermission(CREATE_ROLE), roleController.postCreateRole);

router.get('/', adminAuth, hasPermission(VIEW_ROLE), roleController.getRoles);

router.get('/:roleId/details', adminAuth, hasPermission(VIEW_ROLE), roleController.getRoleByRoleId);

router.patch('/:roleId', adminAuth, hasPermission(EDIT_ROLE), roleController.patchUpdateRole);

router.get(
  '/permission',
  adminAuth,
  hasPermission(VIEW_PERMISSION),
  rolePermissionController.getPermissions
);

module.exports = router;
