function registerBoardSocket(io, socket) {
	socket.on("board:join", (boardId) => {
		socket.join(`board:${boardId}`);
		console.log(`Socket ${socket.id} joined board:${boardId}`);
	});

	socket.on("board:leave", (boardId) => {
		socket.leave(`board:${boardId}`);
		console.log(`Socket ${socket.id} left board:${boardId}`);
	});

	socket.on("card:drag-start", ({ boardId, cardId, userName }) => {
		socket.to(`board:${boardId}`).emit("card:drag-start", {
			cardId,
			userName,
		});
	});

	socket.on("card:drag-end", ({ boardId, cardId }) => {
		socket.to(`board:${boardId}`).emit("card:drag-end", {
			cardId,
		});
	});
}

module.exports = registerBoardSocket;
