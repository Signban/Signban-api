class BoardRealtimeService {
	static emitToBoard(req, boardId, eventName, payload) {
		const io = req.app.get("io");

		if (!io) return;

		io.to(`board:${boardId}`).emit(eventName, payload);
	}
}

module.exports = BoardRealtimeService;
