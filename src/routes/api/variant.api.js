const express = require("express");
const variantController = require("../../controller/variant.controller");
const { upload } = require("../../middleware/multer.middleware");
const { authGuard } = require("../../middleware/auth.middleware");
const { authorized } = require("../../middleware/authorize.middleware");
const _ = express.Router();

_.route("/create-variant").post(
  authGuard,
  authorized("variant", "add"),
  upload.fields([{ name: "image", maxCount: 10 }]),
  variantController.createVariant
);
_.route("/all-variants").get(variantController.allvariant);
_.route("/single-variants/:slug").get(variantController.singlevariant);
_.route("/update-variant/:slug").put(
  authGuard,
  authorized("variant", "add"),
  upload.fields([{ name: "image", maxCount: 10 }]),
  variantController.updatevariant
);
_.route("/delete-variant/:slug").delete(
  authGuard,
  authorized("variant", "delete"),
  variantController.deletevariant
);

module.exports = _;
