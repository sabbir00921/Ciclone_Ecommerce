const express = require("express");
const discountController = require("../../controller/discount.controller");
const { upload } = require("../../middleware/multer.middleware");
const _ = express.Router();

_.route("/create-discount").post(discountController.creatediscount);
_.route("/all-discount").get(discountController.alldiscounts);
_.route("/single-discount/:slug").get(discountController.singlediscounts);
_.route("/update-discount/:slug").put(discountController.updatediscount);
_.route("/delete-discount/:slug").delete(discountController.deletediscount);

module.exports = _;
