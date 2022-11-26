// Setup Requirements
const fetch = require('node-fetch');
const dotenv = require('dotenv');

// Get API Credentials from .env file
const geoCodeUsername = process.env.GEOCODE_USERNAME;

// Import Functions
const { getGeoCodeInfo } = require('../server/server');

// Test
test('getGeoCodeInfo() should return an object with latitude and longitude', async () => {
    const location = 'Roberta, GA';
    const coordinates = await getGeoCodeInfo(location);
    expect(coordinates).toEqual({
        latitude: '32.72181',
        longitude: '-84.01324',
    });
});
