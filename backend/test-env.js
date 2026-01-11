const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

const envPath = path.join(__dirname, '.env');
console.log(`Checking for .env at: ${envPath}`);

if (fs.existsSync(envPath)) {
    console.log('.env file FOUND.');
    const result = dotenv.config({ path: envPath });
    if (result.error) {
        console.log('Error loading .env file:', result.error);
    } else {
        console.log('.env loaded successfully.');
    }
} else {
    console.log('.env file NOT FOUND at expected path.');
}

console.log('GOOGLE_API_KEY present:', !!process.env.GOOGLE_API_KEY);
if (process.env.GOOGLE_API_KEY) {
    console.log('GOOGLE_API_KEY length:', process.env.GOOGLE_API_KEY.length);
    console.log('GOOGLE_API_KEY first 4 chars:', process.env.GOOGLE_API_KEY.substring(0, 4));
}
