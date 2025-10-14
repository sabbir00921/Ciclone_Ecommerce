const crypto = require("crypto");
const SSLCommerzPayment = require("sslcommerz-lts");
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
const { mailer } = require("../helpers/nodemailer");
const { orderConfirmation } = require("../template/registration.template");

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = process.env.NODE_ENV == "development" ? false : true;

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

  const cart = await cartModel.findOne(query);
  // .populate("items.product")
  // .populate("items.variant");
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
      // followUp: req.user || "N/A",
      totalQuantity: cart.totalQuantity,
    });

    // merge delevery charge
    const { name, deliveryCharge } = await applydeliveryCharge(
      deliveryChargeId
    );

    order.grosstotalAmount = cart.grosstotalAmount;
    order.totalAmount = cart.finalAmount;
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
      grosstotalAmount: order.grosstotalAmount,
      totalAmount: order.totalAmount,
      discountAmount: order.discountAmount,
      discountType: order.discountType,
      deliveryCharge: order.deliveryCharge,
      finalAmount: order.finalAmount,
    });

    // Decrease product and variant and update sales quantity
    await Promise.all(allStockAdjustPromice);

    // CashOn delivery
    if (paymentMethod == "cod") {
      order.paymentMethod = "cod";
      order.paymentStatus = "pending";
      order.transactionId = transId;
      order.orderStatus = "pending";
      order.invoiceId = invoice.invoiceId;
    } else {
      const data = {
        total_amount: order.finalAmount,
        currency: "BDT",
        tran_id: transId, // use unique tran_id for each api call
        success_url: `${process.env.BACKEND_URL}${process.env.BASE_API}/payment/succes`,
        fail_url: `${process.env.BACKEND_URL}${process.env.BASE_API}/payment/fail`,
        cancel_url: `${process.env.BACKEND_URL}${process.env.BASE_API}/payment/cancel`,
        ipn_url: `${process.env.BACKEND_URL}${process.env.BASE_API}/payment/ipn`,
        shipping_method: "NO",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: shippingInfo.fullName,
        cus_email: shippingInfo.email,
        cus_add1: shippingInfo.address,
        cus_city: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: shippingInfo.phone,

        // ship_name: "Customer Name",
        // ship_add1: "Dhaka",
        // ship_city: "Dhaka",
        // ship_state: "Dhaka",
        // ship_postcode: 1000,
        // ship_country: "Bangladesh",
      };
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      const sslResponse = await sslcz.init(data);
      // console.log(sslResponse);

      // if SSLCommerzPayment update db from here
      order.invoiceId = invoice.invoiceId;
      const updatedOrder = await order.save();

      let template = orderConfirmation(updatedOrder);
      // send confirmation mail to user
      sentMail(
        "Order is confirmed",
        template,
        shippingInfo?.email || updatedOrder?.shippingInfo?.email
      );

      apiResponse.sendSucess(res, 200, "Order created successfully!!", {
        url: sslResponse.GatewayPageURL,
        orderData: updatedOrder,
      });
      return;
    }
    // if cod update db from here
    const updatedOrder = await order.save();
    apiResponse.sendSucess(
      res,
      200,
      "Order created successfully!!",
      updatedOrder
    );
  } catch (error) {
    // rollback stock of product
    let allStockAdjustPromice = [];

    if (order && order._id) {
      for (let item of cart.items) {
        if (item.product) {
          allStockAdjustPromice.push(
            productModel.findOneAndUpdate(
              { _id: item.product._id },
              {
                $inc: { totalStock: +item.quantity, totalSale: -item.quantity },
              }
            )
          );
        }
        if (item.variant) {
          allStockAdjustPromice.push(
            variantModel.findOneAndUpdate(
              { _id: item.variant._id },
              {
                $inc: {
                  stockVariant: +item.quantity,
                  totalSale: -item.quantity,
                },
              }
            )
          );
        }
      }
    }
    await Promise.all(allStockAdjustPromice);

    console.log(error);
    throw new CustomError(401, "order Create failed", error);
  }
});

// sent confirmation mail
const sentMail = async (subject, template, email) => {
 await mailer(subject, template, email);
};
