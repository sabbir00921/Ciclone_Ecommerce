const { asyncHandaler } = require("../utils/async.Handler");
const { CustomError } = require("../helpers/customError");
const { apiResponse } = require("../utils/apiResponse");
const { validateCart } = require("../validation/cart.validation");
const cartModel = require("../model/cart.model");
const productModel = require("../model/product.model");
const variantModel = require("../model/variant.model");
const couponModel = require("../model/coupon.model");

// apply coupon
const applyCoupon = async (
  totalPrice,
  couponCode,
  existingCouponCode = null
) => {
  if (!couponCode) return totalPrice;
  try {
    let afterDiscountPrice = 0;

    const coupon = await couponModel.findOne({ code: couponCode });
    if (!coupon) throw new CustomError(400, "Coupon not found");
    // checks expiredate
    if (Date.now() >= coupon.expireAt)
      throw new CustomError(400, "Coupon is expired");
    if (coupon.usageLimit < coupon.usedCount)
      throw new CustomError(400, "Coupon Limit expired");

    if (coupon.discountType == "percentage") {
      if (couponCode !== existingCouponCode) {
        coupon.usedCount += 1;
      }
      discountValue = Math.ceil(totalPrice * coupon.discountValue) / 100;
      afterDiscountPrice = totalPrice - discountValue;
    }
    if (coupon.discountType == "tk") {
      if (couponCode !== existingCouponCode) {
        coupon.usedCount += 1;
      }
      afterDiscountPrice = totalPrice - coupon.discountValue;
    }
    const couponDetails = await coupon.save();

    return {
      afterApplyCouponPrice: afterDiscountPrice,
      discountType: coupon.discountType,
      discountAmount: coupon.discountValue,
      couponId: coupon._id,
      couponCode: coupon.code,
    };
  } catch (error) {
    console.log("error in apply coupon", error);
  }
};

// Add to cart method
exports.addtocart = asyncHandaler(async (req, res) => {
  const data = await validateCart(req);
  let product = null;
  let variant = null;
  let price = {};

  // find product info
  if (data?.product) {
    const productItem = await productModel.findOne({ _id: data.product });
    price = productItem.retailPrice;
  }
  if (data?.variant) {
    const variantItem = await variantModel.findOne({ _id: data.variant });
    price = variantItem.retailPrice;
  }

  // Find user or guest id into cart model
  let cartQuery = {};
  if (data.user) {
    cartQuery = { user: data.user };
  } else {
    cartQuery = { guestId: data.guestId };
  }
  let cart = await cartModel.findOne(cartQuery);
  if (!cart) {
    cart = new cartModel({
      user: data?.user || null,
      guestId: data?.guestId || null,
      items: [],
      coupon: data.coupon,
    });
  }
  // find product or variant into cart
  let findIndex = -1;
  if (data.variant) {
    findIndex = cart.items.findIndex(
      (item) => item.variant?.toString() == data.variant
    );
  } else {
    findIndex = cart.items.findIndex(
      (item) => item.product?.toString() == data.product
    );
  }

  // now update the items fields
  if (findIndex > -1) {
    cart.items[findIndex].quantity += data.quantity;
    cart.items[findIndex].price = price;
    cart.items[findIndex].totalPrice = Math.ceil(
      cart.items[findIndex].quantity * price
    );
  } else {
    cart.items.push({
      product: data.product,
      variant: data.variant,
      quantity: data.quantity,
      price: price,
      totalPrice: Math.ceil(price * data.quantity),
      size: data.size,
      color: data.color,
    });
  }

  // add value into other fields

  // calculate total price
  const totalCartItemPrice = cart.items.reduce(
    (acc, item) => {
      acc.totalPrice += item.totalPrice;
      acc.totalQuantity += item.quantity;
      return acc;
    },
    {
      totalPrice: 0,
      totalQuantity: 0,
    }
  );

  const { totalPrice, totalQuantity } = totalCartItemPrice;
  // coupon apply
  const afterApplyCoupon = await applyCoupon(
    totalPrice,
    data?.coupon || cart.couponCode,
    cart.couponCode
  );

  //  now save into database
  if (typeof afterApplyCoupon == "object") {
    cart.grosstotalAmount = totalPrice;
    cart.totalQuantity = totalQuantity;
    cart.coupon = afterApplyCoupon.couponId || null;
    cart.couponCode = afterApplyCoupon.couponCode;
    cart.finalAmount = afterApplyCoupon.afterApplyCouponPrice;
    cart.discountAmount = afterApplyCoupon.discountAmount;
    cart.discountType = afterApplyCoupon.discountType;
  } else {
    cart.finalAmount = totalPrice;
    cart.grosstotalAmount = totalPrice;
    cart.totalQuantity = totalQuantity;
    cart.coupon = null;
    cart.couponCode = null;
    cart.discountAmount = 0;
    cart.discountType = null;
  }

  // save the cart database
  await cart.save();

  apiResponse.sendSucess(res, 200, "Brand created successfully!!", cart);
});

