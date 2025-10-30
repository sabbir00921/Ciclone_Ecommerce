const express = require("express");
const subCategoryController = require("../../controller/subCategory.controller");
const { upload } = require("../../middleware/multer.middleware");
const { authGuard } = require("../../middleware/auth.middleware");
const { authorized } = require("../../middleware/authorize.middleware");
const _ = express.Router();

_.route("/create-subcategory").post(
  authGuard,
  authorized("subcategory", "add"),
  subCategoryController.createSubCategory
);
_.route("/getall-subcategory").get(subCategoryController.getallSubCategory);
_.route("/getsingle-subcategory/:slug").get(
  subCategoryController.getSingleSubCategory
);
_.route("/update-subcategory/:slug").put(
  authGuard,
  authorized("subcategory", "edit"),
  subCategoryController.updateSubCategory
);
_.route("/delete-subcategory/:slug").delete(
  authGuard,
  authorized("subcategory", "delete"),
  subCategoryController.deleteSubcategory
);

module.exports = _;
