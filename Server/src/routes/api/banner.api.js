const express = require("express");
const bannerController = require("../../controller/banner.controller");
const { upload } = require("../../middleware/multer.middleware");

const _ = express.Router();

_.route("/create-banner").post(
  upload.fields([{ name: "image", maxCount: 1 }]),
  bannerController.createBanner
);
_.route("/update-banner/:id").put(
  upload.fields([{ name: "image", maxCount: 1 }]),
  bannerController.updateBanner
);

_.route("/getall-banner").get(bannerController.getAllBanners);
_.route("/delete-banner/:id").delete(bannerController.deleteBanner);

module.exports = _;
