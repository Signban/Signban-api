"use strict";

const { QueryTypes, Op } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");

const userSeeds = [
	{
		name: "Wahyu ganteng",
		email: "wahyugans@signban.com",
		password: "password123",
		avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Brahmantio",
	},
	{
		name: "Aldi Pratama",
		email: "aldi@signban.com",
		password: "password123",
		avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Aldi",
	},
	{
		name: "Citra Lestari",
		email: "citra@signban.com",
		password: "password123",
		avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Citra",
	},
	{
		name: "Dimas Saputra",
		email: "dimas@signban.com",
		password: "password123",
		avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Dimas",
	},
	{
		name: "Naya Kirana",
		email: "naya@signban.com",
		password: "password123",
		avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Naya",
	},
	{
		name: "Samsudin",
		email: "samsudin@signban.com",
		password: "password123",
		avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Samsudin",
	},
];

const boardSeeds = [
	{
		name: "Final Project Signban",
		description: "Board untuk tracking task final project realtime kanban app.",
		ownerEmail: "wahyugans@signban.com",
	},
	{
		name: "Joburaku Development",
		description: "Board untuk tracking enhancement aplikasi Joburaku.",
		ownerEmail: "wahyugans@signban.com",
	},
	{
		name: "Portfolio Website",
		description: "Board untuk merapikan portfolio dan blog pribadi.",
		ownerEmail: "citra@signban.com",
	},
	{
		name: "Company Website",
		description: "Board kolaborasi redesign landing page company profile.",
		ownerEmail: "aldi@signban.com",
	},
];

const boardMemberSeeds = [
	// Final Project Signban
	{
		boardName: "Final Project Signban",
		userEmail: "wahyugans@signban.com",
		role: "owner",
		addedByEmail: "wahyugans@signban.com",
	},
	{
		boardName: "Final Project Signban",
		userEmail: "aldi@signban.com",
		role: "member",
		addedByEmail: "wahyugans@signban.com",
	},
	{
		boardName: "Final Project Signban",
		userEmail: "citra@signban.com",
		role: "member",
		addedByEmail: "wahyugans@signban.com",
	},
	{
		boardName: "Final Project Signban",
		userEmail: "dimas@signban.com",
		role: "member",
		addedByEmail: "wahyugans@signban.com",
	},
	{
		boardName: "Final Project Signban",
		userEmail: "samsudin@signban.com",
		role: "member",
		addedByEmail: "wahyugans@signban.com",
	},

	// Joburaku Development
	{
		boardName: "Joburaku Development",
		userEmail: "wahyugans@signban.com",
		role: "owner",
		addedByEmail: "wahyugans@signban.com",
	},
	{
		boardName: "Joburaku Development",
		userEmail: "aldi@signban.com",
		role: "member",
		addedByEmail: "wahyugans@signban.com",
	},
	{
		boardName: "Joburaku Development",
		userEmail: "naya@signban.com",
		role: "member",
		addedByEmail: "wahyugans@signban.com",
	},

	// Portfolio Website
	{
		boardName: "Portfolio Website",
		userEmail: "citra@signban.com",
		role: "owner",
		addedByEmail: "citra@signban.com",
	},
	{
		boardName: "Portfolio Website",
		userEmail: "wahyugans@signban.com",
		role: "member",
		addedByEmail: "citra@signban.com",
	},
	{
		boardName: "Portfolio Website",
		userEmail: "dimas@signban.com",
		role: "member",
		addedByEmail: "citra@signban.com",
	},

	// Company Website
	{
		boardName: "Company Website",
		userEmail: "aldi@signban.com",
		role: "owner",
		addedByEmail: "aldi@signban.com",
	},
	{
		boardName: "Company Website",
		userEmail: "naya@signban.com",
		role: "member",
		addedByEmail: "aldi@signban.com",
	},
	{
		boardName: "Company Website",
		userEmail: "citra@signban.com",
		role: "member",
		addedByEmail: "aldi@signban.com",
	},
];

const listNames = ["Backlog", "Todo", "In Progress", "Review", "Done"];

