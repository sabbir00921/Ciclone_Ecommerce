const express = require("express");
const _ = express.Router();
const createUserController = require("../../controller/createuser.controller");

_.route("/add-permission").post(createUserController.addPermission);

module.exports = _;
