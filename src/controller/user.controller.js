const { CustomError } = require("../helpers/customError");
const user = require("../model/user.model");
const { asyncHandaler } = require("../utils/async.Handler");

exports.registration = asyncHandaler((req, res) => {
  throw new CustomError(401,"Email Missing from user controller",data = null)
});
exports.login = asyncHandaler((req, res) => {
  throw new Error ("Error from login")
});