const cardSeeds = [
	{
		boardName: "Final Project Signban",
		listName: "Todo",
		createdByEmail: "wahyugans@signban.com",
		title: "Setup Authentication",
		description:
			"Implement register, login, JWT authentication, dan middleware auth.",
		priority: "high",
		dueDate: "2026-05-30T10:00:00.000Z",
		position: 1,
	},
	{
		boardName: "Final Project Signban",
		listName: "In Progress",
		createdByEmail: "wahyugans@signban.com",
		title: "Build Board Dashboard",
		description:
			"Tampilkan list board milik user, create board modal, dan daftar member memakai avatar.",
		priority: "high",
		dueDate: "2026-06-01T10:00:00.000Z",
		position: 1,
	},
	{
		boardName: "Final Project Signban",
		listName: "Backlog",
		createdByEmail: "aldi@signban.com",
		title: "Realtime Drag & Drop Card",
		description:
			"Update ListId dan position saat card dipindahkan, lalu broadcast socket event card:moved.",
		priority: "urgent",
		dueDate: "2026-06-03T10:00:00.000Z",
		position: 1,
	},
	{
		boardName: "Final Project Signban",
		listName: "Review",
		createdByEmail: "citra@signban.com",
		title: "AI Generate Checklist",
		description:
			"Generate checklist otomatis dari title dan description card menggunakan AI.",
		priority: "medium",
		dueDate: "2026-06-04T10:00:00.000Z",
		position: 1,
	},
	{
		boardName: "Final Project Signban",
		listName: "Backlog",
		createdByEmail: "dimas@signban.com",
		title: "Deploy Signban API",
		description:
			"Deploy Express API ke server, setup PM2, environment variable, dan reverse proxy Nginx.",
		priority: "high",
		dueDate: "2026-06-05T10:00:00.000Z",
		position: 2,
	},
	{
		boardName: "Joburaku Development",
		listName: "In Progress",
		createdByEmail: "wahyugans@signban.com",
		title: "Fix CV PDF Download",
		description:
			"Perbaiki konfigurasi Puppeteer executable path di production server.",
		priority: "high",
		dueDate: "2026-05-31T10:00:00.000Z",
		position: 1,
	},
	{
		boardName: "Joburaku Development",
		listName: "Todo",
		createdByEmail: "aldi@signban.com",
		title: "Add Job Search Filter UI",
		description:
			"Tambah filter keyword, lokasi, negara, date posted, dan work from home di job search page.",
		priority: "medium",
		dueDate: "2026-06-02T10:00:00.000Z",
		position: 1,
	},
	{
		boardName: "Joburaku Development",
		listName: "Done",
		createdByEmail: "naya@signban.com",
		title: "Improve Profile Upload Flow",
		description:
			"Rapikan flow upload foto profil ke Cloudinary dan update current user state.",
		priority: "medium",
		dueDate: "2026-05-28T10:00:00.000Z",
		position: 1,
	},
	{
		boardName: "Portfolio Website",
		listName: "Todo",
		createdByEmail: "citra@signban.com",
		title: "Create Hero Section Animation",
		description:
			"Buat animasi hero section portfolio menggunakan GSAP yang tetap ringan.",
		priority: "low",
		dueDate: "2026-06-06T10:00:00.000Z",
		position: 1,
	},
	{
		boardName: "Portfolio Website",
		listName: "Backlog",
		createdByEmail: "wahyugans@signban.com",
		title: "Write Blog CMS Schema",
		description:
			"Rancang schema sederhana untuk blog CMS pribadi seperti posts, categories, dan tags.",
		priority: "medium",
		dueDate: "2026-06-08T10:00:00.000Z",
		position: 1,
	},
	{
		boardName: "Company Website",
		listName: "Todo",
		createdByEmail: "aldi@signban.com",
		title: "Redesign Landing Page Copy",
		description:
			"Perbaiki copywriting landing page agar lebih jelas untuk user baru.",
		priority: "medium",
		dueDate: "2026-06-07T10:00:00.000Z",
		position: 1,
	},
];

