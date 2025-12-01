const Joi = require("joi");
const { CustomError } = require("../helpers/customError");
const mongoose = require("mongoose");

const UserCtrateValidationSchema = Joi.object({
  name: Joi.string().trim().min(5).max(16).required().messages({
    "string.base": "Name must be a string.",
    "string.empty": "Name is required and cannot be empty.",
    "string.min": "Name must be at least {#limit} characters long.",
    "string.max": "Name must not be more than {#limit} characters long.",
    "any.required": "Name is required.",
  }),

  email: Joi.string()
    .trim()
    .email()
    .pattern(
      /^(?!.*\.\.)[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/
    )
    .required()
    .messages({
      "string.base": "Email must be a string.",
      "string.email": "Please provide a valid email address.",
      "string.pattern.base": "Your email format is invalid.",
      "any.required": "Email is required.",
    }),

  password: Joi.string()
    .trim()
    .required()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#_\-])[A-Za-z\d@$!%*?&^#_\-]{8,}$/
    )
    .messages({
      "string.base": "Password must be a string.",
      "string.empty": "Password is required.",
      "string.pattern.base":
        "Password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
      "any.required": "Password is required.",
    }),

  role: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "string.base": "Role must be a string (ObjectId).",
      "any.invalid": "Invalid role ID format.",
      "any.required": "Role is required.",
    }),
}).unknown(true);

exports.validateUserCtrate = async (req) => {
  try {
    // Validate request body
    const value = await UserCtrateValidationSchema.validateAsync(req.body, {
      abortEarly: false,
    });

    // Validate image (optional)
    const image = req?.files?.image?.[0];
    const allowedFormats = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (image) {
      if (image.size > 2_000_000) {
        throw new CustomError(401, "Image size must be below 2MB");
      }

      if (!allowedFormats.includes(image.mimetype)) {
        throw new CustomError(
          401,
          "Image format not accepted. Allowed: jpg, jpeg, png, webp"
        );
      }
    }

    return { value, image };
  } catch (error) {
    if (error.details) {
      const messages = error.details.map((err) => err.message);
      throw new CustomError(401, messages.join(", "));
    }
    throw new CustomError(401, error.message || "Validation failed");
  }
};
