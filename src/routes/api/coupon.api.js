const express = require("express");
const couponController = require("../../controller/coupon.contrller");
const { authGuard } = require("../../middleware/auth.middleware");
const { authorized } = require("../../middleware/authorize.middleware");
const _ = express.Router();

_.route("/create-coupon").post(
  authGuard,
  authorized("coupon", "add"),
  couponController.createcoupon
);
_.route("/all-coupon").get(couponController.getallcoupon);
_.route("/single-coupon/:slug").get(couponController.singlecoupon);
_.route("/update-coupon/:slug").put(
  authGuard,
  authorized("coupon", "edit"),
  couponController.updateCoupon
);
_.route("/delete-coupon/:slug").delete(
  authGuard,
  authorized("coupon", "delete"),
  couponController.deleteCoupon
);

module.exports = _;
