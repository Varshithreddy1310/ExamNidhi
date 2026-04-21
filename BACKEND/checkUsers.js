const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB:", mongoose.connection.name);
        
        const users = await User.find({});
        if (users.length === 0) {
            console.log("No users found in the database.");
        } else {
            console.log(`Found ${users.length} users:`);
            users.forEach(u => {
                console.log(`- Username: ${u.username}, Email: ${u.email}, Phone: ${u.phone}, Role: ${u.role}`);
            });
        }
        process.exit();
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

checkUsers();
