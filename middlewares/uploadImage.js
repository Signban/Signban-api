const multer = require("multer");
const { AppError } = require("../models/utils/class");
const { errorName } = require("../helpers/enums");

const storage = multer.memoryStorage();

const uploadImage = multer({
	storage,
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
	fileFilter: (req, file, cb) => {
		if (!file.mimetype?.startsWith("image/")) {
			cb(new AppError(errorName.BadRequest, "Only image files are allowed"));
			return;
		}

		cb(null, true);
	},
});

module.exports = uploadImage;
