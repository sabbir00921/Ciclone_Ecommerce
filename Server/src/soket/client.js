const chalk = require("chalk");
const { io } = require("socket.io-client");

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  query: { userId: "123" },
  // query: { userId: "68a6f5a421fe79a12bf4a095" },
});

// connect socket
socket.on("connect", () => {
  console.log(chalk.green("Client server connected:"));
});
// addtocart event listener
socket.on("cart", (data) => {
  console.log("Data is:", data);
});

// disconnect socket
socket.on("disconnect", () => {
  console.log(chalk.bgRed("Disconnect from server"));
});

//connect Error
socket.on("connect_error ", (err) => {
  console.log(chalk.bgYellow("Connection Error"), err.message);
});