const cardAssigneeSeeds = [
	{
		cardTitle: "Setup Authentication",
		userEmail: "wahyugans@signban.com",
		assignedByEmail: "wahyugans@signban.com",
	},
	{
		cardTitle: "Setup Authentication",
		userEmail: "aldi@signban.com",
		assignedByEmail: "wahyugans@signban.com",
	},
	{
		cardTitle: "Build Board Dashboard",
		userEmail: "citra@signban.com",
		assignedByEmail: "wahyugans@signban.com",
	},
	{
		cardTitle: "Realtime Drag & Drop Card",
		userEmail: "aldi@signban.com",
		assignedByEmail: "wahyugans@signban.com",
	},
	{
		cardTitle: "AI Generate Checklist",
		userEmail: "samsudin@signban.com",
		assignedByEmail: "wahyugans@signban.com",
	},
	{
		cardTitle: "Deploy Signban API",
		userEmail: "dimas@signban.com",
		assignedByEmail: "wahyugans@signban.com",
	},
	{
		cardTitle: "Fix CV PDF Download",
		userEmail: "wahyugans@signban.com",
		assignedByEmail: "wahyugans@signban.com",
	},
	{
		cardTitle: "Add Job Search Filter UI",
		userEmail: "aldi@signban.com",
		assignedByEmail: "wahyugans@signban.com",
	},
	{
		cardTitle: "Improve Profile Upload Flow",
		userEmail: "naya@signban.com",
		assignedByEmail: "wahyugans@signban.com",
	},
	{
		cardTitle: "Create Hero Section Animation",
		userEmail: "citra@signban.com",
		assignedByEmail: "citra@signban.com",
	},
	{
		cardTitle: "Write Blog CMS Schema",
		userEmail: "wahyugans@signban.com",
		assignedByEmail: "citra@signban.com",
	},
	{
		cardTitle: "Redesign Landing Page Copy",
		userEmail: "naya@signban.com",
		assignedByEmail: "aldi@signban.com",
	},
];

const checklistSeeds = [
	{
		cardTitle: "Setup Authentication",
		title: "Create register endpoint",
		createdByEmail: "wahyugans@signban.com",
		isCompleted: true,
		isAiGenerated: false,
		position: 1,
	},
	{
		cardTitle: "Setup Authentication",
		title: "Create login endpoint",
		createdByEmail: "wahyugans@signban.com",
		isCompleted: true,
		isAiGenerated: false,
		position: 2,
	},
	{
		cardTitle: "Setup Authentication",
		title: "Generate JWT access token",
		createdByEmail: "wahyugans@signban.com",
		isCompleted: false,
		isAiGenerated: false,
		position: 3,
	},
	{
		cardTitle: "Build Board Dashboard",
		title: "Fetch boards from API",
		createdByEmail: "citra@signban.com",
		isCompleted: true,
		isAiGenerated: false,
		position: 1,
	},
	{
		cardTitle: "Build Board Dashboard",
		title: "Render board card with member avatars",
		createdByEmail: "citra@signban.com",
		isCompleted: false,
		isAiGenerated: false,
		position: 2,
	},
	{
		cardTitle: "Realtime Drag & Drop Card",
		title: "Install drag and drop library",
		createdByEmail: "aldi@signban.com",
		isCompleted: false,
		isAiGenerated: true,
		position: 1,
	},
	{
		cardTitle: "Realtime Drag & Drop Card",
		title: "Emit card:moved after successful update",
		createdByEmail: "aldi@signban.com",
		isCompleted: false,
		isAiGenerated: true,
		position: 2,
	},
	{
		cardTitle: "AI Generate Checklist",
		title: "Create prompt from card title and description",
		createdByEmail: "samsudin@signban.com",
		isCompleted: false,
		isAiGenerated: true,
		position: 1,
	},
	{
		cardTitle: "AI Generate Checklist",
		title: "Save generated checklist to database",
		createdByEmail: "samsudin@signban.com",
		isCompleted: false,
		isAiGenerated: true,
		position: 2,
	},
	{
		cardTitle: "Deploy Signban API",
		title: "Setup PM2 ecosystem file",
		createdByEmail: "dimas@signban.com",
		isCompleted: false,
		isAiGenerated: false,
		position: 1,
	},
	{
		cardTitle: "Deploy Signban API",
		title: "Configure Nginx reverse proxy",
		createdByEmail: "dimas@signban.com",
		isCompleted: false,
		isAiGenerated: false,
		position: 2,
	},
	{
		cardTitle: "Fix CV PDF Download",
		title: "Set PUPPETEER_EXECUTABLE_PATH on server",
		createdByEmail: "wahyugans@signban.com",
		isCompleted: true,
		isAiGenerated: false,
		position: 1,
	},
	{
		cardTitle: "Add Job Search Filter UI",
		title: "Create filter form state",
		createdByEmail: "aldi@signban.com",
		isCompleted: false,
		isAiGenerated: false,
		position: 1,
	},
	{
		cardTitle: "Create Hero Section Animation",
		title: "Prepare GSAP timeline",
		createdByEmail: "citra@signban.com",
		isCompleted: false,
		isAiGenerated: false,
		position: 1,
	},
];

