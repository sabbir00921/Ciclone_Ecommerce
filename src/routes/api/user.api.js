const express = require("express");
const _ = express.Router();
const userController = require("../../controller/user.controller");

_.route("/registration").post(userController.registration);
_.route("/verify-email").post(userController.verifyEmail);
_.route("/resend-Otp").post(userController.resendOtp);
_.route("/forget-Password").post(userController.forgetPassword);
_.route("/reset-password").post(userController.resetPassword);

module.exports = _;
