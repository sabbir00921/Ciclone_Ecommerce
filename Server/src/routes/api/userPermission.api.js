const express = require("express");
const _ = express.Router();
const createUserController = require("../../controller/createuser.controller");
const { authorized } = require("../../middleware/authorize.middleware");
const { authGuard } = require("../../middleware/auth.middleware");

_.route("/add-permission").post(authGuard,
  authorized("permission", "add"),createUserController.addPermission);

module.exports = _;
