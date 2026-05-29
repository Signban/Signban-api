const { verifyToken } = require("../helpers/jwt");

function registerNotificationSocket(io, socket) {
	socket.on("notification:join", ({ token } = {}) => {
		try {
			if (!token) return;

			const payload = verifyToken(token);

			if (!payload?.id) return;

			socket.join(`user:${payload.id}`);
			console.log(`Socket ${socket.id} joined user:${payload.id}`);
		} catch (error) {
			console.log("notification:join failed:", error.message);
		}
	});

	socket.on("notification:leave", ({ userId } = {}) => {
		if (!userId) return;

		socket.leave(`user:${userId}`);
		console.log(`Socket ${socket.id} left user:${userId}`);
	});
}

module.exports = registerNotificationSocket;
