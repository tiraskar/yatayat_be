const express = require('express');
const multer = require('multer');
const path = require('path');

const adminAuth = require('../../../auth/admin-auth');
const EmailService = require('../../../service/email');

const adminController = require('../../../controllers/api/v1/admin');
const dashboardController = require('../../../controllers/api/v1/dashboard');

const uploadHandler = require('../../../utils/uploadHandler');

const router = express.Router();

const upload = multer({ dest: path.join(__dirname, '../../../uploads') });

const hasPermission = require('../../../auth/has-permission');

const { ASSIGN_ROLE, EDIT_ADMIN } = require('../../../models/permission');

router.post('/', uploadHandler.individual.single('profile'), adminController.postCreateAdmin);

router.get('/', adminAuth, adminController.getAdmins);

router.post('/login', adminController.postLoginAdmin);

router.get('/me', adminAuth, adminController.getAdminProfile);

router.get('/:adminId/details', adminAuth, adminController.getAdminDetailsById);

router.patch('/:adminId', adminAuth, hasPermission(EDIT_ADMIN), adminController.patchUpdateAdmin);

router.patch(
  '/',
  adminAuth,
  uploadHandler.individual.single('profile'),
  adminController.patchUpdateProfile
);

router.patch(
  '/:adminId/role',
  adminAuth,
  hasPermission(ASSIGN_ROLE),
  adminController.patchAssignRole
);

router.post('/email/verify', adminAuth, adminController.postRequestForEmailVerification);
router.put('/email/verify', adminAuth, adminController.putVerifyEmail);
router.post('/password/reset', adminController.postRequestForForgetPassword);
router.put('/password/reset', adminController.putResetPassword);

router.get('/users', adminAuth, adminController.getUsers);
router.get('/users/:user_id', adminAuth, adminController.getUser);
router.patch('/users/:user_id', adminAuth, adminController.updateUser);

router.get('/search_user', adminAuth, adminController.getUsersSearch);

router.delete('/user', adminAuth, adminController.deleteUser);

router.get('/settings', adminAuth, adminController.getSetting);
router.patch('/settings/:setting_id', adminAuth, adminController.updateSetting);

router.get('/dashboard', dashboardController.getDashboardData);

router.post('/bulk/upload', adminAuth, upload.single('file'), adminController.handleBulkUpload);

router.get('/test/api', (req, res, next) => {
  const data = {
    emails: 'device.test.app123@gmail.com',
    subject: 'Testing email from Memebership',
    message: 'This is the avendi Memebership.'
  };
  const response = EmailService.sendMail(data);
  res.status(200).json({
    message: 'Admin api called!',
    response
  });
});

module.exports = router;
