const Joi = require("joi");
const { CustomError } = require("../helpers/customError");

const categoryValidationSchema = Joi.object(
  {
    name: Joi.string().trim().empty().min(5).max(16).messages({
      "string.base": "Name must be a string.",
      "string.empty": "Name is required and cannot be empty.",
      "string.min": "Name must be at least {#limit} characters long.",
      "string.max": "Name must not be more than {#limit} characters long.",
      "string.trim": "Spaces at the start or end are not allowed in the name.",
    }),
  },
  {
    abortEarly: true,
  }
).unknown(true);

// Validate category information
exports.validateCategory = async (req) => {
  try {
    const value = await categoryValidationSchema.validateAsync(req.body);
    const image = req?.files?.image[0];
    const allowFormat = ["image/jpg", "image/png", "image/jpeg", "image/webp"];
    if (image?.length > 1) {
      throw new CustomError(401, "image must be single");
    }
    if (image?.size > 200000) {

      throw new CustomError(401, "image size must be below 2MB");
    }
    if (!allowFormat.includes(image?.mimetype)) {
      throw new CustomError(
        401,
        "image format now accepted. try with image/*jpg image/*png image/*jpeg image/*webp"
      );
    }
    return {name:value.name, image:req?.files?.image[0]};
  } catch (error) {
    throw new CustomError(401, error);
  }
};