const commentSeeds = [
	{
		cardTitle: "Setup Authentication",
		userEmail: "wahyugans@signban.com",
		content: "Endpoint register dan login sudah mulai dibuat.",
	},
	{
		cardTitle: "Setup Authentication",
		userEmail: "aldi@signban.com",
		content: "Nanti aku bantu test dari frontend pakai Axios interceptor.",
	},
	{
		cardTitle: "Build Board Dashboard",
		userEmail: "citra@signban.com",
		content: "Layout board card sudah oke, tinggal rapihin responsive mobile.",
	},
	{
		cardTitle: "Realtime Drag & Drop Card",
		userEmail: "aldi@signban.com",
		content: "Untuk drag indicator cukup kirim card id dan user name saja.",
	},
	{
		cardTitle: "AI Generate Checklist",
		userEmail: "samsudin@signban.com",
		content: "Prompt AI bisa dibuat dari title, description, dan priority.",
	},
	{
		cardTitle: "Deploy Signban API",
		userEmail: "dimas@signban.com",
		content:
			"Pastikan migration dan seeder jalan di production sebelum pm2 restart.",
	},
	{
		cardTitle: "Fix CV PDF Download",
		userEmail: "wahyugans@signban.com",
		content: "Masalah ada di executable path Chromium server.",
	},
];

function mapBy(rows, keyName) {
	return rows.reduce((result, row) => {
		result[row[keyName]] = row;
		return result;
	}, {});
}

function unique(values) {
	return [...new Set(values)];
}

async function selectUsers(queryInterface, emails, transaction) {
	const rows = await queryInterface.sequelize.query(
		`SELECT id, name, email FROM "Users" WHERE email IN (:emails)`,
		{ replacements: { emails }, type: QueryTypes.SELECT, transaction },
	);
	return mapBy(rows, "email");
}

async function selectBoards(queryInterface, boardNames, transaction) {
	const rows = await queryInterface.sequelize.query(
		`SELECT id, name, "ownerId" FROM "Boards" WHERE name IN (:boardNames)`,
		{ replacements: { boardNames }, type: QueryTypes.SELECT, transaction },
	);
	return mapBy(rows, "name");
}

async function selectLists(queryInterface, boardNames, transaction) {
	const rows = await queryInterface.sequelize.query(
		`
		SELECT l.id, l.name, l."BoardId", b.name AS "boardName"
		FROM "Lists" l
		JOIN "Boards" b ON b.id = l."BoardId"
		WHERE b.name IN (:boardNames)
		`,
		{ replacements: { boardNames }, type: QueryTypes.SELECT, transaction },
	);

	return rows.reduce((result, row) => {
		result[`${row.boardName}:${row.name}`] = row;
		return result;
	}, {});
}

async function selectCards(queryInterface, cardTitles, transaction) {
	const rows = await queryInterface.sequelize.query(
		`
		SELECT c.id, c.title, c."BoardId", b.name AS "boardName"
		FROM "Cards" c
		JOIN "Boards" b ON b.id = c."BoardId"
		WHERE c.title IN (:cardTitles)
		`,
		{ replacements: { cardTitles }, type: QueryTypes.SELECT, transaction },
	);

	return mapBy(rows, "title");
}

