const Joi = require("joi");
const { CustomError } = require("../helpers/customError");

const userValidationSchema = Joi.object(
  {
    name: Joi.string().trim().empty().min(5).max(16).message({
      "string.base": "Name must be a string.",
      "string.empty": "Name is required and cannot be empty.",
      "string.min": "Name must be at least {#limit} characters long.",
      "string.max": "Name must not be more than {#limit} characters long.",
      "string.trim": "Spaces at the start or end are not allowed in the name.",
    }),
    email: Joi.string()
      .trim()
      .required()
      .pattern(
        /^(?!.*\.\.)[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/
      )
      .messages({
        "string.email": "Your email must be string.",
        "string.pattern.base": "Your email no match or email invalid",
        "string.trim": "Space not allow",
      }),
    phone: Joi.string()
      .trim()
      .pattern(/^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/)
      .messages({
        "string.base": "Your phone number must be a number.",
        "string.pattern.base": "Invalid Bangladeshi phone number format.",
        "string.trim": "Spaces are not allowed in phone number.",
      }),
    password: Joi.string()
      .trim()
      .empty()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#_\-])[A-Za-z\d@$!%*?&^#_\-]{8,}$/
      )
      .messages({
        "string.base": "Password must be a string.",
        "string.empty": "Password is required.",
        "string.pattern.base":
          "Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
      }),
  },
  {
    abortEatly: true,
  }
).unknown(true);

//Validate user information

exports.validateUser = async (req) => {
  try {
    const value = await userValidationSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    // console.log(" Error From user validatioin", error);
    throw new CustomError(401, error.details[0].message || error);
  }
};
