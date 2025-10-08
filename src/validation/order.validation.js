const Joi = require("joi");
const { CustomError } = require("../helpers/customError");

const orderValidationSchema = Joi.object(
  {
    user: Joi.string().allow(null, "").optional().messages({
      "string.base": "User ID must be a string.",
    }),
    guestId: Joi.string().allow(null, "").optional().trim().messages({
      "string.base": "Guest ID must be a string.",
    }),
    shippingInfo: Joi.object({
      fullName: Joi.string().required().messages({
        "string.base": "Full name must be a string.",
        "any.required": "Full name is required in shipping info.",
      }),
      phone: Joi.string().required().messages({
        "string.base": "Phone must be a string.",
        "any.required": "Phone is required in shipping info.",
      }),
      email: Joi.string().email().allow(null, "").optional().messages({
        "string.email": "Invalid email format.",
      }),
      address: Joi.string().required().messages({
        "string.base": "Address must be a string.",
        "any.required": "Address is required in shipping info.",
      }),
    }).required(),
    deliveryChargeId: Joi.string().required().messages({
      "string.base": "Delivery charge ID must be a string.",
      "any.required": "Delivery charge is required.",
    }),
    paymentMethod: Joi.string().valid("cod", "sslcommerz").required().messages({
      "any.only": "Payment method must be either 'cod' or 'sslcommerz'.",
      "any.required": "Payment method is required.",
    }),
  },
  {
    abortEarly: true, // stop on first error
  }
).unknown(true);

exports.validateOrder = async (req) => {
  try {
    const value = await orderValidationSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    throw new CustomError(401, error.message || "Order validation failed");
  }
};
