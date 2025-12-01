const { asyncHandaler } = require("../utils/async.Handler");
const { CustomError } = require("../helpers/customError");
const { apiResponse } = require("../utils/apiResponse");
const orderModel = require("../model/order.model");
const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = process.env.NODE_ENV == "development" ? false : true;

// success
exports.success = asyncHandaler(async (req, res) => {
  const { val_id } = req.body;

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const data = await sslcz.validate({
    val_id,
  });

  if (data.status == "VALID" && data.val_id) {
    const order = await orderModel.findOne({ invoiceId: data.tran_id });
    order.transactionId = data.bank_tran_id;
    order.validId = data.val_id;
    order.paymentStatus = "success";
    order.paymentInfo = data;
    order.orderStatus = "Confirmed";
    await order.save();
  }

  res.redirect("https://www.youtube.com/watch?v=fXkh3VufNe8");
});

//fail
exports.fail = asyncHandaler(async (req, res) => {
  console.log(req.body);
  res.redirect("https://www.youtube.com/watch?v=fXkh3VufNe8");
});

//cancel
exports.cancel = asyncHandaler(async (req, res) => {
  console.log(req.body);
  res.redirect("https://www.youtube.com/watch?v=fXkh3VufNe8");
});

//ipn
exports.ipn = asyncHandaler(async (req, res) => {
  console.log(req.body);
  res.redirect("https://www.youtube.com/watch?v=fXkh3VufNe8");
});
