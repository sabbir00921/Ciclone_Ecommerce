const Joi = require("joi");
const { CustomError } = require("../helpers/customError");

// ----------------- Joi Validation Schema for Review -----------------
const reviewValidationSchema = Joi.object(
  {
    reviewerId: Joi.string().trim().required().messages({
      "string.base": "Review user ID must be a string.",
      "any.required": "Review user ID is required.",
      "string.empty": "Review user ID cannot be empty.",
    }),
    productId: Joi.string().trim().required().messages({
      "string.base": "Product ID must be a string.",
      "any.required": "Product ID is required.",
      "string.empty": "Product ID cannot be empty.",
    }),
    comment: Joi.string().trim().max(500).allow("").messages({
      "string.base": "Comment must be a string.",
      "string.max": "Comment cannot exceed {#limit} characters.",
    }),
    rating: Joi.number().min(0).max(5).required().messages({
      "number.base": "Rating must be a number.",
      "number.min": "Rating cannot be less than {#limit}.",
      "number.max": "Rating cannot be more than {#limit}.",
      "any.required": "Rating is required.",
    }),
    // optional images array
    image: Joi.array().items(Joi.object()).optional(),
  },
  {
    abortEarly: true, // stop on first error
  }
).unknown(true);

// ----------------- Validation Function -----------------
exports.validateReview = async (req) => {
  try {
    // Validate body fields
    const value = await reviewValidationSchema.validateAsync(req.body);

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
