const jwt = require("jsonwebtoken");
require("dotenv").config();
const userModel = require("../model/user.model");
const { CustomError } = require("../helpers/customError");
const { asyncHandaler } = require("../utils/async.Handler");

const authGuard = async (req, res, next) => {
  const accesstoken =
    req.headers?.authorization.replace("Bearer ", "") ||
    req?.body?.accesstToken;
  const refresstoken = req.headers?.cookie.replace("RefreshToken= ", "");

  // verify token
  const decode = jwt.verify(accesstoken, process.env.ACCESTOKEN_SECRET);
  const user = await userModel
    .findById({ _id: decode.id })
    .populate("role")
    .populate("permissions.permissionId")
    .select("name email permissions role image _id refreshToken");

  if (!user) throw new CustomError("401", "Unauthorized access!");

  req.user = user;
  next();
};

module.exports = { authGuard };
