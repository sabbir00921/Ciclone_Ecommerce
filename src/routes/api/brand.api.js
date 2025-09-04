const express = require("express");
const brandController = require("../../controller/brand.controller");
const { upload } = require("../../middleware/multer.middleware");
const _ = express.Router();

_.route("/create-brand").post(
  upload.fields([{ name: "image", maxCount: 1 }]),
  brandController.createBrand
);
_.route("/get-allbrands").get(brandController.getallbrands);
_.route("/get-singlebrands/:slug").get(brandController.getsinglebrands);
_.route("/update-brand/:slug").put(
  upload.fields([{ name: "image", maxCount: 1 }]),
  brandController.updatebrand
);
_.route("/delete-brand/:slug").delete(brandController.deletebrand);

module.exports = _;
