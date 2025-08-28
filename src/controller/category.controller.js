const { asyncHandaler } = require("../utils/async.Handler");
const { CustomError } = require("../helpers/customError");
const { apiResponse } = require("../utils/apiResponse");
const categoryModel = require("../model/category.model");
const { validateCategory } = require("../validation/category.validation");
const { uploadCloudinary, deleteCloudinary } = require("../helpers/cloudinary");

// Create categor
exports.createCategory = asyncHandaler(async (req, res) => {
  const value = await validateCategory(req);
  // Upload image ti cloudinary
  const imageAssets = await uploadCloudinary(value.image.path);
  // Save into database
  const category = await categoryModel.create({
    name: value.name,
    image: imageAssets,
  });

  if (!category) {
    throw new CustomError(500, "Category not created");
  }

  // test purpose
  apiResponse.sendSucess(res, 200, "Category Created succesful", {
    name: category.name,
  });
});

// get all category
exports.getallCategory = asyncHandaler(async (req, res) => {
  const allCatergory = await categoryModel.find().sort({ createdAt: -1 });
  if (!allCatergory) throw new CustomError(401, "All category not found");
  apiResponse.sendSucess(res, 200, "All category data found", allCatergory);
});

// get SIngle category
exports.getSingleCategory = asyncHandaler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new CustomError(401, "Slug not faound");
  const getSingleCategory = await categoryModel
    .findOne({
      slug,
    })
    .select("name image isActive slug -_id");
  if (!getSingleCategory) throw new CustomError(401, "Single data not found");
  apiResponse.sendSucess(
    res,
    200,
    "Single category data found",
    getSingleCategory
  );
});

// Update category
exports.updateCategory = asyncHandaler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new CustomError(401, "Slug not faound");

  const updateCategory = await categoryModel
    .findOne({
      slug,
    })
    .select("name image isActive slug");

  if (!updateCategory) throw new CustomError(500, "Category updating faield");
  if (req?.body.name) updateCategory.name = req?.body.name;
  if (req?.files?.image?.length) {
    // delete previous cloudinary image
    const response = await deleteCloudinary(updateCategory.image.public_id);
    // upload cloudinary
    const uploadAsset = await uploadCloudinary(req?.files?.image[0].path);
    updateCategory.image = uploadAsset;
  }

  await updateCategory.save();
  apiResponse.sendSucess(res, 200, "Update Succesfully", updateCategory);
});

// Deleet category

exports.deleteCategory = asyncHandaler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new CustomError(401, "Slug not faound");

  const deletecategory = await categoryModel.findOneAndDelete({
    slug,
  });

  if (!deletecategory) throw new CustomError(401, "category delete faield");
  // delete previous cloudinary image
  const response = await deleteCloudinary(deletecategory.image.public_id);

  apiResponse.sendSucess(
    res,
    200,
    "delete category succesfull",
    deletecategory
  );
});
