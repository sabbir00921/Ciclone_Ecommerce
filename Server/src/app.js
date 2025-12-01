const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { globalErrorhandaler } = require("./helpers/globalErrorHandaler");
const { initSocket } = require("./soket/server");
/**
 * all global middleware
 */
// make note server using express
const server = http.createServer(app);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("short"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5171" }));

// route
app.use(process.env.BASE_API || "/api/v1", require("./routes/index.api"));

// global error handleing middleware
/**
 * must be last position
 */
app.use(globalErrorhandaler);
const io = initSocket(server);

module.exports = { server, io };
