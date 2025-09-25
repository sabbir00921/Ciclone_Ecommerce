const { asyncHandaler } = require("../utils/async.Handler");
const { CustomError } = require("../helpers/customError");
const { apiResponse } = require("../utils/apiResponse");
const productModel = require("../model/product.model");
const variantModel = require("../model/variant.model");
const { validateVariant } = require("../validation/variant.validation");
const { uploadCloudinary, deleteCloudinary } = require("../helpers/cloudinary");
const { generateQrcode, generateBarcode } = require("../helpers/Qrcode");

// create product
exports.createVariant = asyncHandaler(async (req, res) => {
  const { value, images } = await validateVariant(req);

  // upload images into cloudinary
  const imageAssets = await Promise.all(
    images?.map((img) => uploadCloudinary(img.path))
  );

  // create variant
  const variant = await variantModel.create({ ...value, image: imageAssets });
  if (!variant) throw new CustomError(501, "Variant creation failed");

  // update product review field
  const product = await productModel.findOneAndUpdate(
    { _id: variant.product },
    { $push: { variant: variant._id } },
    { new: true }
  );
  if (!product)
    throw new CustomError(501, "product variant field update failed");
  // generate qrcode
  const link = `http://localhost:3000//api/v1/product/create-product/${variant.slug}`;
  if (value.qrcode) {
    variant.qrCode = value.qrcode;
  } else {
    const qrCode = await generateQrcode(link);
    variant.qrCode = qrCode;
  }

  // generate barcode
  const barCodeText = `${variant.sku}-${variant.variantName.slice(0, 3)}-${
    variant.sku
  }-${new Date().getFullYear()}`;

  if (value.barcode) {
    variant.barCode = value.barCode;
  } else {
    const barCode = await generateBarcode(barCodeText);
    variant.barCode = barCode;
  }
  // save product with QR & BAR Code
  await variant.save();

  apiResponse.sendSucess(res, 200, "data", variant);
});

// get all variant
exports.allvariant = asyncHandaler(async (req, res) => {
  const allvariants = await variantModel.find();
  if (!allvariants)
    throw new CustomError(501, "all variants data fetch failed");
  apiResponse.sendSucess(res, 200, "all variants data fetched", allvariants);
});

// get single variant
exports.singlevariant = asyncHandaler(async (req, res) => {
  const { slug } = req.params;
  const singlevariants = await variantModel.findOne({ slug });
  if (!singlevariants)
    throw new CustomError(501, "all variants data fetch failed");
  apiResponse.sendSucess(res, 200, "all variants data fetched", singlevariants);
});

// update variant
exports.updatevariant = asyncHandaler(async (req, res) => {
  const { slug } = req.params;
  const { value, images } = await validateVariant(req);

  const updatevariant = await variantModel.findOne({ slug });
  if (!updatevariant)
    throw new CustomError(501, "all variants data fetch failed");

  // upload images into cloudinary
  const imageAssets = await Promise.all(
    images?.map((img) => uploadCloudinary(img.path))
  );
  if (!imageAssets) throw new CustomError(501, "Image update failed  failed");
  updatevariant.image.push(...imageAssets);

  if (
    value.product &&
    value.product.toString() !== updatevariant.product.toString()
  ) {
    // set new variant id
    await productModel.findOneAndUpdate(
      {
        _id: value.product,
      },
      {
        $push: { variant: updatevariant._id },
      },
      {
        new: true,
      }
    );
    // Delete old variant id
    await productModel.findOneAndUpdate(
      {
        _id: updatevariant.product,
      },
      {
        $pull: { variant: updatevariant._id },
      },
      {
        new: true,
      }
    );
  }
  Object.assign(updatevariant, value);

  await updatevariant.save();
  apiResponse.sendSucess(res, 200, "all variants data fetched", updatevariant);
});

// !delete variant
exports.deletevariant = asyncHandaler(async (req, res) => {
  const { slug } = req.params;

  const deletevariant = await variantModel.findOneAndDelete({ slug });
  if (!deletevariant) throw new CustomError(501, "Variant delete failed");

  // Delete variant images from cloudinary and variant id from product
  if (deletevariant) {
    await Promise.all(
      deletevariant.image?.map((img) => deleteCloudinary(img.public_id))
    );

    await productModel.findOneAndUpdate(
      {
        _id: deletevariant.product,
      },
      {
        $pull: { variant: deletevariant._id },
      },
      {
        new: true,
      }
    );
  }

  apiResponse.sendSucess(res, 200, "variant deleted", deletevariant);
});
