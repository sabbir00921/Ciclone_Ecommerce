const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { globalErrorhandaler } = require("./helpers/globalErrorHandaler");
/**
 * all global middleware
 */
app.use(express.json());
app.use(express.urlencoded({ urlencoded: true }));
app.use(cookieParser());
app.use(cors());

// route
app.use("/api/v1", require("./routes/index.api"));

// global error handleing middleware
/**
 * must be last
 */
app.use(globalErrorhandaler);

module.exports = { app };
