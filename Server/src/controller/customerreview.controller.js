const { asyncHandaler } = require("../utils/async.Handler");
const { CustomError } = require("../helpers/customError");
const { apiResponse } = require("../utils/apiResponse");
const productModel = require("../model/product.model");
const { validateSubCategory } = require("../validation/subCategory.validation");
const { validateReview } = require("../validation/customerreview.validation");
const { uploadCloudinary, deleteCloudinary } = require("../helpers/cloudinary");

// create review
exports.createreview = asyncHandaler(async (req, res) => {
  const { value, images } = await validateReview(req);

  // Check is already reviewed this product
  const product = await productModel.findById(value.productId);
  if (!product) throw new CustomError(404, "Product not found");

  const alreadyExists = product.review.some(
    (r) => r.reviewerId.toString() === value.reviewerId.toString()
  );

  if (alreadyExists) {
    throw new CustomError(
      400,
      "You have already submitted a review for this product."
    );
  }

  const imagesAssets = await Promise.all(
    images.map((img) => uploadCloudinary(img.path))
  );
  // create review in database
  const review = await productModel.findOneAndUpdate(
    { _id: value.productId },
    { $push: { review: { ...value, image: imagesAssets } } },
    { new: true }
  );
  if (!review) throw new CustomError(501, "Review create failed");

  apiResponse.sendSucess(res, 200, "Create review successfullt", review);
});

// update review
exports.updateReview = asyncHandaler(async (req, res) => {
  const { value, images } = await validateReview(req);

  // Upload new images
  const imagesAssets = await Promise.all(
    images.map((img) => uploadCloudinary(img.path))
  );

  // Update the review in product
  const updatedProduct = await productModel.findById(value.productId);
  if (!updatedProduct) throw new CustomError(404, "Product not found");

  // const review = product.reviewerId(value.reviewerId);
  const matchReview = updatedProduct.review.find(
    (review) => review.reviewerId.toString() === value.reviewerId.toString()
  );
  if (!matchReview) throw new CustomError(404, "Review not found");

  // Update review fields
  matchReview.comment = value.comment || matchReview.comment;
  matchReview.rating = value.rating || matchReview.rating;
  if (imagesAssets.length) {
    
    matchReview.image = [...(matchReview.image || []), ...imagesAssets];
  }

  await updatedProduct.save();
  apiResponse.sendSucess(
    res,
    200,
    "Review updated successfully",
    updatedProduct
  );
});

// delete review
exports.deleteReview = asyncHandaler(async (req, res) => {
  const { productId, reviewerId } = req.body;

  // Find the product
  const product = await productModel.findById(productId);
  if (!product) throw new CustomError(404, "Product not found");

  // image delete from cloudinary
  const reviewdelmatch = product.review.find(
    (reviewitem) => reviewitem.reviewerId.toString() === reviewerId.toString()
  );
  if (!reviewdelmatch) {
    throw new CustomError(401, "Review not exist for this product.");
  }

  // Delete images from Cloudinary for each matching review
  if (reviewdelmatch?.image)
    await Promise.all(
      reviewdelmatch?.image?.map((img) => deleteCloudinary(img.public_id))
    );

  // !*************!
  // return all review which does not match
  product.review = product.review.filter(
    (reviewitem) => reviewitem.reviewerId.toString() !== reviewerId.toString()
  );

  await product.save();

  apiResponse.sendSucess(res, 200, "Review deleted successfully", product);
});
