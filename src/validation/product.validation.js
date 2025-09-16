const Joi = require("joi");
const { CustomError } = require("../helpers/customError");

const productValidationSchema = Joi.object(
  {
    name: Joi.string().trim().min(3).max(100).required().messages({
      "string.base": "Product name must be a string.",
      "string.empty": "Product name is required.",
      "string.min": "Product name must be at least {#limit} characters long.",
      "string.max":
        "Product name must not be more than {#limit} characters long.",
      "any.required": "Product name is required.",
    }),

    category: Joi.string().trim().messages({
      "string.base": "Category ID must be a string.",
      "any.required": "Category is required.",
    }),

    purchasePrice: Joi.number().min(0).messages({
      "number.base": "Purchase price must be a number.",
      "number.min": "Purchase price must be at least 0.",
      "any.required": "Purchase price is required.",
    }),

    retailPrice: Joi.number().min(0).messages({
      "number.base": "Retail price must be a number.",
      "number.min": "Retail price must be at least 0.",
      "any.required": "Retail price is required.",
    }),
  },
  {
    abortEarly: true,
  }
).unknown(true);

exports.validateProduct = async (req) => {
  try {
    const value = await productValidationSchema.validateAsync(req.body);
    const image = req?.files?.image[0];
    const allowFormat = ["image/jpg", "image/png", "image/jpeg", "image/webp"];
    if (image?.length > 1) {
      throw new CustomError(401, "image must be single");
    }
    if (image?.size > 500000) {
      throw new CustomError(401, "image size must be below 2MB");
    }
    if (!allowFormat.includes(image?.mimetype)) {
      throw new CustomError(
        401,
        "image format now accepted. try with image/*jpg image/*png image/*jpeg image/*webp"
      );
    }
    return { value, images: req?.files?.image };
  } catch (error) {
    throw new CustomError(401, error);
  }
};
