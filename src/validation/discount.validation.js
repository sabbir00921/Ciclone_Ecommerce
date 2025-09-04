const Joi = require("joi");
const { CustomError } = require("../helpers/customError");

const discountValidationSchema = Joi.object(
  {
    discountName: Joi.string().trim().min(3).max(50).messages({
      "string.base": "Discount name must be a string.",
      "string.empty": "Discount name is required and cannot be empty.",
      "string.min": "Discount name must be at least {#limit} characters long.",
      "string.max":
        "Discount name must not be more than {#limit} characters long.",
      "any.required": "Discount name is required.",
    }),

    discountValidFrom: Joi.date().required().messages({
      "date.base": "Discount valid from must be a valid date.",
      "any.required": "Discount valid from date is required.",
    }),

    discountValidTo: Joi.date()
      .greater(Joi.ref("discountValidFrom"))
      .required()
      .messages({
        "date.base": "Discount valid to must be a valid date.",
        "date.greater": "Discount valid to must be later than valid from.",
        "any.required": "Discount valid to date is required.",
      }),

    discountType: Joi.string().valid("taka", "percentage").required().messages({
      "any.only": "Discount type must be either 'taka' or 'percentage'.",
      "any.required": "Discount type is required.",
    }),

    discountValueByAmount: Joi.number()
      .min(0)
      .when("discountType", {
        is: "taka",
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .messages({
        "number.base": "Discount value by amount must be a number.",
        "number.min": "Discount value by amount must be at least 0.",
        "any.required":
          "Discount value by amount is required when type is taka.",
      }),

    discountValueByPercentage: Joi.number()
      .min(0)
      .max(100)
      .when("discountType", {
        is: "percentage",
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .messages({
        "number.base": "Discount value by percentage must be a number.",
        "number.min": "Discount percentage cannot be less than 0.",
        "number.max": "Discount percentage cannot be more than 100.",
        "any.required":
          "Discount percentage value is required when type is percentage.",
      }),

    discountPlan: Joi.string()
      .lowercase()
      .valid("category", "subcategory", "product")
      .required()
      .messages({
        "any.only":
          "Discount plan must be either Category, subCategory, or Product.",
        "any.required": "Discount plan is required.",
      }),

    category: Joi.string().allow(null, "").optional().messages({
      "string.base": "Category ID must be a string.",
    }),

    subCategory: Joi.string().allow(null, "").optional().messages({
      "string.base": "SubCategory ID must be a string.",
    }),

    product: Joi.string().allow(null, "").optional().messages({
      "string.base": "Product ID must be a string.",
    }),
  },
  {
    abortEarly: true,
  }
).unknown(true);

exports.validateDiscount = async (req) => {
  try {
    const value = await discountValidationSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    // console.log(error);
    throw new CustomError(401, error.message || "Validation failed");
  }
};
