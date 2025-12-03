const { asyncHandaler } = require("../utils/async.Handler");
const { CustomError } = require("../helpers/customError");
const { apiResponse } = require("../utils/apiResponse");
const bannerModel = require("../model/banner.model");
const { uploadCloudinary, deleteCloudinary } = require("../helpers/cloudinary");
const { validateBanner } = require("../validation/banner.validation");

const uloadImage = async (imagepath, targetId) => {
  try {
    const imageAsset = await uploadCloudinary(imagepath);
    if (!imageAsset)
      throw new CustomError(401, "Image upload faield to cloudinary");

    await bannerModel.findByIdAndUpdate(
      { _id: targetId },
      { image: imageAsset }
    );
  } catch (error) {
    console.log("Image upload error", error);
  }
};

// Create Banner
exports.createBanner = asyncHandaler(async (req, res) => {
  const value = await validateBanner(req);

  //save data into database
  const banner = await bannerModel.create({
    ...value,
  });
  if (!banner) throw new CustomError(500, "Unable to create banner!!");
  // uploaod image to cloudinary
  uloadImage(value?.image?.path, banner._id);

  apiResponse.sendSucess(res, 200, "Banner created successfully!!", banner);
});

// get all banner
exports.getAllBanners = asyncHandaler(async (req, res) => {
  const banners = await bannerModel.find({}).sort({ createdAt: -1 });
  if (!banners || banners.length === 0) {
    throw new CustomError(404, "No banners found!!");
  }
  apiResponse.sendSucess(res, 200, "Banners fetched successfully!!", banners);
});

// update banner
exports.updateBanner = asyncHandaler(async (req, res) => {
  const { id } = req.params;

  // get single banner data
  const banner = await bannerModel.findById({ _id: id });

  if (!banner) throw new CustomError(500, "Banner not found");
  if (req.files && req.files.image && req.files.image.length > 0) {
    // delete old image from cloudinary
    if (banner?.image?.public_id) {
      await deleteCloudinary(banner?.image?.public_id);
    }

    // upload new image to cloudinary
    const imageAsset = await uploadCloudinary(req?.files?.image[0]?.path);
    banner.image = imageAsset;
  }
  // update other field
  if (Object.keys(req.body).length > 0) {
    Object.keys(req.body).forEach((key) => {
      banner[key] = req.body[key];
    });
  }

  await banner.save();

  apiResponse.sendSucess(res, 200, "Banners updated successfully!!", banner);
});

// delete banner
exports.deleteBanner = asyncHandaler(async (req, res) => {
  const { id } = req.params;
  const deletedBanner = await bannerModel.findByIdAndDelete({ _id: id });
  if (!deletedBanner) {
    throw new CustomError(401, "Delete failed or No banner found");
  }
  await deleteCloudinary(deletedBanner.image.public_id);
  apiResponse.sendSucess(res, 200, "Banner deleted successfully!!");
});
