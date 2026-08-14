const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "blogify",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
});

module.exports = { cloudinary, storage };

// Having this in one place means both blog.js (cover images) and user.js (profile images) can share the same Cloudinary connection instead of duplicating config.