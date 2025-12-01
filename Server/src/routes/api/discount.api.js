const express = require("express");
const discountController = require("../../controller/discount.controller");
const { upload } = require("../../middleware/multer.middleware");
const { authGuard } = require("../../middleware/auth.middleware");
const { authorized } = require("../../middleware/authorize.middleware");
const _ = express.Router();

_.route("/create-discount").post(
  authGuard,
  authorized("discount", "add"),
  discountController.creatediscount
);
_.route("/all-discount").get(discountController.alldiscounts);
_.route("/single-discount/:slug").get(discountController.singlediscounts);
_.route("/update-discount/:slug").put(
  authGuard,
  authorized("discount", "edit"),
  discountController.updatediscount
);
_.route("/delete-discount/:slug").delete(
  authGuard,
  authorized("discount", "delete"),
  discountController.deletediscount
);

module.exports = _;
