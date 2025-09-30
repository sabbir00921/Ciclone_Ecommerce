const express = require("express");
const customerReviewController = require("../../controller/customerreview.controller");
const { upload } = require("../../middleware/multer.middleware");
const _ = express.Router();

_.route("/create-review").post(
  upload.fields([{ name: "image", maxCount: 1 }]),
  customerReviewController.createreview
);
_.route("/update-review").put(
  upload.fields([{ name: "image", maxCount: 1 }]),
  customerReviewController.updateReview
);
_.route("/delete-review").delete(
  customerReviewController.deleteReview
);

module.exports = _;
