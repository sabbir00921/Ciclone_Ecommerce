const Joi = require("joi");
const { CustomError } = require("../helpers/customError");

const brandValidationSchema = Joi.object(
  {
    name: Joi.string().trim().min(3).max(30).required().messages({
      "string.base": "Brand name must be a string.",
      "string.empty": "Brand name is required and cannot be empty.",
      "string.min": "Brand name must be at least {#limit} characters long.",
      "string.max":
        "Brand name must not be more than {#limit} characters long.",
      "any.required": "Brand name is required.",
    }),
    isActive: Joi.boolean().messages({
      "boolean.base": "isActive must be true or false.",
    }),
  },
  {
    abortEarly: true,
  }
).unknown(true);

exports.validateBrand = async (req) => {
  try {
    const value = await brandValidationSchema.validateAsync(req.body);

    const image = req?.files?.image?.[0];
    if (image) {
      const allowFormat = [
        "image/jpg",
        "image/png",
        "image/jpeg",
        "image/webp",
      ];

      if (req.files.image.length > 1) {
        throw new CustomError(401, "Only one image is allowed.");
      }
      if (image.size > 2 * 1024 * 1024) {
        // 2MB
        throw new CustomError(401, "Image size must be below 2MB");
      }
      if (!allowFormat.includes(image.mimetype)) {
        throw new CustomError(
          401,
          "Invalid image format. Allowed: JPG, PNG, JPEG, WEBP"
        );
      }

      return { ...value, image };
    }

    return { ...value };
  } catch (error) {
    throw new CustomError(
      401,
      error.details ? error.details[0].message : error.message
    );
  }
};
