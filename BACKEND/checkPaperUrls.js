const mongoose = require('mongoose');
const Paper = require('./models/Paper');
require('dotenv').config();

async function checkPaperUrls() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const papers = await Paper.find({}).sort({ _id: -1 }).limit(3);
        
        if (papers.length === 0) {
            console.log("No papers found.");
        } else {
            papers.forEach(p => {
                console.log(`- Title: ${p.title}`);
                console.log(`  fileUrl: ${p.fileUrl}`);
                console.log(`  cloudinaryId: ${p.cloudinaryId}`);
                console.log(`  isVerified: ${p.isVerified}`);
            });
        }
        process.exit();
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

checkPaperUrls();
