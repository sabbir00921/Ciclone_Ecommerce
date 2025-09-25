const express = require("express");
const variantController = require("../../controller/variant.controller");
const { upload } = require("../../middleware/multer.middleware");
const _ = express.Router();

_.route("/create-variant").post(
  upload.fields([{ name: "image", maxCount: 10 }]),
  variantController.createVariant
);
_.route("/all-variants").get(variantController.allvariant);
_.route("/single-variants/:slug").get(variantController.singlevariant);
_.route("/update-variant/:slug").put(
  upload.fields([{ name: "image", maxCount: 10 }]),
  variantController.updatevariant
);
_.route("/delete-variant/:slug").delete(variantController.deletevariant);

module.exports = _;
