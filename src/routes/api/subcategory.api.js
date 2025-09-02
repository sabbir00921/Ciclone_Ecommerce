const express = require("express");
const subCategoryController = require("../../controller/subCategory.controller");
const { upload } = require("../../middleware/multer.middleware");
const _ = express.Router();

_.route("/create-subcategory").post(subCategoryController.createSubCategory);
_.route("/getall-subcategory").get(subCategoryController.getallSubCategory);
_.route("/getsingle-subcategory/:slug").get(subCategoryController.getSingleSubCategory);
_.route("/update-subcategory/:slug").put(subCategoryController.updateSubCategory);
_.route("/delete-subcategory/:slug").delete(subCategoryController.deleteSubcategory);

module.exports = _;
