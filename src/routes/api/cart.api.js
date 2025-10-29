const express = require("express");
const cartController = require("../../controller/cart.controller");
const { authGuard } = require("../../middleware/auth.middleware");
const { authorized } = require("../../middleware/authorize.middleware");
const _ = express.Router();

_.route("/addtocart").post(
  authGuard,
  authorized("add"),
  cartController.addtocart
);
_.route("/decrease-quantity").put(cartController.decreaseQuantity);
_.route("/increase-quantity").put(cartController.increaseQuantity);
_.route("/delete-item").delete(cartController.deleteCartItem);

module.exports = _;
