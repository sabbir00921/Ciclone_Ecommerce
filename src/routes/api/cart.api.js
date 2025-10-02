const express = require("express");
const cartController = require("../../controller/cart.controller");
const _ = express.Router();

_.route("/addtocart").post(cartController.addtocart);

module.exports = _;
