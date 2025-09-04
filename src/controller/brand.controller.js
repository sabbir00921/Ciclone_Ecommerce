const { asyncHandaler } = require("../utils/async.Handler");
const { CustomError } = require("../helpers/customError");
const { apiResponse } = require("../utils/apiResponse");
const brandModel = require("../model/brand.model");
const { validateBrand } = require("../validation/brand.validation");
const { uploadCloudinary, deleteCloudinary } = require("../helpers/cloudinary");
const NodeCache = require("node-cache");
const { json } = require("express");
const myCache = new NodeCache();

// Create Brand
exports.createBrand = asyncHandaler(async (req, res) => {
  const value = await validateBrand(req);

  // upload image into cloudinary
  const imageAsset = await uploadCloudinary(value.image.path);
  if (!imageAsset)
    throw new CustomError(401, "Image upload faield to cloudinary");

  // Save data into database

  const brand = await brandModel.create({
    name: value.name,
    image: imageAsset,
  });
  if (!brand) throw new CustomError(500, "Brand creation failed!!");

  apiResponse.sendSucess(res, 200, "Brand created successfully!!", value);
});

// get all brand
exports.getallbrands = asyncHandaler(async (req, res) => {
  const value = myCache.get("brands");

  if (value === undefined) {
    const brands = await brandModel.find().sort({ createdAt: -1 });
    myCache.set("brands", JSON.stringify(brands), 1000);

    if (!brands || brands.length === 0) {
      throw new CustomError(401, "No brands found");
    }

    apiResponse.sendSucess(res, 200, "All brand data get sucessfully", brands);
  }

  apiResponse.sendSucess(
    res,
    200,
    "All brand data get sucessfully",
    JSON.parse(value)
  );
});

// get single brand
exports.getsinglebrands = asyncHandaler(async (req, res) => {
  const { slug } = req.params;
  // get single brand data
  const singleBrands = await brandModel.find({ slug });
  if (!singleBrands || singleBrands.length === 0)
    throw new CustomError(401, "No brands found");

  apiResponse.sendSucess(
    res,
    200,
    "Brand Single item found sucessfully",
    singleBrands
  );
});

// update brand
exports.updatebrand = asyncHandaler(async (req, res) => {
  const { slug } = req.params;
  const value = await validateBrand(req);

  // get single brand data
  const brand = await brandModel.findOne({ slug });
  if (!brand || brand.length === 0)
    throw new CustomError(401, "No brands found");

  if (value.image) {
    const imageAssets = await uploadCloudinary(value.image.path);
    await deleteCloudinary(brand.image.public_id);
    brand.image = imageAssets;
  }
  brand.name = value.name || brand.name;
  await brand.save();
  apiResponse.sendSucess(res, 200, "Brand updated sucessfully", brand);
});

// delete brand
exports.deletebrand = asyncHandaler(async (req, res) => {
  const { slug } = req.params;
  const deletedbrand = await brandModel.findOneAndDelete(
    { slug },
    { new: true }
  );
  if (!deletedbrand) {
    throw new CustomError(401, "Delete failed or No brands found");
  }
  await deleteCloudinary(deletedbrand.image.public_id);
  apiResponse.sendSucess(res, 200, "Brand deleted successfully");
});
