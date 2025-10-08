const { asyncHandaler } = require("../utils/async.Handler");
const { CustomError } = require("../helpers/customError");
const { apiResponse } = require("../utils/apiResponse");
const orderModel = require("../model/order.model");
const cartModel = require("../model/cart.model");
const productModel = require("../model/product.model");
const variantModel = require("../model/variant.model");
const invoiceModel = require("../model/invoice.model");
const deliveryChargeModel = require("../model/delivery.model");
const { validateOrder } = require("../validation/order.validation");
const crypto = require("crypto");

//create order
exports.createOrder = asyncHandaler(async (req, res) => {
  const { user, guestId, shippingInfo, deliveryChargeId, paymentMethod } =
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
    .populate("items.variant");
  if (!cart) throw new CustomError(401, "Cart not found!!");

  // reduce stock of product
  let allStockAdjustPromice = [];
  for (let item of cart.items) {
    if (item.product) {
      allStockAdjustPromice.push(
        productModel.findOneAndUpdate(
          { _id: item.product._id },
          { $inc: { totalStock: -item.quantity, totalSale: item.quantity } },
          { new: true }
        )
      );
    }
    if (item.variant) {
      allStockAdjustPromice.push(
        variantModel.findOneAndUpdate(
          { _id: item.variant._id },
          { $inc: { stockVariant: -item.quantity, totalSale: item.quantity } },
          { new: true }
        )
      );
    }
  }

  // create order instance
  let order = null;
  try {
    order = new orderModel({
      user: user,
      guestId: guestId,
      items: cart.items,
      shippingInfo: shippingInfo,
      followUp: req.user || "",
      totalQuantity: cart.totalQuantity,
    });

    // merge delevery charge
    const { name, deliveryCharge } = await applydeliveryCharge(
      deliveryChargeId
    );

    order.totalAmount = cart.fgrosstotalAmount;
    order.discountAmount = cart.discountAmount || 0;
    order.discountType = cart.discountType || null;
    order.deliveryCharge = deliveryCharge;
    order.finalAmount = cart.finalAmount + deliveryCharge;
    order.shippingInfo.deliveryZone = name;

    // Payment method
    const transId = `INV-${crypto
      .randomUUID()
      .split("-")[0]
      .toLocaleUpperCase()}`;
      
    // invoice database make
    const invoice = await invoiceModel.create({
      invoiceId: transId,
      order: order._id,
      customerDetails: shippingInfo,
      totalAmount: order.totalAmount,
      discountAmount: order.discountAmount,
      deliveryCharge: order.deliveryCharge,
      finalAmount: order.finalAmount,
    });

    // CashOn delivery
    if (paymentMethod == "cod") {
      order.paymentMethod = "cod";
      order.paymentStatus = "pending";
      order.transactionId = transId;
      order.orderStatus = "pending";
      order.invoiceId = invoice.invoiceId;
    } else {

    }
  } catch (error) {}

  apiResponse.sendSucess(res, 200, "Brand created successfully!!", cart);
});
