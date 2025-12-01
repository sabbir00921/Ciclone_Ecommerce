const express = require("express");
const productController = require("../../controller/product.controller");
const { upload } = require("../../middleware/multer.middleware");
const { authGuard } = require("../../middleware/auth.middleware");
const { authorized } = require("../../middleware/authorize.middleware");
const _ = express.Router();

_.route("/create-product").post(
  upload.fields([{ name: "image", maxCount: 10 }]),
  productController.createProduct
);
_.route("/all-products").get(
  authGuard,
  authorized("product", "add"),
  productController.getallproducts
);
_.route("/single-products/:slug").get(productController.singleproducts);
_.route("/update-products-info/:slug").put(
  authGuard,
  authorized("product", "edit"),
  productController.updateroducts
);
_.route("/update-product-image/:slug").put(
  authGuard,
  authorized("product", "edit"),
  upload.fields([{ name: "image", maxCount: 10 }]),
  productController.updateproductimage
);
_.route("/search-product").get(productController.getProducts);
_.route("/delete-product/:slug").delete(
  authGuard,
  authorized("product", "delete"),
  productController.deleteproduct
);
_.route("/bestselling").get(productController.bestselling);

module.exports = _;
