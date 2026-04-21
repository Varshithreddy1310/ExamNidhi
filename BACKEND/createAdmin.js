const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB:", mongoose.connection.name);
        
        const existingAdmin = await User.findOne({ email: 'admin@examnidhi.com' });
        if (existingAdmin) {
            console.log("Admin already exists.");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = new User({
            username: 'Admin',
            email: 'admin@examnidhi.com',
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();
        console.log("✅ Admin user created successfully!");
        console.log("Email: admin@examnidhi.com");
        console.log("Password: admin123");
        
        process.exit();
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

createAdmin();
