const Joi = require("joi");
const { CustomError } = require("../helpers/customError");

// ----------------- Joi Validation Schema -----------------
const variantValidationSchema = Joi.object(
  {
    variantName: Joi.string().trim().min(3).max(50).allow("").messages({
      "string.base": "Variant name must be a string.",
      "string.empty": "Variant name is required.",
      "string.min": "Variant name must be at least {#limit} characters long.",
      "string.max":
        "Variant name must not be more than {#limit} characters long.",
    }),

    // product: Joi.string().trim().required().messages({
    //   "string.base": "Product ID must be a string.",
    //   "any.required": "Product reference is required.",
    // }),

    sku: Joi.string().trim().allow("").messages({
      "string.base": "SKU must be a string.",
      "string.empty": "SKU is required.",
    }),

    barCode: Joi.string().trim().allow(""),
    qrCode: Joi.string().trim().allow(""),

    size: Joi.string().trim().allow(""),
    color: Joi.string().trim().allow(""),

    stockVariant: Joi.number().integer().min(0).default(0).messages({
      "number.base": "Stock variant must be a number.",
      "number.min": "Stock variant cannot be negative.",
    }),

    warehouseLocation: Joi.string().trim().allow("").messages({
      "string.base": "Warehouse ID must be a string.",
    }),

    alertVariantStock: Joi.number().integer().min(0).default(0),

    purchasePrice: Joi.number().precision(2).required().messages({
      "number.base": "Purchase price must be a number.",
      "any.required": "Purchase price is required.",
    }),

    retailPrice: Joi.number().precision(2).default(0),

    wholeSalePrice: Joi.number().precision(2).allow(null),

    stockAlert: Joi.number().integer().min(0).default(0),

    inStock: Joi.boolean().default(true),
    isActive: Joi.boolean().default(true),

    // image array optional
    image: Joi.array().items(Joi.object()).optional(),
  },
  {
    abortEarly: true, // stop on first error
  }
).unknown(true);

// ----------------- Validation Function -----------------
exports.validateVariant = async (req) => {
  try {
    // Validate body fields
    const value = await variantValidationSchema.validateAsync(req.body);

    // Image validation (if provided)
    const images = req?.files?.image;

    if (images && images.length > 0) {
      const allowFormat = [
        "image/jpg",
        "image/png",
        "image/jpeg",
        "image/webp",
      ];

      if (images.length > 5) {
        throw new CustomError(401, "Maximum 5 images are allowed.");
      }

      images.forEach((img) => {
        if (img.size > 2000000) {
          throw new CustomError(401, `Image ${img.originalname} exceeds 2MB.`);
        }
        if (!allowFormat.includes(img.mimetype)) {
          throw new CustomError(
            401,
            `Image format not accepted. Allowed: jpg, png, jpeg, webp.`
          );
        }
      });
    }

    return {
      value,
      images: images || [],
    };
  } catch (error) {
    throw new CustomError(401, error.message || error);
  }
};
