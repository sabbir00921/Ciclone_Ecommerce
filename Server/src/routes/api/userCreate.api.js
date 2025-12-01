const express = require("express");
const _ = express.Router();
const createUserController = require("../../controller/createuser.controller");
const { upload } = require("../../middleware/multer.middleware");
const { authGuard } = require("../../middleware/auth.middleware");
const { authorized } = require("../../middleware/authorize.middleware");

_.route("/create-user").post(
  authGuard,
  authorized("user", "add"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  createUserController.createUser
);
_.route("/all-user").get(
  authGuard,
  authorized("user", "view"),
  createUserController.getalluser
);
module.exports = _;
