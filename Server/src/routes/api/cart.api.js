const express = require("express");
const cartController = require("../../controller/cart.controller");
const { authGuard } = require("../../middleware/auth.middleware");
const { authorized } = require("../../middleware/authorize.middleware");
const _ = express.Router();

_.route("/addtocart").post(
  authGuard,
  authorized("cart", "add"),
  cartController.addtocart
);
_.route("/decrease-quantity").put(
  authGuard,
  authorized("cart", "edit"),
  cartController.decreaseQuantity
);
_.route("/increase-quantity").put(
  authGuard,
  authorized("cart", "edit"),
  cartController.increaseQuantity
);
_.route("/delete-item").delete(
  authGuard,
  authorized("cart", "delete"),
  cartController.deleteCartItem
);

module.exports = _;
