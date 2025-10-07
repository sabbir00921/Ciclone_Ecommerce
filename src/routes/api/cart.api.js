const express = require("express");
const cartController = require("../../controller/cart.controller");
const _ = express.Router();

_.route("/addtocart").post(cartController.addtocart);
_.route("/decrease-quantity").put(cartController.decreaseQuantity);
_.route("/increase-quantity").put(cartController.increaseQuantity);
_.route("/delete-item").delete(cartController.deleteCartItem);

module.exports = _;
