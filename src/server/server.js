// Bring in required modules
const path = require('path');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

// Initialize & configure express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('dist'));

// Get API Credentials from .env file
const geoCodeUsername = process.env.GEOCODE_USERNAME;
// Weatherbit API Key
// PixaBay API Key

// Get Weather Info
app.post('/trip', (req, res) => {
    console.log(req.body);
    const travelLocation = req.body.travelLocation;

    // Get GeoCode Info
    const geoCodeURL = `http://api.geonames.org/searchJSON?q=${travelLocation}&maxRows=1&username=${geoCodeUsername}`;
    fetch(geoCodeURL)
        .then((res) => {
            let data = res.json();
            return data;
        })
        .then((data) => {
            const { lat, lng } = data.geonames[0];
            console.log(lat, lng);
        });
    res.end();
});

// Setup Port
const port = 3030;

app.listen(port || process.env.PORT, () => {
    console.log('Server is running on port 3030');
});
