const registerBoardSocket = require("./boardSocket");

function registerSocket(io) {
	io.on("connection", (socket) => {
		console.log("Socket connected:", socket.id);

		registerBoardSocket(io, socket);

		socket.on("disconnect", () => {
			console.log("Socket disconnected:", socket.id);
		});
	});
}

module.exports = registerSocket;