// decrease quantity
exports.decreaseQuantity = asyncHandaler(async (req, res) => {
  const user = req.userId || req.body.user;
  const { guestId, cartitemId } = req.body;

  // find cart with user or guestId
  let Query = user ? { user: user } : { guestId: guestId };

  const cart = await cartModel.findOne(Query);

  // Find The actual items
  const indexNumber = cart.items.findIndex((item) => item._id == cartitemId);
  const targetCartItem = cart.items[indexNumber];
  if (targetCartItem.quantity > 1) {
    targetCartItem.quantity -= 1;
    targetCartItem.totalPrice = targetCartItem.price * targetCartItem.quantity;
  } else {
    throw new CustomError(401, "Atleast have one item");
  }
  // calculate total price
  const totalCartItemPrice = cart.items.reduce(
    (acc, item) => {
      acc.totalPrice += item.totalPrice;
      acc.totalQuantity += item.quantity;
      return acc;
    },
    {
      totalPrice: 0,
      totalQuantity: 0,
    }
  );
  const { totalPrice, totalQuantity } = totalCartItemPrice;

  // coupon apply
  const afterApplyCoupon = await applyCoupon(
    totalPrice,
    cart?.couponCode,
    cart?.couponCode
  );

  //  now save into database
  if (typeof afterApplyCoupon == "object") {
    cart.grosstotalAmount = totalPrice;
    cart.discountAmount = afterApplyCoupon.discountAmount;
    cart.finalAmount = afterApplyCoupon.afterApplyCouponPrice;
    cart.totalQuantity = totalQuantity;
    cart.coupon = afterApplyCoupon.couponId || null;
    cart.discountType = afterApplyCoupon.discountType;
  } else {
    cart.grosstotalAmount = totalPrice;
    cart.discountAmount = 0;
    cart.finalAmount = totalPrice;
    cart.totalQuantity = totalQuantity;
    cart.coupon = null;
    cart.couponCode = null;
    cart.discountType = null;
  }
  await cart.save();

  apiResponse.sendSucess(res, 200, "Cart Item decrease successfully!!", cart);
});

// increase quantity
exports.increaseQuantity = asyncHandaler(async (req, res) => {
  const user = req.userId || req.body.user;
  const { guestId, cartitemId } = req.body;

  // find cart with user or guestId
  let Query = user ? { user: user } : { guestId: guestId };

  const cart = await cartModel.findOne(Query);

  // Find The actual items
  const indexNumber = cart.items.findIndex((item) => item._id == cartitemId);
  const targetCartItem = cart.items[indexNumber];

  if (targetCartItem.quantity >= 1) {
    targetCartItem.quantity += 1;
    targetCartItem.totalPrice = targetCartItem.price * targetCartItem.quantity;
  } else {
    throw new CustomError(401, "Imcrement failed");
  }

  // calculate total price
  const totalCartItemPrice = cart.items.reduce(
    (acc, item) => {
      acc.totalPrice += item.totalPrice;
      acc.totalQuantity += item.quantity;
      return acc;
    },
    {
      totalPrice: 0,
      totalQuantity: 0,
    }
  );
  const { totalPrice, totalQuantity } = totalCartItemPrice;
  // coupon apply
  const afterApplyCoupon = await applyCoupon(
    totalPrice,
    cart?.couponCode,
    cart.couponCode
  );

  //  now save into database
  if (typeof afterApplyCoupon == "object") {
    cart.grosstotalAmount = totalPrice;
    cart.discountAmount = afterApplyCoupon.discountAmount;
    cart.finalAmount = afterApplyCoupon.afterApplyCouponPrice;
    cart.totalQuantity = totalQuantity;
    cart.coupon = afterApplyCoupon.couponId || null;
    cart.discountType = afterApplyCoupon.discountType;
  } else {
    cart.grosstotalAmount = totalPrice;
    cart.discountAmount = 0;
    cart.finalAmount = totalPrice;
    cart.totalQuantity = totalQuantity;
    cart.coupon = null;
    cart.couponCode = null;
    cart.discountType = null;
  }
  await cart.save();
  
  apiResponse.sendSucess(res, 200, "Cart Item increase successfully!!", cart);
});

// delete cart item
exports.deleteCartItem = asyncHandaler(async (req, res) => {
  const user = req.userId || req.body.user;
  const { guestId, cartitemId } = req.body;

  // find cart with user or guestId
  let Query = user ? { user: user } : { guestId: guestId };
  const cart = await cartModel.findOne(Query);
  if (!cart) throw new CustomError(404, "Cart not found");

  // Find all due items
  cart.items = cart.items.filter((item) => item._id.toString() !== cartitemId);

  // calculate total price
  const totalCartItemPrice = cart.items.reduce(
    (acc, item) => {
      acc.totalPrice += item.totalPrice;
      acc.totalQuantity += item.quantity;
      return acc;
    },
    {
      totalPrice: 0,
      totalQuantity: 0,
    }
  );
  const { totalPrice, totalQuantity } = totalCartItemPrice;
  // coupon apply
  const afterApplyCoupon = await applyCoupon(
    totalPrice,
    cart?.couponCode,
    cart.couponCode
  );

  //  now save into database
  if (typeof afterApplyCoupon == "object") {
    cart.grosstotalAmount = totalPrice;
    cart.discountAmount = afterApplyCoupon.discountAmount;
    cart.finalAmount = afterApplyCoupon.afterApplyCouponPrice;
    cart.totalQuantity = totalQuantity;
    cart.coupon = afterApplyCoupon.couponId || null;
    cart.discountType = afterApplyCoupon.discountType;
  } else {
    cart.grosstotalAmount = totalPrice;
    cart.discountAmount = 0;
    cart.finalAmount = totalPrice;
    cart.totalQuantity = totalQuantity;
    cart.coupon = null;
    cart.couponCode = null;
    cart.discountType = null;
  }
  // save and update the cart database
  await cart.save();

  // If there is no item in cart then delete cart
  if (cart.items.length === 0) {
    await cartModel.findOneAndDelete({ _id: cart._id });
    return apiResponse.sendSucess(
      res,
      200,
      "Cart Deleted/removed successfully!!",
      null
    );
  }

  apiResponse.sendSucess(res, 200, "Cart Item Deleted successfully!!", cart);
});
 