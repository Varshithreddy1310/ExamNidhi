const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    academicYear: { type: String, required: true, default: "1st Year" }, // Added to handle legacy
    branch: { type: String, required: true, default: "Computer Science" }, // Added for branch hierarchy
    semester: { type: String, required: true, default: "Sem 1" },        // Added to handle legacy
    year: { type: Number, required: true },
    fileUrl: { type: String, required: true }, // Path to the PDF
    cloudinaryId: { type: String }, // For deleting from Cloudinary
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    contributorName: { type: String }, // Optional field for student contributions
    scholarNumber: { type: String }, // Optional field for student contributions
    isVerified: { type: Boolean, default: false } // Admin changes this to true
});

module.exports = mongoose.model('Paper', paperSchema);