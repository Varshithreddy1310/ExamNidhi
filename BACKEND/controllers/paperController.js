const Paper = require('../models/Paper');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// 1. Admin uploads a new paper
exports.uploadPaper = async (req, res) => {
    try {
        const { title, subject, year, academicYear, branch, semester } = req.body;
        const newPaper = new Paper({
            title,
            subject,
            year,
            academicYear: academicYear || "1st Year",
            branch: branch || "Computer Science",
            semester: semester || "Sem 1",
            fileUrl: req.file.path, 
            uploadedBy: req.user.id,
            isVerified: true // Since only Admin uploads, we can set it to true immediately
        });
        await newPaper.save();
        res.status(201).json({ message: "Paper uploaded successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 1a. Student uploads a new paper (Requires Admin Approval)
exports.studentUploadPaper = async (req, res) => {
    try {
        const { title, subject, year, academicYear, branch, semester, contributorName, scholarNumber } = req.body;
        const newPaper = new Paper({
            title,
            subject,
            year,
            academicYear: academicYear || "1st Year",
            branch: branch || "Computer Science",
            semester: semester || "Sem 1",
            fileUrl: req.file.path, 
            uploadedBy: req.user.id,
            contributorName,
            scholarNumber,
            isVerified: false // Admin must verify
        });
        await newPaper.save();
        res.status(201).json({ message: "Your paper has been submitted successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Get all verified papers for the Student Dashboard
exports.getAllPapers = async (req, res) => {
    try {
        const papers = await Paper.find({ isVerified: true });
        res.json(papers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Admin gets any pending papers (if you ever change logic to allow student uploads)
exports.getPendingPapers = async (req, res) => {
    try {
        const papers = await Paper.find({ isVerified: false });
        res.json(papers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Admin approves a paper
exports.verifyPaper = async (req, res) => {
    try {
        const paper = await Paper.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
        if (!paper) {
            return res.status(404).json({ message: "Paper not found" });
        }
        res.json({ message: "Paper verified and published!", paper });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. Toggle progress (Check/Uncheck)
exports.toggleProgress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const paperId = req.params.id;

        const index = user.completedPapers.indexOf(paperId);
        if (index > -1) {
            user.completedPapers.splice(index, 1); // Uncheck
        } else {
            user.completedPapers.push(paperId); // Check
        }

        await user.save();
        res.json({ updatedProgress: user.completedPapers });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 6. Get current user data (including progress)
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 7. Admin deletes a paper
exports.deletePaper = async (req, res) => {
    try {
        const paper = await Paper.findById(req.params.id);
        if (!paper) {
            return res.status(404).json({ message: "Paper not found" });
        }

        // Remove from file system
        try {
            const fullPath = path.join(__dirname, '..', paper.fileUrl);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        } catch(e) {
            console.error("Error deleting file:", e);
        }

        await Paper.findByIdAndDelete(req.params.id);
        
        // Remove from all users' progress
        await User.updateMany({}, { $pull: { completedPapers: req.params.id } });

        res.json({ message: "Paper deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 8. Get statistics mapping
exports.getStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const totalPapers = await Paper.countDocuments({ isVerified: true });
        
        if (user.role === 'admin') {
            const uploadedPapers = await Paper.countDocuments({ uploadedBy: user._id });
            res.json({ type: 'admin', totalPapers, uploadedPapers });
        } else {
            const completedCount = user.completedPapers.length;
            res.json({ type: 'student', totalPapers, completedCount });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};