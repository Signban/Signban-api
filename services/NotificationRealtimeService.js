class NotificationRealtimeService {
	static emitToUser(req, userId, notification) {
		const io = req.app.get("io");

		if (!io || !userId || !notification) return;

		io.to(`user:${userId}`).emit("notification:new", {
			notification,
		});
	}
}

module.exports = NotificationRealtimeService;
