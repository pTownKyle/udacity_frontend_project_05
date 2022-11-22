// Bring in required modules
const path = require('path');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const { resolve } = require('path');
const { url } = require('inspector');
require('dotenv').config();

// Initialize & configure express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('dist'));

// Set Views Directory & Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Get API Credentials from .env file
const geoCodeUsername = process.env.GEOCODE_USERNAME;
const weatherBitApiKey = process.env.WEATHERBIT_API_KEY;
const pixaBayApiKey = process.env.PIXABAY_API_KEY;

// Get Weather Info
app.post('/trip', async (req, res) => {
    // Get trip destination from request body
    const tripDestination = req.body.tripDestination;

    // Get Latitude and Longitude
    let tripDestinationCoordinates = await getGeoCodeInfo(tripDestination)
        .then((coordinates) => coordinates)
        .catch((err) => console.log(err));

    // Get Weather Info
    let weatherData = await getWeatherInfo(
        tripDestinationCoordinates.latitude,
        tripDestinationCoordinates.longitude
    )
        .then((data) => data)
        .catch((err) => console.log(err));

    // Get Image Info
    let image = await getImage(tripDestination)
        .then((data) => {
            if (data.totalHits > 0) {
                return data.hits[0].webformatURL;
            } else {
                return 'https://cdn.pixabay.com/photo/2016/02/19/11/19/question-mark-1209646_960_720.png';
            }
        })
        .catch((err) => console.log(err));

    res.send({ weatherData, image });
});

// Setup Port
const port = 3030;

app.listen(port || process.env.PORT, () => {
    console.log('Server is running on port 3030');
});

// Get Travel Info)
function getTravelInfo(location) {
    console.log('Begin Getting Travel Info');
    getGeoCodeInfo(location);
}

// Get GeoCode Info from GeoNames API
function getGeoCodeInfo(location) {
    console.log('Getting Latitude and Longitude');
    const geoCodeURL = `http://api.geonames.org/searchJSON?q=${location}&maxRows=1&username=${geoCodeUsername}`;
    return fetch(geoCodeURL) //
        .then((res) => res.json())
        .then((data) => data.geonames[0])
        .then((geoCodeInfo) => {
            const latitude = geoCodeInfo.lat;
            const longitude = geoCodeInfo.lng;
            return { latitude, longitude };
        })
        .catch((err) => {
            console.log('Get GeoCode Error: ');
            console.log(err);
        });
}

// Get Weather Info from WeatherBit API
function getWeatherInfo(latitude, longitude) {
    console.log('Getting Weather Info');

    const weatherBitURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=${weatherBitApiKey}`;
    return fetch(weatherBitURL)
        .then((res) => res.json())
        .then((data) => data.data)
        .catch((err) => console.log(err));
}

// Get Image Info from PixaBay API
function getImage(tripDestination) {
    console.log('Getting Image Info');
    let urlTravelLocation = tripDestination.replace(' ', '+').replace(',', '');

    const pixaBayURL = `https://pixabay.com/api/?key=${pixaBayApiKey}&q="${urlTravelLocation}"&image_type=photo`;
    return fetch(pixaBayURL)
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err));
}
