const { asyncHandaler } = require("../utils/async.Handler");
const { CustomError } = require("../helpers/customError");
const { apiResponse } = require("../utils/apiResponse");
const orderModel = require("../model/order.model");
const cartModel = require("../model/cart.model");
const deliveryChargeModel = require("../model/delivery.model");
const { validateOrder } = require("../validation/order.validation");

//create order
exports.createOrder = asyncHandaler(async (req, res) => {
  const { user, guestId, shippingInfo, deliveryCharge, paymentMethod } =
    await validateOrder(req);

  // apply deliveryCharge
  const applydeliveryCharge = async (deleveryChargeId) => {
    try {
      const deliveryCharge = await deliveryChargeModel.findOne({
        _id: deleveryChargeId,
      });
      if (!deliveryCharge)
        throw new CustomError(401, "Invalid deleveryChargeId ");

      return deliveryCharge;
    } catch (error) {
      throw new CustomError(401, "applydeliveryCharge Error");
    }
  };

  // find the user or guest in cart model
  const query = user ? { user: user } : { guestId: guestId };

  const cart = await cartModel
    .findOne(query)
    .populate("items.product")
    .populate("items.variant")
  if (!cart) throw new CustomError(401, "Cart not found!!");

  const deliveryChargeInfo = await applydeliveryCharge(deliveryCharge);

  console.log(deliveryChargeInfo);

  apiResponse.sendSucess(res, 200, "Brand created successfully!!", cart);
});
