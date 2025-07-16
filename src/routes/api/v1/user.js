const express = require('express');

const adminAuth = require('../../../auth/admin-auth');
const hasPermission = require('../../../auth/has-permission');
const userAuth = require('../../../auth/user-auth');

const userController = require('../../../controllers/api/v1/user');
const userAdminController = require('../../../controllers/api/v1/user/user-admin');
const { VIEW_USER_LIST, VIEW_USER_DETAILS } = require('../../../models/permission');

const router = express.Router();

router.post('/', userController.postCreateUser);

router.put('/', userAuth, userController.updateUser);

router.post('/line-auth', userController.postLineAuth);

router.post('/login', userController.postLoginUser);

router.post('/email/verify', userAuth, userController.postRequestForEmailVerification);

router.put('/email/verify', userAuth, userController.putVerifyEmail);

router.post('/password/reset', userController.postRequestForForgetPassword);

router.put('/password/reset', userController.putResetPassword);

router.get('/me', userAuth, userController.getUserProfile);

router.put('/resend_email', userAuth, userController.resendEmail);

router.get('/my-orders', userAuth, userController.getMyOrders);

// admins

router.get('/admin/', adminAuth, hasPermission(VIEW_USER_LIST), userAdminController.getUsers);

router.get(
  '/admin/search/',
  adminAuth,
  hasPermission(VIEW_USER_LIST),
  userAdminController.getUserByQuery
);

router.get(
  '/admin/get-all-users',
  adminAuth,
  hasPermission(VIEW_USER_DETAILS),
  userAdminController.getAllUser
);

router.get(
  '/admin/:userId',
  adminAuth,
  hasPermission(VIEW_USER_DETAILS),
  userAdminController.getUserDetail
);

router.get('/auth/google', userController.googleLogin);
router.get('/auth/google/callback', userController.googleLoginCallBack);

router.patch('/password/update', userAuth, userController.updatePassword);

router.get('/apply-membership', userAuth, userController.canApplyMembership);

module.exports = router;
