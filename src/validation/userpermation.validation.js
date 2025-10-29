const Joi = require("joi");
const { Types } = require("mongoose");
const { CustomError } = require("../helpers/customError");

const objectIdValidator = (value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const userPermissionSchema = Joi.object({
  userId: Joi.string()
    .custom(objectIdValidator, "ObjectId validation")
    .required()
    .messages({
      "string.base": "User ID must be a string.",
      "any.invalid": "Invalid User ID format.",
      "any.required": "User ID is required.",
    }),

  permissions: Joi.array()
    .items(
      Joi.object({
        permissionId: Joi.string()
          .custom(objectIdValidator, "ObjectId validation")
          .required()
          .messages({
            "string.base": "Permission ID must be a string.",
            "any.invalid": "Invalid Permission ID format.",
            "any.required": "Permission ID is required.",
          }),

        actions: Joi.array()
          .items(
            Joi.string()
              .valid("view", "add", "edit", "delete")
              .messages({
                "any.only": "Action must be one of [view, add, edit, delete].",
              })
          )
          .min(1)
          .required()
          .messages({
            "array.base": "Actions must be an array.",
            "array.min": "At least one action is required.",
          }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Permissions must be an array.",
      "array.min": "At least one permission is required.",
      "any.required": "Permissions field is required.",
    }),
}).unknown(false); // disallow unknown fields

// 🔥 Validation function
exports.validateUserPermissions = async (req) => {
  try {
    const value = await userPermissionSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    return value;
  } catch (error) {
    throw new CustomError(400, error.details.map((d) => d.message).join(", "));
  }
};
