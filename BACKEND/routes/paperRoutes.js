const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorize } = require('../middleware/authMiddleware');

const { 
    uploadPaper, 
    studentUploadPaper,
    getPendingPapers, 
    verifyPaper, 
    toggleProgress,
    getAllPapers,
    getMe,
    deletePaper,
    getStats
} = require('../controllers/paperController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- STUDENT & ADMIN ROUTES ---

// Submit paper for review
router.post('/student-upload', protect, authorize('student', 'admin'), upload.single('pdf'), studentUploadPaper);

// View verified papers
router.get('/all', protect, authorize('student', 'admin'), getAllPapers);

// Save progress
router.post('/toggle-progress/:id', protect, authorize('student', 'admin'), toggleProgress);

// Get current user details (to load checkboxes on refresh)
router.get('/me', protect, authorize('student', 'admin'), getMe);

// Get Stats
router.get('/stats', protect, authorize('student', 'admin'), getStats);

// --- ADMIN ONLY ROUTES ---

// Upload papers
router.post('/upload', protect, authorize('admin'), upload.single('pdf'), uploadPaper);

// View pending queue
router.get('/pending', protect, authorize('admin'), getPendingPapers);

// Approve paper
router.put('/verify/:id', protect, authorize('admin'), verifyPaper);

// Delete paper
router.delete('/delete/:id', protect, authorize('admin'), deletePaper);

module.exports = router;