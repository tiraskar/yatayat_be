const axios = require('axios');
const jwt = require('jsonwebtoken');

const UserDTO = require('../../../../models/user/user-dto');
const UserAccountService = require('../../../../service/user/user-account');
const logger = require('../../../../utils/logger');
const OTPRequestService = require('../../../../service/otp-request');
const OTPRequestDTO = require('../../../../models/otp-request/otp-request-dto');
const EmailService = require('../../../../service/email');
const { COOKIE_NAMES, plainResponseMessages, DynamicMessages } = require('../../../../constant');
const createHttpError = require('http-errors');
const jwtGenerator = require('../../../../utils/jwt_generator');
const secretVariable = require('../../../../constant/secretVariable');
const { response } = require('express');

const postCreateUser = async (req, res, next) => {
  console.log('sssss called for the signup');
  try {
    let value = UserDTO.CreateUserDTO.validate(req.body, {
      abortEarly: false
    });

    if (value.error) {
      throw createHttpError.UnprocessableEntity(value.error?.message);
    }

    value = value.value;

    let phoneOrEmailUsed = await UserAccountService.phoneOrEmailAlreadyUsed(value);

    console.log(phoneOrEmailUsed, 'phoneEmailUsed');

    // if (phoneUsed) {
    // 	// attempt to make same as validation error
    // 	return res.status(409).json({
    // 		message: 'phoneNumber already used',
    // 		error: {
    // 			_original: value,
    // 			details: [
    // 				{
    // 					message: 'phoneNumber already used',
    // 					path: ['phoneNumber'],
    // 					type: 'string.conflict',
    // 					context: {
    // 						value: value.phoneNumber,
    // 						label: 'phoneNumber',
    // 						key: 'phoneNumber'
    // 					}
    // 				}
    // 			]
    // 		}
    // 	});
    // }

    if (phoneOrEmailUsed) {
      // console.log(phoneOrEmailUsed, "Phone email used.");
      // if (phoneOrEmailUsed.phoneNumber == value.phoneNumber) {
      //   throw createHttpError.Conflict(
      //     DynamicMessages.alreadyExistMessage("User with this phone number")
      //   );
      // }
      // if (phoneOrEmailUsed.email == value.email) {
      //   throw createHttpError.Conflict(
      //     DynamicMessages.alreadyExistMessage("User with this email")
      //   );
      // }

      if (phoneOrEmailUsed.email == value.email) {
        throw createHttpError.Conflict(DynamicMessages.alreadyExistMessage('Email'));
      }
    }

    let user;

    // call service to create user with value.
    user = await UserAccountService.createUser(value);

    //set email as verified for now
    await UserAccountService.setUserEmailVerified(user.id);

    const getRefreshToken = jwtGenerator.generateUserAccessToken(user?._id);

    const getAccessToken = jwtGenerator.generateUserAccessToken(user?._id);

    res.cookie(COOKIE_NAMES.MEMBERSHIP_USER_REFRESH, getRefreshToken, {
      httpOnly: true,
      secure: req.secure,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30
    });

    res.cookie(COOKIE_NAMES.MEMBERSHIP_USER_ACCESS, getAccessToken, {
      httpOnly: true,
      secure: req.secure,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30
    });

    res.status(201).json({
      message: 'User created.'
    });
  } catch (error) {
    logger.error('Error on User Creation', error);
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = req.user;
    await UserAccountService.updateUser(user, req.body);

    res.status(201).json({
      message: 'User updated successfully.'
    });
  } catch (error) {
    logger.error('Error on User Creation', error);
    next(error);
  }
};

const postLineAuth = async (req, res, next) => {
  try {
    let value = UserDTO.LineAuthDTO.validate(req.body, {
      abortEarly: false
    });

    if (value.error) {
      throw createHttpError.UnprocessableEntity(value.error?.message);
    }

    value = value.value;

    const idToken = value.id_token;

    const decodedIdToken = jwt.decode(idToken);

    if (!decodedIdToken) {
      return res.status(400).json({
        message: 'Invalid ID token'
      });
    }

    console.log({ decodedIdToken });

    const userProfile = {
      lineId: decodedIdToken.sub,
      fullName: decodedIdToken.name,
      pictureUrl: decodedIdToken.picture,
      email: decodedIdToken.email,
      line_state: value.state,
      emailVerified: true
    };

    console.log('ssss userProfile:', userProfile);

    let user = await UserAccountService.lineAccount(userProfile.lineId);

    let message = 'User logged in successfully';

    if (!user) {
      user = await UserAccountService.createLineAccount(userProfile);
      message = 'User signed up successfully';
    }

    const getRefreshToken = jwtGenerator.generateUserAccessToken(user?._id);

    const getAccessToken = jwtGenerator.generateUserAccessToken(user?._id);

    res.cookie(COOKIE_NAMES.MEMBERSHIP_USER_REFRESH, getRefreshToken, {
      httpOnly: true,
      secure: req.secure,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30
    });

    res.cookie(COOKIE_NAMES.MEMBERSHIP_USER_ACCESS, getAccessToken, {
      httpOnly: true,
      secure: req.secure,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30
    });

    res.status(201).json({
      message
    });
  } catch (error) {
    logger.error('Error on Line Auth', error);
    next(error);
  }
};

