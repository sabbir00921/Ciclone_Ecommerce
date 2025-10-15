const express = require("express");
const orderController = require("../../controller/order.controller");
const _ = express.Router();

_.route("/create-order").post(orderController.createOrder);
_.route("/all-order").get(orderController.allOrder);

module.exports = _;
