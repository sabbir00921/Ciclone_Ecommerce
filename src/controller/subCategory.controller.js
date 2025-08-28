const { asyncHandaler } = require("../utils/async.Handler");
const { CustomError } = require("../helpers/customError");
const { apiResponse } = require("../utils/apiResponse");
const subCategoryModel = require("../model/subCategory.model");
const { validateSubCategory } = require("../validation/subCategory.validation");

// create subcategory
exports.createSubCategory = asyncHandaler(async (req, res) => {
  const value = await validateSubCategory(req);
  // save in subcategory db
  const subCategory = await subCategoryModel.create(value);

  if (!subCategory) throw new CustomError(401, "subcategory create failed");
  apiResponse.sendSucess(
    res,
    200,
    "subCategory crteated succesfull",
    subCategory
  );

  console.log(value);
});

// get all subcategory
exports.getallSubCategory = asyncHandaler(async (req, res) => {
  const allSubCatergory = await subCategoryModel.find().sort({ createdAt: -1 });
  if (!allSubCatergory) throw new CustomError(401, "All category not found");
  apiResponse.sendSucess(res, 200, "All category data found", allSubCatergory);
});

// get Single category
exports.getSingleSubCategory = asyncHandaler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new CustomError(401, "Slug not faound");
  const getSingleSubCategory = await subCategoryModel
    .findOne({
      slug,
    })
    .populate({
      path: "category",
    });
  if (!getSingleSubCategory)
    throw new CustomError(401, "Single subcategory data not found");
  apiResponse.sendSucess(
    res,
    200,
    "Single subcategory data found",
    getSingleSubCategory
  );
});

// Update Single category
exports.updateSubCategory = asyncHandaler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new CustomError(401, "Slug not faound");
  const updateSubCategory = await subCategoryModel
    .findOneAndUpdate(
      { slug },
      {
        ...req.body,
      },
      { new: true }
    )
    .populate("category", "_id name isActive");

  if (!updateSubCategory) throw new CustomError(401, "Subcategory item not found");

  apiResponse.sendSucess(
    res,
    200,
    "Update subcategory successful",
    updateSubCategory
  );
});
