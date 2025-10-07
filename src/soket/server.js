let io = null;
const { Server } = require("socket.io");
const { CustomError } = require("../helpers/customError");

// soket server
module.exports = {
  initSocket: (hostServer) => {
    io = new Server(hostServer, {
      cors: {
        origin: "*",
      },
    });
    // connect socket
    io.on("connection", (socket) => {
      console.log("Socket server connected", socket.id);
      const userId = socket.handshake.query.userId;
      console.log(userId);
      if (userId) {
        socket.join(userId);
      }
    });

    io.on("disconnect", () => {
      console.log("Client server disconnected");
    });
  },
  getIo: () => {
    if (!io) throw new CustomError(401, "Socket.io not initialized");
    return io;
  },
};
