const express = require("express");
const _ = express.Router();
const createUserController = require("../../controller/createuser.controller");
const { upload } = require("../../middleware/multer.middleware");

_.route("/create-user").post(
  upload.fields([{ name: "image", maxCount: 1 }]),
  createUserController.createUser
);
_.route("/all-user").get(createUserController.getalluser);
module.exports = _;
