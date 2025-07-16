const AdminDTO = require('../../../../models/admin/admin-dto');
const AdminAccountService = require('../../../../service/admin/admin-account');
const AdminRoleService = require('../../../../service/admin/admin-role');
const logger = require('../../../../utils/logger');
const { COOKIE_NAMES, plainResponseMessages, DynamicMessages } = require('../../../../constant');
const createHttpError = require('http-errors');
const OTPRequestService = require('../../../../service/otp-request');
const OTPRequestDTO = require('../../../../models/otp-request/otp-request-dto');

const postCreateAdmin = async (req, res, next) => {
  try {
    let value = AdminDTO.CreateAdminDTO.validate(req.body, {
      abortEarly: false
    });

    if (value.error) {
      throw createHttpError.UnprocessableEntity(plainResponseMessages.validationEror);
    }

    value = value.value;

    let phoneOrEmailUsed = await AdminAccountService.phoneOrEmailAlreadyUsed(value);

    if (phoneOrEmailUsed) {
      if (phoneOrEmailUsed.email == value.email) {
        throw createHttpError.Conflict(
          DynamicMessages.alreadyExistMessage('Account with this email')
        );
      }
    }

    let response;

    let profile;
    if (req.file) {
      profile = req.file.path;
    }

    response = await AdminAccountService.createAdmin({ profile, ...value });

    const newResponse = { ...response };
    delete newResponse?.access;
    delete newResponse?.refresh;

    res.cookie(COOKIE_NAMES.MEMBERSHIP_ADMIN_REFRESH, response.refresh, {
      httpOnly: true,
      secure: req.secure,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 10
    });

    res.cookie(COOKIE_NAMES.MEMBERSHIP_ADMIN_ACCESS, response.access, {
      httpOnly: true,
      secure: req.secure,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 10
    });

    res.status(201).json({
      message: 'Account created successfully.'
    });
  } catch (error) {
    logger.error('Error on Admin Creation', error);
    next(error);
  }
};

const postLoginAdmin = async (req, res, next) => {
  let value = AdminDTO.AdminLoginDTO.validate(req.body);

  try {
    if (value.error) {
      throw createHttpError.UnprocessableEntity(plainResponseMessages.validationEror);
    }

    value = value.value;

    let response;
    response = await AdminAccountService.adminLogin(value);

    if (!response) {
      throw createHttpError.NotFound(plainResponseMessages.invalidCredentials);
    }

    const newResponse = { ...response };
    delete newResponse?.access;
    delete newResponse?.refresh;

    res.cookie(COOKIE_NAMES.MEMBERSHIP_ADMIN_REFRESH, response.refresh, {
      httpOnly: true,
      secure: req.secure,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 10
    });

    res.cookie(COOKIE_NAMES.MEMBERSHIP_ADMIN_ACCESS, response.access, {
      httpOnly: true,
      secure: req.secure,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 10
    });

    res.status(201).json({
      message: 'Login Succeed.',
      data: {
        permissions: response.permissions,
        emailVerified: response.emailVerified,
        isActive: response.isActive,
        isSuperAdmin: response.isSuperAdmin,
      }
    });
  } catch (error) {
    logger.error('Error on Logging Admin', error);
    next(error);
  }
};

const getAdmins = async (req, res, next) => {
  try {
    let admins = await AdminAccountService.getAdmins();

    return res.status(200).json({
      message: 'Admins in the system',
      admins
    });
  } catch (error) {
    logger.error('Error on getting admins', error);
    next(error);
  }
};

const getAdminProfile = async (req, res, next) => {
  try {
    let adminId = req.admin._id;

    let admin = await AdminAccountService.adminDetailsById(adminId);

    res.status(200).json({
      message: 'Admin Profile',
      admin
    });
  } catch (error) {
    next(error);
  }
};

const getAdminDetailsById = async (req, res, next) => {
  try {
    let adminId = req.params.adminId;

    let admin = await AdminAccountService.adminDetailsById(adminId);

    res.status(200).json({
      message: 'Admin Details',
      admin
    });
  } catch (error) {
    next(error);
  }
};