const postLoginUser = async (req, res, next) => {
  const joiResult = UserDTO.UserLoginDTO.validate(req.body);

  try {
    if (joiResult?.error) {
      logger.debug('error', joiResult.error);
      throw createHttpError.BadRequest(plainResponseMessages.invalidRequest);
    }

    const value = joiResult?.value;
    const users = await UserAccountService.userLogin(value);

    if (!users) {
      throw createHttpError.Unauthorized(plainResponseMessages.invalidCredentials);
    }

    const user = { ...users, message: 'Login Success.' };
    delete user?.refreshToken;
    const getRefreshToken = users?.refreshToken;
    const getAccessToken = users?.token;

    res.cookie(COOKIE_NAMES.MEMBERSHIP_USER_REFRESH, getRefreshToken, {
      httpOnly: true,
      secure: req.secure,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30
    });

    res.cookie(COOKIE_NAMES.MEMBERSHIP_USER_ACCESS, getAccessToken, {
      httpOnly: true,
      secure: req.secure,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30
    });

    res.status(200).json(user);
  } catch (error) {
    logger.error('Error on Logging User', error);
    next(error);
  }
};

const postRequestForEmailVerification = async (req, res, next) => {
  const userId = req.user._id;
  const membershipId = req.body.membershipId;

  try {
    // let's first check if the phone us unverified first
    let userEmailIsNotYetVerified = await UserAccountService.userEmailIsUnverified(userId);

    logger.debug('post request for email verification', userEmailIsNotYetVerified);

    if (!userEmailIsNotYetVerified) {
      throw createHttpError.Unauthorized('Your email is already verified.');
    }

    const response = await OTPRequestService.sendEmailOTPToUser(
      userId,
      membershipId,
      'EMAIL_VERIFICATION'
    );

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
  const userId = req.user._id;

  try {
    let value = OTPRequestDTO.EmailOTPVerifyDTO.validate(req.body, {
      abortEarly: false
    });

    if (value.error) {
      throw createHttpError.UnprocessableEntity(plainResponseMessages.invalidRequest);
    }

    value = value.value;

    let theClientCode = req.body.code;

    let code = await OTPRequestService.getCodeForUserByToken(value.token, 'EMAIL_VERIFICATION');

    if (!code) {
      throw createHttpError.Unauthorized('Invalid Code, please request for email once again');
    }

    if (code != theClientCode) {
      throw createHttpError.Unauthorized('Invalid Code, code did not matched');
    }

    // activate the phone number
    await UserAccountService.setUserEmailVerified(userId);

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

    let phone = req.body.phoneNumber;
    let email = req.body.email;
    let userName = req.body.userName;

    // if (phone) {
    // 	// if there is phone number
    // 	// let's first find the userId associated with that user
    // 	let accountExist = await UserAccountService.phoneAlreadyUsed(phone);

    // 	if (!accountExist) {
    // 		return res.status(200).json({
    // 			message:
    // 				'Message will be sent to the phone number if the account exists'
    // 		});
    // 	}

    // 	const response = await OTPRequestService.sendOTPToUser(
    // 		accountExist._id,
    // 		'PASSWORD_RESET',
    // 		signature
    // 	);

    // 	res.status(response.status).json({
    // 		message: response.message
    // 	});
    // }

    if (email) {
      let accountExist = await UserAccountService.emailAlreadyUsed(email);

      if (!accountExist) {
        return res.status(200).json({
          message: 'Instruction to reset password will be sent to the account if the account exists'
        });
      }

      const response = await OTPRequestService.sendEmailOTPToUser(
        accountExist._id,
        'PASSWORD_RESET_EMAIL'
      );

      res.status(response.status).json({
        message: response.message
      });
    }

    // if (userName) {
    //   let accountExist = await UserAccountService.userNameAlreadyUsed(userName);

    //   if (!accountExist) {
    //     return res.status(200).json({
    //       message: 'Instruction to reset password will be sent to the account if the account exists'
    //     });
    //   }

    //   const response = await OTPRequestService.sendEmailOTPToUser(
    //     accountExist._id,
    //     'PASSWORD_RESET_EMAIL'
    //   );

    //   if (response.status === '400') {
    //     res.status(400).json({
    //       message: response.message
    //     });
    //   } else {
    //     res.status(response.status).json({
    //       message: `We have sent an email to: ${response.email} with the password reset instruction.`
    //     });
    //   }
    // }
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

    let theUserId;
    let code;
    let codeType;

    if (token) {
      theUserId = await OTPRequestService.getUserIdByToken(token);
      codeType = 'PASSWORD_RESET_EMAIL';
    }

    if (!theUserId) {
      throw createHttpError.BadRequest('Invalid request');
    }

    // if (userName) {
    // 	let accountExist = await UserAccountService.userNameAlreadyUsed(
    // 		userName
    // 	);

    // 	if (!accountExist) {
    // 		return res.status(400).json({
    // 			message: 'Invalid Request'
    // 		});
    // 	}
    // 	theUserId = accountExist._id;

    // 	codeType = 'PASSWORD_RESET_EMAIL';
    // }

    // if (token) {
    // 	theUserId = await OTPRequestService.getUserIdByToken(token);
    // 	codeType = 'PASSWORD_RESET_EMAIL';
    // }

    code = await OTPRequestService.getCodeForUser(theUserId, codeType);

    if (!code) {
      throw createHttpError.Unauthorized('Invalid Code, please request for OTP once again');
    }

    logger.debug('change password', {
      code,
      theUserId,
      theClientCode
    });

    if (code != theClientCode) {
      throw createHttpError.Unauthorized('Invalid Code, code did not matched');
    }

    let password = req.body.password;

    let user = await UserAccountService.setUserPassword(theUserId, password);

    res.status(200).json({
      message:
        'We’ve successfully reset your password. Please return to the login page to proceed further.'
    });
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  let userId = req.user?._id;

  let user = await UserAccountService.userDetailsById(userId);

  res.status(200).json({
    message: 'User Profile',
    user
  });
};

const resendEmail = async (req, res, next) => {
  let bookingId = req.body.bookingId;

  // let bookingDetails = await BookingService.getBookingDetailsByIdToSendEmail(
  //   bookingId
  // );

  let customer = bookingDetails?.customer;

  let message = `This email is used on Neumo to create booking. Please use this code for payment authorization : ${customer?.code} .If you had not used the email, you can safely ignore this message`;

  let htmlMessage = `<p>
       This email is used on Neumo to create booking. Please use this code for payment authorization : ${customer?.code} .If you had not used the email, you can safely ignore this message.
    </p>`;

  let subject = 'Booking Authorization OTP Code';

  EmailService.sendMail({
    emails: [customer?.customerEmail],
    textMessage: message,
    htmlMessage: htmlMessage,
    subject: subject,
    fileName: 'booking-email.html',
    paymentLink: bookingDetails.paymentLink,
    code: bookingDetails.customer.code,
    userName: bookingDetails.user.userName
  });

  res.status(200).json({
    message: 'Email sent successfully'
  });
};

const getMyOrders = async (req, res, next) => {
  const user = req.user;
  try {
    const response = await UserAccountService.getMyOrders(user);

    if (response.success) {
      res.status(201).json({
        message: 'My orders list.',
        response
      });
    } else {
      res.status(422).json({
        message: 'Invalid Email or Identifier'
      });
    }
  } catch (error) {
    logger.error('Error on order getting.', error);
    next(error);
  }
};

const googleLogin = async (req, res, next) => {
  const authURL = await UserAccountService.googleLogin();
  res.status(200).json(authURL);
};

const googleLoginCallBack = async (req, res, next) => {
  const response = await UserAccountService.googleLoginCallBack(req.query);

  if (response.success) {
    const user = { ...response, message: 'Login Success.' };
    delete user?.refreshToken;
    const getRefreshToken = response?.refreshToken;
    const getAccessToken = response?.token;

    res.cookie(COOKIE_NAMES.MEMBERSHIP_USER_REFRESH, getRefreshToken, {
      httpOnly: true,
      secure: req.secure,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30
    });

    res.cookie(COOKIE_NAMES.MEMBERSHIP_USER_ACCESS, getAccessToken, {
      httpOnly: true,
      secure: req.secure,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30
    });
    const redirectURL = `${process.env.GOOGLE_LOGIN_REDIRECT_URL}?user=${JSON.stringify(user)}`;
    res.redirect(redirectURL);
  } else {
    res.status(400).json({
      message: response.message
    });
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const user = req.user;
    const response = await UserAccountService.updatePassword(user, req.body);

    if (response.success) {
      res.status(200).json({
        message: 'User password updated successfully.'
      });
    } else {
      res.status(422).json({
        message: response.message
      });
    }
  } catch (error) {
    logger.error('Error on updating user password', error);
    next(error);
  }
};

const canApplyMembership = async (req, res, next) => {
  try {
    const user = req.user;
    const response = await UserAccountService.canApplyMembership(user, req.query);

    res.status(200).json(response);
  } catch (error) {
    logger.error('Error on updating user password', error);
    next(error);
  }
};

module.exports = {
  postCreateUser,
  updateUser,
  postLineAuth,
  postLoginUser,
  postRequestForEmailVerification,
  putVerifyEmail,
  postRequestForForgetPassword,
  putResetPassword,
  resendEmail,
  getUserProfile,
  getMyOrders,
  googleLogin,
  googleLoginCallBack,
  updatePassword,
  canApplyMembership
};
