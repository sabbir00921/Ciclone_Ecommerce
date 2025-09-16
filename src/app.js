const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const { globalErrorhandaler } = require("./helpers/globalErrorHandaler");
/**
 * all global middleware
 */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("short"));
}
app.use(express.json());
app.use(express.urlencoded({ urlencoded: true }));
app.use(cookieParser());
app.use(cors());

// route
app.use("/api/v1", require("./routes/index.api"));

// global error handleing middleware
/**
 * must be last position
 */
app.use(globalErrorhandaler);

module.exports = { app };
