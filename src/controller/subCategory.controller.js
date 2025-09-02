const { asyncHandaler } = require("../utils/async.Handler");
const { CustomError } = require("../helpers/customError");
const { apiResponse } = require("../utils/apiResponse");
const subCategoryModel = require("../model/subCategory.model");
const categoryModel = require("../model/category.model");
const { validateSubCategory } = require("../validation/subCategory.validation");

// create subcategory
exports.createSubCategory = asyncHandaler(async (req, res) => {
  const value = await validateSubCategory(req);

  // save in subcategory db
  const subCategory = await subCategoryModel.create(value);

  if (!subCategory) throw new CustomError(401, "subcategory create failed");
  // Updaet cayegory database
  const category = await categoryModel.findById(value.category);
  category.subCategory.push(subCategory._id);
  await category.save();

  apiResponse.sendSucess(
    res,
    200,
    "subCategory crteated succesfull",
    subCategory
  );
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
  let updateSubCategory = await subCategoryModel
    .findOneAndUpdate(
      { slug },
      {
        ...req.body,
      },
      { new: true }
    )
    // .populate("category", "name subCategory");

  if (req?.body?.category) {
    // Remove subcategory id From previous category
    await categoryModel.findOneAndUpdate(
      {
        subCategory: updateSubCategory._id,
      },
      {
        $pull: { subCategory: updateSubCategory._id },
      },
      {
        new: true,
      }
    );
    // Add subcategory id into update/new category
    const category = await categoryModel.findOneAndUpdate(
      {
        _id: req.body.category,
      },
      {
        $push: { subCategory: updateSubCategory._id },
      },
      {
        new: true,
      }
    );
  }

  // Populate later because pull push and solve old data store
  
  updateSubCategory = await updateSubCategory.populate("category", "name subCategory");


  if (!updateSubCategory)
    throw new CustomError(401, "Subcategory item not found");

  apiResponse.sendSucess(
    res,
    200,
    "Update subcategory successful",
    updateSubCategory
  );
});
