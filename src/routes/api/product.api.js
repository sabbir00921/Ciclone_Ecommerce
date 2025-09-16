const express = require("express");
const productController = require("../../controller/product.controller");
const { upload } = require("../../middleware/multer.middleware");
const _ = express.Router();

_.route("/create-product").post(
  upload.fields([{ name: "image", maxCount: 10 }]),
  productController.createProduct
);
_.route("/all-products").get(productController.getallproducts);
_.route("/single-products/:slug").get(productController.singleproducts);
_.route("/update-products-info/:slug").put(productController.updateroducts);
_.route("/update-product-image/:slug").put(
  upload.fields([{ name: "image", maxCount: 10 }]),
  productController.updateproductimage
);
_.route("/search-product").get(productController.getProducts)

module.exports = _;
