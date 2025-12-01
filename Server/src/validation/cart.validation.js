const Joi = require("joi");
const { CustomError } = require("../helpers/customError");

// ----------------- Joi Validation Schema -----------------
const cartValidationSchema = Joi.object(
  {
    user: Joi.alternatives()
      .try(Joi.string().trim(), Joi.valid(null))
      .optional()
      .messages({
        "string.base": "User ID must be a string.",
      }),

    guestId: Joi.string().trim().optional().messages({
      "string.base": "Guest ID must be a string.",
    }),

    product: Joi.alternatives()
      .try(Joi.string().trim(), Joi.valid(null))
      .optional()
      .messages({
        "string.base": "Product ID must be a string.",
      }),

    variant: Joi.alternatives()
      .try(Joi.string().trim(), Joi.valid(null))
      .optional()
      .messages({
        "string.base": "Variant ID must be a string.",
      }),

    quantity: Joi.number().integer().min(1).required().messages({
      "number.base": "Quantity must be a number.",
      "number.min": "Quantity must be at least 1.",
      "any.required": "Quantity is required.",
    }),

    size: Joi.string().trim().allow("").optional().messages({
      "string.base": "Size must be a string.",
    }),

    color: Joi.string().trim().allow("").optional().messages({
      "string.base": "Color must be a string.",
    }),

    coupon: Joi.string().trim().optional().allow(null, "").messages({
      "string.base": "Coupon ID must be a string.",
    }),
  },
  { abortEarly: true }
).unknown(true);

// ----------------- Validation Function -----------------
exports.validateCart = async (req) => {
  try {
    const data = await cartValidationSchema.validateAsync(req.body);
    return data;
  } catch (error) {
    throw new CustomError(401, error.message || error);
  }
};
