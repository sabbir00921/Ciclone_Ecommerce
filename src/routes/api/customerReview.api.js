const express = require("express");
const customerReviewController = require("../../controller/customerreview.controller");
const { upload } = require("../../middleware/multer.middleware");
const { authGuard } = require("../../middleware/auth.middleware");
const _ = express.Router();

_.route("/create-review").post(authGuard,
  upload.fields([{ name: "image", maxCount: 1 }]),
  customerReviewController.createreview
);
_.route("/update-review").put(
  authGuard,
  upload.fields([{ name: "image", maxCount: 1 }]),
  customerReviewController.updateReview
);
_.route("/delete-review").delete(
  authGuard,
  customerReviewController.deleteReview
);

module.exports = _;
