const registerBoardSocket = require("./boardSocket");
const registerNotificationSocket = require("./notificationSocket");

function registerSocket(io) {
	io.on("connection", (socket) => {
		console.log("Socket connected:", socket.id);

		registerBoardSocket(io, socket);
		registerNotificationSocket(io, socket);

		socket.on("disconnect", () => {
			console.log("Socket disconnected:", socket.id);
		});
	});
}

module.exports = registerSocket;