const patchUpdateAdmin = async (req, res, next) => {
  try {
    let adminId = req.params.adminId;
    // but the id of admin whose role is to set

    let value = AdminDTO.UpdateAdminDTO.validate(req.body, {
      abortEarly: false
    });

    if (value.error) {
      throw createHttpError.UnprocessableEntity(value.error.message);
    }

    value = value.value;

    let roleId = value.roleId;

    let admin = await AdminAccountService.updateAdmin(adminId, value, roleId);

    return res.status(200).json({
      message: 'Admin Updated',
      admin
    });
  } catch (error) {
    logger.error('Error on updaing admin', error);
    next(error);
  }
};

const patchUpdateProfile = async (req, res, next) => {
  try {
    let adminId = req.admin._id;
    // but the id of admin whose role is to set

    let value = AdminDTO.UpdateAdminDTO.validate(req.body, {
      abortEarly: false
    });

    if (value.error) {
      throw createHttpError.UnprocessableEntity(value.error.message);
    }

    value = value.value;

    let roleId = value.roleId;

    let profile;
    if (req.file) {
      profile = req.file.path;
    }

    let admin = await AdminAccountService.patchUpdateProfile(adminId, value, roleId, profile);

    return res.status(200).json({
      message: 'Account Updated',
      admin
    });
  } catch (error) {
    logger.error('Error on updaing account', error);
    next(error);
  }
};

const patchAssignRole = async (req, res, next) => {
  try {
    let adminId = req.params.adminId; // this is not the login admin
    // but the id of admin whose role is to set

    let value = AdminDTO.AssignRoleDTO.validate(req.body);

    if (value.error) {
      throw createHttpError.UnprocessableEntity(plainResponseMessages.validationEror);
    }

    value = value.value;

    let roleId = value.roleId;

    let admin = await AdminRoleService.assignRoleToAdmin(adminId, roleId);

    return res.status(200).json({
      message: 'Role Assigned to admin',
      admin
    });
  } catch (error) {
    logger.error('Error on assigning role to Admin', error);
    next(error);
  }
};

const postRequestForEmailVerification = async (req, res, next) => {
  const adminId = req.admin._id;

  try {
    // let's first check if the phone us unverified first
    let adminEmailIsNotYetVerified = await AdminAccountService.AdminEmailIsUnverified(adminId);

    logger.debug('post request for email verification', adminEmailIsNotYetVerified);

    if (!adminEmailIsNotYetVerified) {
      throw createHttpError.Unauthorized('Your email is already verified.');
    }

    const response = await OTPRequestService.sendEmailOTPToAdmin(adminId, 'EMAIL_VERIFICATION');

    if (response.status === '400') {
      res.status(400).json({
        message: response.message
      });
    } else {
      res.status(response.status).json({
        message: response.message
      });
    }
  } catch (error) {
    next(error);
  }
};

const putVerifyEmail = async (req, res, next) => {
  const adminId = req.admin._id;

  try {
    let value = OTPRequestDTO.EmailOTPVerifyDTO.validate(req.body, {
      abortEarly: false
    });

    if (value.error) {
      throw createHttpError.UnprocessableEntity(plainResponseMessages.invalidRequest);
    }

    value = value.value;

    let theClientCode = req.body.code;

    let code = await OTPRequestService.getCodeForAdminByToken(value.token, 'EMAIL_VERIFICATION');

    if (!code) {
      throw createHttpError.Unauthorized('Invalid Code, please request for email once again');
    }

    if (code != theClientCode) {
      throw createHttpError.Unauthorized('Invalid Code, code did not matched');
    }

    await AdminAccountService.setAdminEmailVerified(adminId);

    res.status(200).json({
      message: 'Email Address Verified'
    });
  } catch (error) {
    next(error);
  }

  //
};

