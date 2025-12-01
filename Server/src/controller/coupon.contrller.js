const { asyncHandaler } = require("../utils/async.Handler");
const { CustomError } = require("../helpers/customError");
const { apiResponse } = require("../utils/apiResponse");
const couponModel = require("../model/coupon.model");

// create coupon
exports.createcoupon = asyncHandaler(async (req, res) => {
  const coupon = await couponModel.create(req?.body);
  if (!coupon) throw new CustomError(501, "Coupon create fails!!");
  apiResponse.sendSucess(res, 200, "Create review successfullt", coupon);
});

// get all coupon
exports.getallcoupon = asyncHandaler(async (req, res) => {
  const coupon = await couponModel.find();
  if (!coupon || coupon.length<1) throw new CustomError(401, "No coupon found!!");
  apiResponse.sendSucess(res, 200, "All coupon found successfullt", coupon);
});

// get all coupon
exports.singlecoupon = asyncHandaler(async (req, res) => {
  const { slug } = req.params;
  const coupon = await couponModel.findOne({ slug: slug });
  if (!coupon) throw new CustomError(501, "No coupon found!!");
  apiResponse.sendSucess(res, 200, "Coupon found successfullt", coupon);
});

// update coupon
exports.updateCoupon = asyncHandaler(async (req, res) => {
  const { slug } = req.params;
  const coupon = await couponModel.findOneAndUpdate(
    { slug: slug },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!coupon) throw new CustomError(404, "Coupon not found!!");

  apiResponse.sendSucess(res, 200, "Coupon updated successfully", coupon);
});

// delete coupon
exports.deleteCoupon = asyncHandaler(async (req, res) => {
  const { slug } = req.params;
  const coupon = await couponModel.findOneAndDelete({ slug: slug });
  if (!coupon) throw new CustomError(404, "Coupon not found!!");

  apiResponse.sendSucess(res, 200, "Coupon Deleted", coupon);
});
