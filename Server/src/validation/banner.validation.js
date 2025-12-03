const Joi = require("joi");
const { CustomError } = require("../helpers/customError");

const bannerValidationSchema = Joi.object(
  {
    title: Joi.string().trim().min(3).max(50).required().messages({
      "string.base": "Title must be a string.",
      "string.empty": "Title cannot be empty.",
      "string.min": "Title must be at least {#limit} characters long.",
      "string.max": "Title cannot exceed {#limit} characters.",
      "any.required": "Title is required.",
    }),

    description: Joi.string().allow("").max(300).messages({
      "string.max": "Description cannot exceed {#limit} characters.",
    }),

    targetUrl: Joi.string().uri().required().messages({
      "string.uri": "Target URL must be a valid URL.",
    }),

    targetType: Joi.string()
      .valid("product", "category", "brand", "external", "none")
      .default("none")
      .messages({
        "any.only":
          "Target Type must be one of: product, category, brand, external, none.",
      }),

    priority: Joi.number().integer().min(1).default(1).messages({
      "number.base": "Priority must be a number.",
      "number.min": "Priority must be at least {#limit}.",
    }),

    isActive: Joi.boolean().messages({
      "boolean.base": "isActive must be true or false.",
    }),

    startDate: Joi.date().allow(null).messages({
      "date.base": "startDate must be a valid date.",
    }),

    endDate: Joi.date().allow(null).messages({
      "date.base": "endDate must be a valid date.",
    }),
  },
  { abortEarly: true }
).unknown(true);

exports.validateBanner = async (req) => {
  try {
    const value = await bannerValidationSchema.validateAsync(req.body);

    // Handle image validation
    const image = req?.files?.image?.[0];
    if (!image) throw new CustomError(401, "Image is required for the banner.");

    if (image) {
      const allowedFormats = [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (req.files.image.length > 1) {
        throw new CustomError(401, "Only one image is allowed.");
      }

      if (image.size > 2 * 1024 * 1024) {
        throw new CustomError(401, "Image size must be below 2MB.");
      }

      if (!allowedFormats.includes(image.mimetype)) {
        throw new CustomError(
          401,
          "Invalid image format. Allowed: JPG, JPEG, PNG, WEBP."
        );
      }

      return { ...value, image };
    }

    return value;
  } catch (error) {
    throw new CustomError(
      401,
      error.details ? error.details[0].message : error.message
    );
  }
};
