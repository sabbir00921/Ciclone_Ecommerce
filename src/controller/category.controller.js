const { asyncHandaler } = require("../utils/async.Handler");
const { CustomError } = require("../helpers/customError");
const { apiResponse } = require("../utils/apiResponse");
const categoryModel = require("../model/category.model");
const { validateCategory } = require("../validation/category.validation");

exports.createCategory = asyncHandaler(async (req, res) => {
  const value = await validateCategory(req);

  // test purpose
  if (value) {
    apiResponse.sendSucess(res, 200, value.name, value);
  }
});
