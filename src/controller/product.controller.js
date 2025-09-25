const { asyncHandaler } = require("../utils/async.Handler");
const { CustomError } = require("../helpers/customError");
const { apiResponse } = require("../utils/apiResponse");
const productModel = require("../model/product.model");
const { validateProduct } = require("../validation/product.validation");
const { uploadCloudinary, deleteCloudinary } = require("../helpers/cloudinary");
const { generateQrcode, generateBarcode } = require("../helpers/Qrcode");

// create product
exports.createProduct = asyncHandaler(async (req, res) => {
  const { value, images } = await validateProduct(req);

  const allImage = [];
  // upload images into cloudinary
  for (const image of images) {
    const imageInfo = await uploadCloudinary(image.path);
    allImage.push(imageInfo);
  }

  // save the product into database
  const product = await productModel.create({ ...value, image: allImage });
  if (!product) throw new CustomError(400, "Failed to create product");

  // Set product variant
  if (
    !value.size ||
    !value.color ||
    !value.retailPrice ||
    !value.wholesalePrice
  ) {
    product.variantType = "multiple";
  } else {
    product.variantType = "single";
  }

  // generate qrcode
  const link = `http://localhost:3000//api/v1/product/create-product/${product.slug}`;
  if (value.qrcode) {
    product.qrcode = value.qrcode;
  } else {
    const qrCode = await generateQrcode(link);
    product.qrcode = qrCode;
  }

  // generate barcode
  const barCodeText = `${product.sku}-${product.name.slice(0, 3)}-${
    product.sku
  }-${new Date().getFullYear()}`;

  if (value.barcode) {
    product.barcode = value.barcode;
  } else {
    const barCode = await generateBarcode(barCodeText);
    product.barcode = barCode;
  }
  // save product with QR & BAR Code
  await product.save();

  apiResponse.sendSucess(res, 200, "data", product);
});

// get all product
exports.getallproducts = asyncHandaler(async (req, res) => {
  console.log("get all data");

  const allProducts = await productModel
    .find({})
    .populate({
      path: "category",
      select: "name image slug",
    })
    .populate({
      path: "subCategory",
      select: "name slug",
    })
    .populate({
      path: "brand",
      select: "name image slug",
    });
  if (!allProducts) throw new CustomError(400, "Get products data failed ");
  apiResponse.sendSucess(res, 200, "All products data found", allProducts);
});

// get single product
exports.singleproducts = asyncHandaler(async (req, res) => {
  const { slug } = req.params;

  const singleProducts = await productModel
    .findOne({ slug })
    .populate({
      path: "category",
      select: "name image slug",
    })
    .populate({
      path: "subCategory",
      select: "name slug",
    })
    .populate({
      path: "brand",
      select: "name image slug",
    });
  if (!singleProducts)
    throw new CustomError(400, "Get single products data failed ");
  apiResponse.sendSucess(
    res,
    200,
    "Single products data found",
    singleProducts
  );
});

// update product info
exports.updateroducts = asyncHandaler(async (req, res) => {
  const { slug } = req.params;
  const data = req.body;

  const singleProducts = await productModel.findOneAndUpdate({ slug }, data, {
    new: true,
  });
  if (!singleProducts)
    throw new CustomError(400, "Get single products data failed ");
  apiResponse.sendSucess(
    res,
    200,
    "Single products data found",
    singleProducts
  );
});

// update image
exports.updateproductimage = asyncHandaler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new CustomError(401, "product Slug is required");
  const data = req.files;

  const product = await productModel.findOne({ slug });
  if (!product) throw new CustomError(401, "product not found");

  if (req?.body?.public_id) {
    for (const image of req.body.public_id) {
      const deleteimage = await deleteCloudinary(image);
      if (!deleteimage) throw new CustomError(401, "Image delete faield");
      product.image = product.image.filter((img) => img.public_id !== image);
    }
    // console.log("delete request found");
  }

  if (req?.files?.image) {
    for (const image of req.files.image) {
      const imageAssets = await uploadCloudinary(image.path);
      product.image.push(imageAssets);
    }
    // console.log("update request found");
  }

  await product.save();

  apiResponse.sendSucess(res, 200, "Single products data found", product);
});

// get producy by category id, subcategory id, brand id, tag, sortBy
exports.getProducts = asyncHandaler(async (req, res) => {
  const {
    category,
    subCategory,
    brand,
    name,
    color,
    tag,
    minPrice,
    maxPrice,
    page = 1,
    item = 2,
    sort_by,
  } = req?.query;

  // ! SET query if it given or exist in req.query or search params
  let query = {};
  if (category) query = { ...query, category: category };
  if (subCategory) query = { ...query, subCategory: subCategory };
  if (brand) query = { ...query, brand: brand };
  if (tag)
    query = { ...query, tag: { $all: Array.isArray(tag) ? tag : [tag] } };
  if (color) query = { ...query, color: color };
  if (name) query = { ...query, name: { $regex: name, $options: "i" } };

  // Price range filter or price fintering
  if (minPrice || maxPrice) {
    query = {
      ...query,
      $or: [
        {
          retailPrice: { $gte: Number(minPrice), $lte: Number(maxPrice) },
        },
        {
          wholesalePrice: { $gte: Number(minPrice), $lte: Number(maxPrice) },
        },
      ],
    };
  }

  // sort data logic implement
  let sortQuery = {};
  if (sort_by == "name-assending") {
    sortQuery = { name: 1 };
  } else if (sort_by == "name-desending") {
    sortQuery = { name: -1 };
  } else if (sort_by == "date-assending") {
    sortQuery = { createdAt: 1 };
  } else if (sort_by == "date-desending") {
    sortQuery = { createdAt: -1 };
  } else if (sort_by == "price-assending") {
    sortQuery = { retailPrice: 1 };
  } else if (sort_by == "price-desending") {
    sortQuery = { retailPrice: -1 };
  }

  // pagination
  let skipAmount = (page - 1) * item;
  const totalitems = await productModel.countDocuments(query);
  const totalPage = Math.ceil(totalitems / item);
  //get the products
  const products = await productModel
    .find(query)
    .skip(skipAmount)
    .limit(item)
    .sort(sortQuery)
    .select("-barcode -qrcode");
  if (!products || products.length === 0)
    throw new CustomError(401, "products not found");

  apiResponse.sendSucess(res, 200, "Single products data found", {
    totalitems,
    totalPage,
    products,
  });
});

// delete product
exports.deleteproduct = asyncHandaler(async (req, res) => {
  const { slug } = req?.params;
  if (!slug) throw new CustomError(401, "Slug not faound");

  const deleteproduct = await productModel.findOneAndDelete({
    slug,
  });

  if (!deleteproduct) throw new CustomError(401, "Product delete faield");
  // delete previous cloudinary image

  if (deleteproduct.image?.length >= 1) {
    for (const image of deleteproduct.image) {
      const deleteimage = await deleteCloudinary(image?.public_id);
      if (!deleteimage) throw new CustomError(401, "Image delete faield");
    }
  }

  apiResponse.sendSucess(res, 200, "Product delete succesfull", deleteproduct);
});
