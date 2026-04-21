const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function testCloudinary() {
    try {
        console.log("Testing Cloudinary with settings:", {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY
        });
        
        const result = await cloudinary.api.ping();
        console.log("✅ Cloudinary Connection Crystal Clear:", result);

        console.log("\nAttempting a test upload...");
        const uploadResult = await cloudinary.uploader.upload("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", {
            folder: 'test_uploads',
            resource_type: 'image',
            format: 'pdf',
            type: 'upload'
        });

        console.log("✅ Test Upload Successful!");
        const testUrl = uploadResult.secure_url;
        console.log("Public URL:", testUrl);

        console.log("\nChecking if URL is publicly accessible via HTTP...");
        try {
            const response = await fetch(testUrl);
            console.log(`✅ HTTP Status: ${response.status} ${response.statusText}`);
            if (response.status === 401) {
                console.error("❌ CRITICAL: Access Denied (401). Your account is blocking PDF delivery.");
            } else if (response.ok) {
                console.log("✅ Access is Publicly Granted!");
            }
        } catch (httpErr) {
            console.error("❌ HTTP Fetch Failed:", httpErr.message);
        }

        console.log("\n--- CORE FIX ---");
        console.log("1. Go to Cloudinary Dashboard -> Settings -> Security");
        console.log("2. Find 'Restricted Media Types' and UNCHECK 'PDF'.");
        console.log("3. Also ensure 'PDF and ZIP files delivery' is set to ALLOWED.");
        
        process.exit();
    } catch (err) {
        console.error("❌ Cloudinary Test Failed:");
        console.error(err);
        process.exit(1);
    }
}

testCloudinary();
