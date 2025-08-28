const Joi = require("joi");
const { CustomError } = require("../helpers/customError");

const subCategoryValidationSchema = Joi.object(
  {
    name: Joi.string().trim().empty().min(3).max(20).messages({
      "string.base": "SubCategory name must be a string.",
      "string.empty": "SubCategory name is required and cannot be empty.",
      "string.min":
        "SubCategory name must be at least {#limit} characters long.",
      "string.max":
        "SubCategory name must not be more than {#limit} characters long.",
      "string.trim": "Spaces at the start or end are not allowed in the name.",
    }),
    category: Joi.string().required().messages({
      "string.base": "Category ID must be a string.",
      "any.required": "Category ID is required.",
    }),
  },
  {
    abortEarly: true,
  }
).unknown(true);

exports.validateSubCategory = async (req) => {
  try {
    const value = await subCategoryValidationSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    console.log(error);
    throw new CustomError(401, error);
  }
};
