const express = require("express");
const _ = express.Router();

_.use("/auth", require("./api/user.api"));
_.use("/category", require("./api/category.api"));
_.use("/subcategory", require("./api/subcategory.api"));
_.use("/brand", require("./api/brand.api"));
_.use("/discount", require("./api/discount.api"));
_.use("/product", require("./api/product.api"));
_.use("/variant", require("./api/variant.api"));
_.use("/review", require("./api/customerReview.api"));
_.use("/coupon", require("./api/coupon.api"));

module.exports = _;
