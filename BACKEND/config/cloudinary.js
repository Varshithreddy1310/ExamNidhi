const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'examnidhi_papers',
        resource_type: 'image', // PDFs work better as 'image' type in Cloudinary for viewing
        format: 'pdf',
        public_id: (req, file) => {
            const fileName = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
            return `${Date.now()}-${fileName}`;
        }
    }
});

module.exports = { cloudinary, storage };
