const express = require("express");
const orderController = require("../../controller/order.controller");
const _ = express.Router();

_.route("/create-order").post(orderController.createOrder);
_.route("/all-order").get(orderController.allOrder);
_.route("/update-order/:id").put(orderController.updateOrder);
_.route("/status-order").get(orderController.getAllOrderStatusAndUpdateInfo);
_.route("/delete-order/:id").delete(orderController.deleteOrder);
_.route("/create-courier").post(orderController.createCourier);

module.exports = _;