const postRequestForForgetPassword = async (req, res, next) => {
  // if the email / phonenumber exist in the system,
  // send SMS / email

  const signature = req.query.signature;

  try {
    let value = OTPRequestDTO.ForgetPasswordDTO.validate(req.body, {
      abortEarly: false
    });

    if (value.error) {
      throw createHttpError.UnprocessableEntity(plainResponseMessages.invalidRequest);
    }

    let email = req.body.email;

    if (email) {
      let accountExist = await AdminAccountService.emailAlreadyUsed(email);

      if (!accountExist) {
        return res.status(200).json({
          message: 'Instruction to reset password will be sent to the account if the account exists'
        });
      }

      const response = await OTPRequestService.sendEmailOTPToAdmin(
        accountExist._id,
        'PASSWORD_RESET_EMAIL'
      );

      if (response.status === '400') {
        res.status(400).json({
          message: response.message
        });
      } else {
        res.status(response.status).json({
          message: `We have sent an email to: ${response.email} with the password reset instruction.`
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

const putResetPassword = async (req, res, next) => {
  // verify the token and change the password
  let value = OTPRequestDTO.ResetPasswordDTO.validate(req.body, {
    abortEarly: false
  });

  try {
    if (value.error) {
      throw createHttpError.UnprocessableEntity(plainResponseMessages.invalidRequest);
    }

    let theClientCode = req.body.code;
    // let email = req.body.email;
    // let userName = req.body.userName;
    let token = req.body.token;

    let theAdminId;
    let code;
    let codeType;

    if (token) {
      theAdminId = await OTPRequestService.getAdminIdByToken(token);
      codeType = 'PASSWORD_RESET_EMAIL';
    }

    if (!theAdminId) {
      throw createHttpError.BadRequest('Invalid request');
    }

    code = await OTPRequestService.getCodeForAdmin(theAdminId, codeType);

    if (!code) {
      throw createHttpError.Unauthorized('Invalid Code, please request for OTP once again');
    }

    logger.debug('change password', {
      code,
      theAdminId,
      theClientCode
    });

    if (code != theClientCode) {
      throw createHttpError.Unauthorized('Invalid Code, code did not matched');
    }

    let password = req.body.password;

    await AdminAccountService.setAdminPassword(theAdminId, password);

    res.status(200).json({
      message:
        'We’ve successfully reset your password. Please return to the login page to proceed further.'
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    let admins = await AdminAccountService.getUsers(page, limit);

    return res.status(200).json({
      message: 'Users in the system',
      admins
    });
  } catch (error) {
    logger.error('Error on getting users', error);
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    let user = await AdminAccountService.getUser(req.params.user_id);

    return res.status(200).json({
      message: 'User in the system',
      user
    });
  } catch (error) {
    logger.error('Error on getting users', error);
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    let user = await AdminAccountService.updateUser(req.params.user_id, req.body);

    return res.status(200).json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    logger.error('Error on getting users', error);
    next(error);
  }
};

const getSetting = async (req, res, next) => {
  try {
    let setting = await AdminAccountService.getSetting();

    return res.status(200).json({
      message: 'Settings fetched successfully',
      setting
    });
  } catch (error) {
    logger.error('Error on fetching settings', error);
    next(error);
  }
};

const updateSetting = async (req, res, next) => {
  try {
    let setting = await AdminAccountService.updateSetting(req.params.setting_id, req.body);

    return res.status(200).json({
      message: 'Settings fetched successfully',
      setting
    });
  } catch (error) {
    logger.error('Error on fetching settings', error);
    next(error);
  }
};

const handleBulkUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let file = req.file;

    const response = await AdminAccountService.bulkUpload(file);

    return res.status(200).json({
      message: response?.message,
      success: response?.success
    });
  } catch (error) {
    logger.error('Error on fetching settings', error);
    next(error);
  }
};

const getUsersSearch = async (req, res, next) => {

  try {
    let query = req.query.query;

    let admins = await AdminAccountService.getUsersSearch(query);
    return res.status(200).json({
      message: 'Users in the system',
      admins
    });

  } catch (error) {
    logger.error('Error on fetching settings', error);
    next(error);
  }
}

const deleteUser = async (req, res, next) => {
  try {
    let { userId } = req.query;
    await AdminAccountService.deleteUser(userId);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Error on deleting user', error);
    next(error);
  }
}

module.exports = {
  postCreateAdmin,
  postLoginAdmin,
  getAdminProfile,
  patchAssignRole,
  getAdmins,
  patchUpdateProfile,
  patchUpdateAdmin,
  getAdminDetailsById,
  postRequestForEmailVerification,
  putVerifyEmail,
  postRequestForForgetPassword,
  putResetPassword,
  getUsers,
  getUser,
  updateUser,
  getSetting,
  updateSetting,
  handleBulkUpload,
  getUsersSearch,
  deleteUser
};
