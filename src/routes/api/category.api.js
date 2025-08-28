const express = require("express");
const categoryController = require("../../controller/category.controller");
const { upload } = require("../../middleware/multer.middleware");
const _ = express.Router();

_.route("/create-category").post(
  upload.fields([{ name: "image", maxCount: 1 }]),
  categoryController.createCategory
);
_.route("/getall-category").get(categoryController.getallCategory);
_.route("/getsingle-category/:slug").get(categoryController.getSingleCategory);
_.route("/update-category/:slug").put(
  upload.fields([{ name: "image", maxCount: 1 }]),
  categoryController.updateCategory
);
_.route("/delete-category/:slug").delete(categoryController.deleteCategory);
_.route("/active-category").delete(categoryController.activeCategory)

module.exports = _;
