const express = require("express");
const couponController = require("../../controller/coupon.contrller");
const _ = express.Router();

_.route("/create-coupon").post(couponController.createcoupon);
_.route("/all-coupon").get(couponController.getallcoupon);
_.route("/single-coupon/:slug").get(couponController.singlecoupon);
_.route("/update-coupon/:slug").put(couponController.updateCoupon);
_.route("/delete-coupon/:slug").delete(couponController.deleteCoupon);

module.exports = _;
