function registerBoardSocket(io, socket) {
	socket.on("board:join", (boardId) => {
		socket.join(`board:${boardId}`);
		console.log(`Socket ${socket.id} joined board:${boardId}`);
	});

	socket.on("board:leave", (boardId) => {
		socket.leave(`board:${boardId}`);
		console.log(`Socket ${socket.id} left board:${boardId}`);
	});

	socket.on("list:drag-start", ({ boardId, listId, userName }) => {
		socket.to(`board:${boardId}`).emit("list:drag-start", {
			listId,
			userName,
		});
	});

	socket.on("list:drag-end", ({ boardId, listId }) => {
		socket.to(`board:${boardId}`).emit("list:drag-end", {
			listId,
		});
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

	socket.on("comment:typing-start", ({ boardId, cardId, userName }) => {
		socket.to(`board:${boardId}`).emit("comment:typing-start", {
			cardId: Number(cardId),
			userName: userName || "Someone",
		});
	});

	socket.on("comment:typing-stop", ({ boardId, cardId }) => {
		socket.to(`board:${boardId}`).emit("comment:typing-stop", {
			cardId: Number(cardId),
		});
	});
}

module.exports = registerBoardSocket;
