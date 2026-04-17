const mongoose = require('mongoose');
const User = require('./models/User');
const Paper = require('./models/Paper');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// Function to create dummy pdfs
function createDummyPDF(filename) {
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, '%PDF-1.4\n1 0 obj\n<< /Title (Dummy PDF) >>\nendobj\n%%EOF');
    return filePath;
}

const populate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // Clear existing docs if needed or just add new
        // For safety, let's just create new papers and an admin user.
        
        let admin = await User.findOne({ username: 'admin123' });
        if (!admin) {
             const salt = await bcrypt.genSalt(10);
             const hash = await bcrypt.hash('adminpass', salt);
             admin = new User({ username: 'admin123', email: 'admin@pyq.com', password: hash, role: 'admin' });
             await admin.save();
             console.log("Created dummy admin");
        }

        let student = await User.findOne({ username: 'student123' });
        if (!student) {
             const salt = await bcrypt.genSalt(10);
             const hash = await bcrypt.hash('studentpass', salt);
             student = new User({ username: 'student123', email: 'student@pyq.com', password: hash, role: 'student' });
             await student.save();
             console.log("Created dummy student");
        }

        const p1File = Date.now() + '-math_midterm.pdf';
        createDummyPDF(p1File);

        const p1 = new Paper({
            title: "Calculus I Midterm",
            subject: "Mathematics",
            year: 2023,
            fileUrl: `uploads\\${p1File}`, 
            uploadedBy: admin._id,
            isVerified: true
        });

        const p2File = Date.now() + '-physics_final.pdf';
        createDummyPDF(p2File);
        
        const p2 = new Paper({
            title: "Physics 101 Final Exam",
            subject: "Physics",
            year: 2024,
            fileUrl: `uploads\\${p2File}`, 
            uploadedBy: admin._id,
            isVerified: true
        });

        const p3File = Date.now() + '-ds_assignment.pdf';
        createDummyPDF(p3File);
        
        const p3 = new Paper({
            title: "Data Structures Practice Set 2",
            subject: "Computer Science",
            year: 2025,
            fileUrl: `uploads\\${p3File}`, 
            uploadedBy: admin._id,
            isVerified: true
        });

        await p1.save();
        await p2.save();
        await p3.save();
        console.log("Inserted 3 dummy papers");

        process.exit(0);

    } catch(e) {
        console.error(e);
        process.exit(1);
    }
};

populate();