module.exports = {
	async up(queryInterface) {
		const transaction = await queryInterface.sequelize.transaction();

		try {
			const now = new Date();
			const userEmails = userSeeds.map((user) => user.email);
			let usersByEmail = await selectUsers(
				queryInterface,
				userEmails,
				transaction,
			);

			const missingUsers = userSeeds.filter(
				(user) => !usersByEmail[user.email],
			);
			if (missingUsers.length) {
				await queryInterface.bulkInsert(
					"Users",
					missingUsers.map((user) => ({
						name: user.name,
						email: user.email,
						password: hashPassword(user.password),
						avatarUrl: user.avatarUrl,
						resetPasswordToken: null,
						resetPasswordExpiredAt: null,
						createdAt: now,
						updatedAt: now,
					})),
					{ transaction },
				);
			}

			usersByEmail = await selectUsers(queryInterface, userEmails, transaction);

			const boardNames = boardSeeds.map((board) => board.name);
			let boardsByName = await selectBoards(
				queryInterface,
				boardNames,
				transaction,
			);
			const missingBoards = boardSeeds.filter(
				(board) => !boardsByName[board.name],
			);

			if (missingBoards.length) {
				await queryInterface.bulkInsert(
					"Boards",
					missingBoards.map((board) => ({
						name: board.name,
						description: board.description,
						ownerId: usersByEmail[board.ownerEmail].id,
						createdAt: now,
						updatedAt: now,
					})),
					{ transaction },
				);
			}

			boardsByName = await selectBoards(
				queryInterface,
				boardNames,
				transaction,
			);

			const existingBoardMembers = await queryInterface.sequelize.query(
				`
				SELECT "BoardId", "UserId"
				FROM "BoardMembers"
				WHERE "BoardId" IN (:boardIds) AND "UserId" IN (:userIds)
				`,
				{
					replacements: {
						boardIds: Object.values(boardsByName).map((board) => board.id),
						userIds: Object.values(usersByEmail).map((user) => user.id),
					},
					type: QueryTypes.SELECT,
					transaction,
				},
			);
			const boardMemberKeys = new Set(
				existingBoardMembers.map(
					(member) => `${member.BoardId}:${member.UserId}`,
				),
			);
			const missingBoardMembers = boardMemberSeeds.filter((member) => {
				const BoardId = boardsByName[member.boardName].id;
				const UserId = usersByEmail[member.userEmail].id;
				return !boardMemberKeys.has(`${BoardId}:${UserId}`);
			});

			if (missingBoardMembers.length) {
				await queryInterface.bulkInsert(
					"BoardMembers",
					missingBoardMembers.map((member) => ({
						BoardId: boardsByName[member.boardName].id,
						UserId: usersByEmail[member.userEmail].id,
						role: member.role,
						addedById: usersByEmail[member.addedByEmail]?.id || null,
						joinedAt: now,
						createdAt: now,
						updatedAt: now,
					})),
					{ transaction },
				);
			}

			let listsByKey = await selectLists(
				queryInterface,
				boardNames,
				transaction,
			);
			const listSeeds = boardNames.flatMap((boardName) =>
				listNames.map((listName, index) => ({
					boardName,
					name: listName,
					position: index + 1,
					createdByEmail: boardSeeds.find((board) => board.name === boardName)
						.ownerEmail,
				})),
			);
			const missingLists = listSeeds.filter(
				(list) => !listsByKey[`${list.boardName}:${list.name}`],
			);

			if (missingLists.length) {
				await queryInterface.bulkInsert(
					"Lists",
					missingLists.map((list) => ({
						BoardId: boardsByName[list.boardName].id,
						name: list.name,
						position: list.position,
						createdById: usersByEmail[list.createdByEmail].id,
						createdAt: now,
						updatedAt: now,
					})),
					{ transaction },
				);
			}

			listsByKey = await selectLists(queryInterface, boardNames, transaction);

			const cardTitles = cardSeeds.map((card) => card.title);
			let cardsByTitle = await selectCards(
				queryInterface,
				cardTitles,
				transaction,
			);
			const missingCards = cardSeeds.filter(
				(card) => !cardsByTitle[card.title],
			);

			if (missingCards.length) {
				await queryInterface.bulkInsert(
					"Cards",
					missingCards.map((card) => ({
						BoardId: boardsByName[card.boardName].id,
						ListId: listsByKey[`${card.boardName}:${card.listName}`].id,
						createdById: usersByEmail[card.createdByEmail].id,
						coverUrl: null,
						title: card.title,
						description: card.description,
						priority: card.priority,
						dueDate: new Date(card.dueDate),
						position: card.position,
						createdAt: now,
						updatedAt: now,
					})),
					{ transaction },
				);
			}

			cardsByTitle = await selectCards(queryInterface, cardTitles, transaction);

			const existingCardAssignees = await queryInterface.sequelize.query(
				`
				SELECT "CardId", "UserId"
				FROM "CardAssignees"
				WHERE "CardId" IN (:cardIds) AND "UserId" IN (:userIds)
				`,
				{
					replacements: {
						cardIds: Object.values(cardsByTitle).map((card) => card.id),
						userIds: Object.values(usersByEmail).map((user) => user.id),
					},
					type: QueryTypes.SELECT,
					transaction,
				},
			);
			const cardAssigneeKeys = new Set(
				existingCardAssignees.map(
					(assignee) => `${assignee.CardId}:${assignee.UserId}`,
				),
			);
			const missingCardAssignees = cardAssigneeSeeds.filter((assignee) => {
				const CardId = cardsByTitle[assignee.cardTitle].id;
				const UserId = usersByEmail[assignee.userEmail].id;
				return !cardAssigneeKeys.has(`${CardId}:${UserId}`);
			});

			if (missingCardAssignees.length) {
				await queryInterface.bulkInsert(
					"CardAssignees",
					missingCardAssignees.map((assignee) => ({
						CardId: cardsByTitle[assignee.cardTitle].id,
						UserId: usersByEmail[assignee.userEmail].id,
						assignedById: usersByEmail[assignee.assignedByEmail]?.id || null,
						createdAt: now,
						updatedAt: now,
					})),
					{ transaction },
				);
			}

			const existingChecklists = await queryInterface.sequelize.query(
				`
				SELECT "CardId", title
				FROM "Checklists"
				WHERE "CardId" IN (:cardIds)
				`,
				{
					replacements: {
						cardIds: Object.values(cardsByTitle).map((card) => card.id),
					},
					type: QueryTypes.SELECT,
					transaction,
				},
			);
			const checklistKeys = new Set(
				existingChecklists.map(
					(checklist) => `${checklist.CardId}:${checklist.title}`,
				),
			);
			const missingChecklists = checklistSeeds.filter((checklist) => {
				const CardId = cardsByTitle[checklist.cardTitle].id;
				return !checklistKeys.has(`${CardId}:${checklist.title}`);
			});

			if (missingChecklists.length) {
				await queryInterface.bulkInsert(
					"Checklists",
					missingChecklists.map((checklist) => ({
						CardId: cardsByTitle[checklist.cardTitle].id,
						createdById: usersByEmail[checklist.createdByEmail]?.id || null,
						title: checklist.title,
						isCompleted: checklist.isCompleted,
						isAiGenerated: checklist.isAiGenerated,
						position: checklist.position,
						completedAt: checklist.isCompleted ? now : null,
						createdAt: now,
						updatedAt: now,
					})),
					{ transaction },
				);
			}

			const existingComments = await queryInterface.sequelize.query(
				`
				SELECT "CardId", "UserId", content
				FROM "Comments"
				WHERE "CardId" IN (:cardIds) AND "UserId" IN (:userIds)
				`,
				{
					replacements: {
						cardIds: Object.values(cardsByTitle).map((card) => card.id),
						userIds: Object.values(usersByEmail).map((user) => user.id),
					},
					type: QueryTypes.SELECT,
					transaction,
				},
			);
			const commentKeys = new Set(
				existingComments.map(
					(comment) => `${comment.CardId}:${comment.UserId}:${comment.content}`,
				),
			);
			const missingComments = commentSeeds.filter((comment) => {
				const CardId = cardsByTitle[comment.cardTitle].id;
				const UserId = usersByEmail[comment.userEmail].id;
				return !commentKeys.has(`${CardId}:${UserId}:${comment.content}`);
			});

			if (missingComments.length) {
				await queryInterface.bulkInsert(
					"Comments",
					missingComments.map((comment) => ({
						CardId: cardsByTitle[comment.cardTitle].id,
						UserId: usersByEmail[comment.userEmail].id,
						content: comment.content,
						createdAt: now,
						updatedAt: now,
					})),
					{ transaction },
				);
			}

			const notificationSeeds = [
				...boardMemberSeeds
					.filter((member) => member.role === "member")
					.map((member) => ({
						UserId: usersByEmail[member.userEmail].id,
						ActorId: usersByEmail[member.addedByEmail]?.id || null,
						BoardId: boardsByName[member.boardName].id,
						CardId: null,
						type: "board_added",
						title: "Added to board",
						message: `${usersByEmail[member.addedByEmail]?.name || "Someone"} added you to board "${member.boardName}".`,
					})),
				...cardAssigneeSeeds.map((assignee) => {
					const card = cardsByTitle[assignee.cardTitle];
					const board = Object.values(boardsByName).find(
						(boardData) => boardData.id === card.BoardId,
					);
					return {
						UserId: usersByEmail[assignee.userEmail].id,
						ActorId: usersByEmail[assignee.assignedByEmail]?.id || null,
						BoardId: card.BoardId,
						CardId: card.id,
						type: "card_assigned",
						title: "Assigned to card",
						message: `${usersByEmail[assignee.assignedByEmail]?.name || "Someone"} assigned you to card "${assignee.cardTitle}" in board "${board.name}".`,
					};
				}),
			];

			const existingNotifications = await queryInterface.sequelize.query(
				`
				SELECT "UserId", "BoardId", "CardId", type, title, message
				FROM "Notifications"
				WHERE "UserId" IN (:userIds) AND "BoardId" IN (:boardIds)
				`,
				{
					replacements: {
						userIds: Object.values(usersByEmail).map((user) => user.id),
						boardIds: Object.values(boardsByName).map((board) => board.id),
					},
					type: QueryTypes.SELECT,
					transaction,
				},
			);
			const notificationKeys = new Set(
				existingNotifications.map(
					(notification) =>
						`${notification.UserId}:${notification.BoardId}:${notification.CardId || "null"}:${notification.type}:${notification.message}`,
				),
			);
			const missingNotifications = notificationSeeds.filter((notification) => {
				const key = `${notification.UserId}:${notification.BoardId}:${notification.CardId || "null"}:${notification.type}:${notification.message}`;
				return !notificationKeys.has(key);
			});

			if (missingNotifications.length) {
				await queryInterface.bulkInsert(
					"Notifications",
					missingNotifications.map((notification, index) => ({
						...notification,
						isRead: index % 4 === 0,
						readAt: index % 4 === 0 ? now : null,
						createdAt: now,
						updatedAt: now,
					})),
					{ transaction },
				);
			}

			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	},

	async down(queryInterface, Sequelize) {
		const transaction = await queryInterface.sequelize.transaction();

		try {
			const userEmails = userSeeds.map((user) => user.email);
			const boardNames = boardSeeds.map((board) => board.name);
			const cardTitles = cardSeeds.map((card) => card.title);

			const usersByEmail = await selectUsers(
				queryInterface,
				userEmails,
				transaction,
			);
			const boardsByName = await selectBoards(
				queryInterface,
				boardNames,
				transaction,
			);
			const cardsByTitle = await selectCards(
				queryInterface,
				cardTitles,
				transaction,
			);

			const userIds = Object.values(usersByEmail).map((user) => user.id);
			const boardIds = Object.values(boardsByName).map((board) => board.id);
			const cardIds = Object.values(cardsByTitle).map((card) => card.id);

			if (boardIds.length) {
				await queryInterface.bulkDelete(
					"Notifications",
					{ BoardId: { [Sequelize.Op.in]: boardIds } },
					{ transaction },
				);
			}

			if (cardIds.length) {
				await queryInterface.bulkDelete(
					"Comments",
					{ CardId: { [Sequelize.Op.in]: cardIds } },
					{ transaction },
				);
				await queryInterface.bulkDelete(
					"Checklists",
					{ CardId: { [Sequelize.Op.in]: cardIds } },
					{ transaction },
				);
				await queryInterface.bulkDelete(
					"CardAssignees",
					{ CardId: { [Sequelize.Op.in]: cardIds } },
					{ transaction },
				);
				await queryInterface.bulkDelete(
					"Cards",
					{ id: { [Sequelize.Op.in]: cardIds } },
					{ transaction },
				);
			}

			if (boardIds.length) {
				await queryInterface.bulkDelete(
					"Lists",
					{ BoardId: { [Sequelize.Op.in]: boardIds } },
					{ transaction },
				);
				await queryInterface.bulkDelete(
					"BoardMembers",
					{ BoardId: { [Sequelize.Op.in]: boardIds } },
					{ transaction },
				);
				await queryInterface.bulkDelete(
					"Boards",
					{ id: { [Sequelize.Op.in]: boardIds } },
					{ transaction },
				);
			}

			if (userIds.length) {
				await queryInterface.bulkDelete(
					"Users",
					{ id: { [Sequelize.Op.in]: userIds } },
					{ transaction },
				);
			}

			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	},
};
