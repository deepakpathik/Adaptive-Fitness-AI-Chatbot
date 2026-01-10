const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from default .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    if (process.env.DATABASE_URL) {
        console.log('Database URL: Loaded successfully');
    } else {
        console.log('Database URL: Not found');
    }
});
