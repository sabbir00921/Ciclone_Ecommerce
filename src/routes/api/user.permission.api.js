const express = require("express");
const _ = express.Router();
const userPermissionController = require("../../controller/userpermission.controller");
const { upload } = require("../../middleware/multer.middleware");

_.route("/add-permission").post(
  upload.fields([{ name: "image", maxCount: 1 }]),
  userPermissionController.createUserPermission
);
_.route("/all-permitteduser").get(
  userPermissionController.getallPermissionUser
);
module.exports = _;
