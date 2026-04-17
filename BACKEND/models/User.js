const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String }, 
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    completedPapers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Paper' }] 
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);