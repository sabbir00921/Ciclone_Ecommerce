const { asyncHandaler } = require("../utils/async.Handler");
const { CustomError } = require("../helpers/customError");
const { apiResponse } = require("../utils/apiResponse");
const discountModel = require("../model/discount.model");
const subCategoryModel = require("../model/subCategory.model");
const categoryModel = require("../model/category.model");
const { validateDiscount } = require("../validation/discount.validation");

// TODO: Create discount functionality
exports.creatediscount = asyncHandaler(async (req, res) => {
  // validate data
  const validedData = await validateDiscount(req);

  // save data in database
  const discount = await discountModel.create(validedData);
  if (!discount) throw new CustomError(401, "Discount created faield!!");

  // update discount in category database
  if (validedData.discountPlan === "category" && validedData.category) {
    await categoryModel.findByIdAndUpdate(validedData.category, {
      discount: discount._id,
    });
  }

  // update discount in subCategory database
  if (validedData.discountPlan === "subcategory" && validedData.subCategory) {
    await subCategoryModel.findByIdAndUpdate(validedData.subCategory, {
      discount: discount._id,
    });
  }

  // update discount in product database
  if (validedData.discountPlan === "product" && validedData.product) {
    await categoryModel.findByIdAndUpdate(validedData.product, {
      discount: discount._id,
    });
  }
  apiResponse.sendSucess(res, 200, "Discount craeted successfully", discount);
});

// get all discounts
exports.alldiscounts = asyncHandaler(async (req, res) => {
  const alldiscounts = await discountModel
    .find()
    .populate("category", "_id name isActive slug")
    .populate("subCategory", "_id name isAvailable slug");
  if (!alldiscounts) throw new CustomError(401, "all discounts fetch failed");

  apiResponse.sendSucess(res, 200, "All discounts data", alldiscounts);
});

// get single discounts
exports.singlediscounts = asyncHandaler(async (req, res) => {
  const { slug } = req.params;
  const alldiscounts = await discountModel
    .findOne({ slug })
    .populate("category", "_id name isActive slug")
    .populate("subCategory", "_id name isAvailable slug");
  if (!alldiscounts) throw new CustomError(401, "all discounts fetch failed");

  apiResponse.sendSucess(res, 200, "All discounts data", alldiscounts);
});

// update category
exports.updatediscount = asyncHandaler(async (req, res) => {
  const { slug } = req.params;
  const validateData = await validateDiscount(req);
  const discount = await discountModel.findOne({ slug });
  if (!discount) throw new CustomError(401, "Discount not found!!");

  // TODO: remove old value witch from discount database/server
  // !Update/remove from old category,subcategory & products
  // Update/remove Discount field in category
  if (discount.discountPlan === "category" && discount.category) {
    await categoryModel.findByIdAndUpdate(discount.category, {
      discount: null,
    });
  }

  // Update/remove Discount field in subCategory
  if (discount.discountPlan === "subcategory" && discount.subCategory) {
    await subCategoryModel.findByIdAndUpdate(discount.subCategory, {
      discount: null,
    });
  }
  // !!!This portion for product. Upcomeing

  // TODO: assign new value witch from request/client
  // !Update new category,subcategory & products
  //New Update/add Discount field in category
  if (validateData.discountPlan === "category" && validateData.category) {
    await categoryModel.findByIdAndUpdate(validateData.category, {
      discount: discount._id,
    });
  }
  //New Update/add Discount field in subcategory
  if (validateData.discountPlan === "subcategory" && validateData.subCategory) {
    console.log();

    await subCategoryModel.findByIdAndUpdate(validateData.subCategory, {
      discount: discount._id,
    });
  }

  // !!!This portion for product. Upcomeing

  //!! update with validated data
  Object.assign(discount, validateData);
  await discount.save();

  apiResponse.sendSucess(res, 200, "duscount updated successfully", discount);
});

// delete discount
exports.deletediscount = asyncHandaler(async (req, res) => {
  const { slug } = req.params;
  const discount = await discountModel.findOneAndDelete(
    { slug },
    { new: true }
  );

  if (!discount) throw new CustomError(401, "Discount data not found!!");

  // TODO: remove old value witch from discount database/server
  // !Update/remove from old category,subcategory & products
  // Update/remove Discount field in category
  if (discount.discountPlan === "category" && discount.category) {
    await categoryModel.findByIdAndUpdate(discount.category, {
      discount: null,
    });
  }

  // Update/remove Discount field in subCategory
  if (discount.discountPlan === "subcategory" && discount.subCategory) {
    await subCategoryModel.findByIdAndUpdate(discount.subCategory, {
      discount: null,
    });
  }

  apiResponse.sendSucess(res, 200, "duscount deleted successfully", discount);
});
