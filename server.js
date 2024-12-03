const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Load data files from root directory
const gravesFilePath = path.join(__dirname, 'graves.json');
const adminsFilePath = path.join(__dirname, 'admins.json');

// Read graves data
let gravesData = JSON.parse(fs.readFileSync(gravesFilePath, 'utf8'));
let adminsData = JSON.parse(fs.readFileSync(adminsFilePath, 'utf8'));

// Search grave - Move this route before the static file middleware
app.get('/api/graves/search/:name', (req, res) => {
    const searchName = req.params.name.toLowerCase().trim();
    console.log('Searching for name:', searchName);
    console.log('Available graves:', gravesData.graves);
    
    const grave = gravesData.graves.find(
        grave => grave.name.toLowerCase().trim() === searchName
    );
    
    if (grave) {
        console.log('Found grave:', grave);
        res.json(grave);
    } else {
        console.log('No grave found');
        res.status(404).json({ message: 'Grave not found' });
    }
});

// Admin login
app.post('/api/login', (req, res) => {
    console.log('Login request received:', req.body);
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Username and password are required' 
        });
    }

    const admin = adminsData.admins.find(
        admin => admin.username === username && admin.password === password
    );
    
    console.log('Admin found:', admin ? 'yes' : 'no');
    
    if (admin) {
        res.json({ success: true });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Invalid credentials'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Loaded graves:', gravesData.graves.length);
    console.log('Loaded admins:', adminsData.admins.length);
}); 