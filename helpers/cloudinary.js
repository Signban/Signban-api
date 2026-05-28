const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadBufferToCloudinary(buffer, options = {}) {
	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				resource_type: "image",
				overwrite: true,
				invalidate: true,
				...options,
			},
			(error, result) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(result);
			},
		);

		uploadStream.end(buffer);
	});
}

module.exports = {
	cloudinary,
	uploadBufferToCloudinary,
};
