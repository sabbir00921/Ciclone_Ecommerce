const path = require("path");
const { CustomError } = require("../helpers/customError");
const { mailer } = require("../helpers/nodemailer");
const user = require("../model/user.model");
const jwt = require("jsonwebtoken");
const {
  registrationOtpVerificationtemplate,
  resendOtpVerificationtemplate,
  resetPassword,
} = require("../template/registration.template");
const { apiResponse } = require("../utils/apiResponse");
const { asyncHandaler } = require("../utils/async.Handler");
const { validateUser } = require("../validation/user.validation");
const crypto = require("crypto");
const { smsSender } = require("../helpers/sendSms");

exports.registration = asyncHandaler(async (req, res) => {
  const value = await validateUser(req);

  // now save the user data in DB
  const userData = await new user({
    name: value.name,
    email: value.email || null,
    phone: value.phone || null,
    password: value.password,
  }).save();

  const otp = crypto.randomInt(1000, 9999);
  const expireTime = Date.now() + 10 * 60 * 1000;

  // For email registration
  if (value.email) {
    const flink = `https://frontend.com/verify-account/${userData.email}`;
    // verification email
    const template = registrationOtpVerificationtemplate(
      "VIRUS COMPUTER",
      userData.name,
      userData.email,
      otp,
      flink
    );
    await mailer("OTP for email verification", template, userData.email);

    (userData.emailVerificationOtp = otp),
      (userData.emailVerificationExpTime = expireTime);
    await userData.save();

    apiResponse.sendSucess(res, 201, "Registration Successfull", {
      name: userData.name,
      phone: userData.email,
    });
  }

  // For number registration
  if (value.phone) {
    const flink = `https://frontend.com/verify-account/${userData.phone}`;
    const smsBody = `Your account verification OTP is ${otp}. Verify your account now: ${flink}. OTP expires in ${(expirySeconds = 10)} minutes.`;
    // await smsSender(userData.phone, smsBody);
    (userData.phoneVerificationOtp = otp),
      (userData.phoneVerificationExpTime = expireTime);
    await userData.save();
    const smsRes = await smsSender(value.phone, smsBody);
    if (smsRes.response_code !== 202) {
      throw new CustomError(500, "Send sms failed");
    }

    apiResponse.sendSucess(res, 201, "Registration Successfull", { userData });
  }
});

// Verify mail
exports.verifyEmail = asyncHandaler(async (req, res) => {
  const { email, phone, otp } = req.body;
  const test = email || phone;
  if (!test || !otp) {
    throw new CustomError(401, "Email or OTP missing");
  }
  // find the user using email for check otp validity
  const findUser = await user.findOne({
    $and: [
      { $or: [{ email: email }, { phone: phone }] },
      { phoneVerificationOtp: otp },
      { phoneVerificationExpTime: { $gt: Date.now() } },
    ],
  });
  if (!findUser) {
    throw new CustomError(401, "invalid otp or time expired !!");
  }
  findUser.isPhoneVerified = true;
  findUser.phoneVerificationOtp = null;
  findUser.phoneVerificationExpTime = null;
  const userData = await findUser.save();
  apiResponse.sendSucess(res, 200, "Email veridfication successfull", findUser);
});

//Resend OTP
exports.resendOtp = asyncHandaler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new CustomError(401, "Email missing");
  }
  // now save the user data in DB
  const userData = await user.findOne({
    $and: [{ email: email }, { isEmailVerified: (isEmailVerified = false) }],
  });

  if (!userData) {
    throw new CustomError(401, "User not found or already verified");
  }
  const otp = crypto.randomInt(1000, 9999);
  const expireTime = Date.now() + 10 * 60 * 1000;
  const flink = "https://dummyjson.com/products";

  // verification email
  const template = resendOtpVerificationtemplate(
    "VIRUS COMPUTER",
    userData.name,
    userData.email,
    otp,
    flink
  );
  await mailer("Resend OTP for email verification", template, userData.email);
  (userData.emailVerificationOtp = otp),
    (userData.emailVerificationExpTime = expireTime);
  await userData.save();

  apiResponse.sendSucess(res, 200, "Otp resent in your email", {
    name: userData.name,
  });
});

// forget password
exports.forgetPassword = asyncHandaler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new CustomError(401, "Email missing");
  }
  // now save the user data in DB
  const userData = await user.findOne({ email: email });

  if (!userData) {
    throw new CustomError(401, "User not found");
  }

  // reset front-end link
  const flink = "https://dummyjson.com/reset-passors";

  // verification email
  const template = resetPassword(flink);

  await mailer("Reset password", template, userData.email);

  apiResponse.sendSucess(res, 200, "Reset pasword link sent in your email", {
    name: userData.name,
  });
});

// reset password
exports.resetPassword = asyncHandaler(async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (!email || !newPassword || !confirmPassword) {
    throw new CustomError(401, "Email or password missing");
  }
  if (newPassword !== confirmPassword) {
    throw new CustomError(401, "Password dont match !!");
  }

  const regEx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#_\-])[A-Za-z\d@$!%*?&^#_\-]{8,}$/;
  if (!regEx.test(newPassword || confirmPassword)) {
    throw new CustomError(
      401,
      "Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character."
    );
  }
  // check pasword macth or not
  if (newPassword !== confirmPassword) {
    throw new CustomError(401, "Password dont match !!");
  }
  // now save the user data in DB
  const userData = await user.findOne({ email });
  if (!userData) {
    throw new CustomError(401, "User not found !!");
  }

  // change Password
  userData.password = newPassword;
  await userData.save();
  apiResponse.sendSucess(res, 200, "Password is updated", {
    password: userData.password,
  });
});

// Login portion implement
exports.login = asyncHandaler(async (req, res) => {
  const { email, password, phone } = await validateUser(req);

  // finduser
  const findUser = await user.findOne({ email, phone });
  if (!findUser) {
    throw new CustomError(401, "User not found !!");
  }

  const isMatchedPassword = await findUser.comparePassword(password);

  if (!isMatchedPassword) {
    throw new CustomError(401, "Password not match !!");
  }
  console.log(findUser.generateAccessToken);

  // generate access token and refresh token
  const accessToken = await findUser.generateAccessToken();
  const refreshToken = await findUser.generateRefreshtoken();
  // Set refresh token as a cookie
  res.cookie("RefreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development" ? false : true,
    sameSite: "Strict", // lux frontend backend domain same,
    path: "/",
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });

  // set refresh token into db
  findUser.refreshToken = refreshToken;

  console.log(accessToken);

  await findUser.save();
  apiResponse.sendSucess(res, 200, "Login succesful", {
    name: findUser.name,
    accessToken: accessToken,
  });
});

// Logout

exports.logout = asyncHandaler(async (req, res) => {
  const token = req?.headers?.authorization || req?.body?.accessToken;
  const decode = jwt.verify(token, process.env.ACCESTOKEN_SECRET);

  const findUser = await user.findById(decode.id);

  // clear the refress token
  findUser.refreshToken = null;
  await findUser.save();

  // Clear cookie in browser
  res.clearCookie("RefreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development" ? false : true,
    sameSite: "Strict", // lux frontend backend domain same,
    path: "/",
  });

  // send SMS
  const smsRes = await smsSender(
    "01880840849",
    "Logout succesfull " + findUser.name
  );
  if (smsRes.response_code !== 202) {
    throw new CustomError(500, "Send sms failed");
  }

  apiResponse.sendSucess(res, 200, "Logout successful", findUser);
  return res.status(301, "Logout successfull");
});
