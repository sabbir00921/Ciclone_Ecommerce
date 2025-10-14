const { asyncHandaler } = require("../utils/async.Handler");
const { CustomError } = require("../helpers/customError");
const { apiResponse } = require("../utils/apiResponse");
const orderModel = require("../model/order.model");

// success
exports.success = asyncHandaler(async (req, res) => {
  console.log(req.body);
  res.redirect("https://www.youtube.com/watch?v=fXkh3VufNe8");
});

// 
exports.fail = asyncHandaler(async (req, res) => {
  console.log(req.body);
  res.redirect("https://www.youtube.com/watch?v=fXkh3VufNe8");
});

// 
exports.cancel = asyncHandaler(async (req, res) => {
  console.log(req.body);
  res.redirect("https://www.youtube.com/watch?v=fXkh3VufNe8");
});

// 
exports.ipn = asyncHandaler(async (req, res) => {
  console.log(req.body);
  res.redirect("https://www.youtube.com/watch?v=fXkh3VufNe8");
});

// 
